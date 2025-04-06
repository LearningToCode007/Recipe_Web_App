import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    favorites_list: {
      type: [String],
      ref: "Recipe",
    },
    compensation_balance: {
      type: Number,
      default: 0,
    },
  },
  { collection: "subscribers" }
);

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);
export default Subscriber;
