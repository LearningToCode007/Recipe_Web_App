import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
  },
  { collection: "admins" }
);

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
