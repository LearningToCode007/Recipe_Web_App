import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import Subscriber from "../collection-models/Subscriber.js";
import Subscription from "../collection-models/Subscription.js";
import { getSubscription } from "./subscriptions.js";

// @route   POST /api/subscribers/login
// @desc    Authenticate subscriber & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (password !== subscriber.password) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Find an active subscription for the given user_id
    const subscription = await Subscription.findOne({
      user_id: subscriber._id,
      //subscription_status: "Active",
    });

    const payload = {
      user_id: subscriber._id,
      id: subscriber._id,
      role: "ROLE_SUBSCRIBER",
      email: subscriber.email,
    };

    jwt.sign(
      payload,
      process.env.JWT_TOKEN_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          ...subscriber.toJSON({ virtuals: true }),
          ...payload,
          subscription: subscription ? { ...subscription.toJSON() } : {},
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/subscribers
// @desc    Create a new subscriber
// @access  Public
router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    city,
    state,
    zipcode,
    dob,
  } = req.body;

  try {
    // Check if email already exists
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ msg: "Subscriber already exists" });
    }

    // Create new subscriber instance
    subscriber = new Subscriber({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      city,
      state,
      zipcode,
      dob,
    });

    // Save subscriber to database
    await subscriber.save();

    res.json(subscriber); // Respond with the saved subscriber
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/subscribers
// @desc    Get all subscribers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    const finalResponse = await Promise.all(
      subscribers.map((subscriber) => getSubscription(subscriber.toJSON()))
    );
    res.json(finalResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/subscribers/:id
// @desc    Get a subscriber by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ msg: "Subscriber not found" });
    }

    // Find an active subscription for the given user_id
    const subscription = await Subscription.findOne({
      user_id: req.params.id,
      subscription_status: "Active",
    });

    const response = {
      ...subscriber.toJSON(),
      subscription: subscription ? { ...subscription.toJSON() } : {},
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/subscribers/:id
// @desc    Update a subscriber
// @access  Public
router.put("/:id", async (req, res) => {
  const { first_name, last_name, email, password, favorites_list } = req.body;

  const updatedFields = {
    first_name,
    last_name,
    email,
    password,
    favorites_list,
  };

  try {
    let subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ msg: "Subscriber not found" });
    }

    subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(subscriber);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/:id/update-favorites", async (req, res) => {
  const { favorites_list } = req.body;

  const updatedFields = {
    favorites_list,
  };

  try {
    let subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ msg: "Subscriber not found" });
    }

    subscriber.favorites_list = updatedFields.favorites_list;
    await subscriber.save();

    res.json(subscriber);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/subscribers/:id
// @desc    Delete a subscriber
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    let subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ msg: "Subscriber not found" });
    }

    await Subscriber.findByIdAndRemove(req.params.id);
    res.json({ msg: "Subscriber removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
