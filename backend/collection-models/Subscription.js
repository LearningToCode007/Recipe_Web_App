import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      ref: "User",
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    subscription_status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
  },
  { collection: "subscriptions" }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;
