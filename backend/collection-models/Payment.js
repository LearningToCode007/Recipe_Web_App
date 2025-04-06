import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    subscriber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    card_number: {
      type: String,
      required: true,
    },
    card_name: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: String,
      required: true,
    },
    security_code: {
      type: String,
      required: true,
    },
    payment_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    payment_status: {
      type: String,
      default: "Pending",
      required: true,
    },
  },
  { collection: "payments" }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
