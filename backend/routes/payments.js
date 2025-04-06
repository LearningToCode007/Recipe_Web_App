import express from "express";
const router = express.Router();
import Payment from "../collection-models/Payment.js";

// @route   GET /api/payments
// @desc    Get all payments
// @access  Public
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Payment not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/payments
// @desc    Add new payment
// @access  Private
router.post("/", async (req, res) => {
  const {
    subscriber_id,
    amount,
    card_number,
    card_name,
    expiry_date,
    security_code,
    payment_date,
    payment_status,
  } = req.body;

  try {
    const newPayment = new Payment({
      subscriber_id,
      amount,
      card_number,
      card_name,
      expiry_date,
      security_code,
      payment_date,
      payment_status,
    });

    const payment = await newPayment.save();
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/payments/:id
// @desc    Update payment
// @access  Private
router.put("/:id", async (req, res) => {
  const {
    subscriber_id,
    amount,
    card_number,
    card_name,
    expiry_date,
    security_code,
    payment_date,
    payment_status,
  } = req.body;

  // Build payment object
  const paymentFields = {};
  if (subscriber_id) paymentFields.subscriber_id = subscriber_id;
  if (amount) paymentFields.amount = amount;
  if (card_number) paymentFields.card_number = card_number;
  if (card_name) paymentFields.card_name = card_name;
  if (expiry_date) paymentFields.expiry_date = expiry_date;
  if (security_code) paymentFields.security_code = security_code;
  if (payment_date) paymentFields.payment_date = payment_date;
  if (payment_status) paymentFields.payment_status = payment_status;

  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: paymentFields },
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/payments/:id
// @desc    Delete payment
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    await Payment.findByIdAndRemove(req.params.id);

    res.json({ msg: "Payment removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
