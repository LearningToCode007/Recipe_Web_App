import express from "express";
const router = express.Router();
import Subscription from "../collection-models/Subscription.js";
import Payment from "../collection-models/Payment.js";
import moment from "moment";
import checkSubscriptionStatus from "./checkSubscriptionStatus.js";

// Apply middleware to check subscription status before all routes
router.use(checkSubscriptionStatus);

// @route   GET /api/subscriptions
// @desc    Get all subscriptions
// @access  Public
router.get("/", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/subscriptions/:id
// @desc    Get subscription by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ msg: "Subscription not found" });
    }
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Subscription not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/subscriptions/check-subscription/:user_id
// @desc    Check if a user has an active subscription
// @access  Public
router.get("/check-subscription/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Find an active subscription for the given user_id
    const subscription = await Subscription.findOne({
      user_id,
      subscription_status: "Active",
    });

    res.json(subscription || {});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/subscriptions
// @desc    Add new subscription
// @access  Private
router.post("/", async (req, res) => {
  const { user_id, cardNumber, cardName, expiryDate, securityCode, amount } =
    req.body;

  try {
    // Set start date to today's date
    const startDate = moment().format("MM-DD-YYYY");

    // Check for an existing subscription
    let subscription = await Subscription.findOne({ user_id });

    if (subscription && subscription.subscription_status === "Active") {
      // If an active subscription exists, extend the end date by one year
      subscription.end_date = moment(subscription.end_date, "MM-DD-YYYY")
        .add(1, "year")
        .format("MM-DD-YYYY");
    } else {
      // If no active subscription exists, create a new one
      const endDate = moment().add(1, "year").format("MM-DD-YYYY");
      subscription = new Subscription({
        user_id,
        end_date: endDate,
        start_date: startDate,
        subscription_status: "Active",
      });
    }

    subscription = await subscription.save();

    // Save the payment details
    const newPayment = new Payment({
      subscriber_id: user_id,
      amount,
      card_number: cardNumber,
      card_name: cardName,
      expiry_date: expiryDate,
      security_code: securityCode,
      payment_date: moment().format(), // Assuming payment_date should be current date and time
      payment_status: "Success",
    });

    await newPayment.save();

    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/subscriptions/:id
// @desc    Update subscription
// @access  Private
router.put("/:id", async (req, res) => {
  const { user_id, end_date, start_date, subscription_status } = req.body;

  // Build subscription object
  const subscriptionFields = {};
  if (user_id) subscriptionFields.user_id = user_id;
  if (end_date) subscriptionFields.end_date = end_date;
  if (start_date) subscriptionFields.start_date = start_date;
  if (subscription_status)
    subscriptionFields.subscription_status = subscription_status;

  try {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ msg: "Subscription not found" });
    }

    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { $set: subscriptionFields },
      { new: true }
    );

    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/subscriptions/:id
// @desc    Delete subscription
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ msg: "Subscription not found" });
    }

    await Subscription.findByIdAndRemove(req.params.id);

    res.json({ msg: "Subscription removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export const getSubscription = async (obj) => {
  const subscription = await Subscription.findOne({
    user_id: obj._id,
    //subscription_status: "Active",
  });
  obj.subscription = subscription;
  return obj;
};

export default router;
