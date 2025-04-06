import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import RecipeWriter from "../collection-models/RecipeWriter.js";
import Subscription from "../collection-models/Subscription.js";
import { getSubscription } from "./subscriptions.js";

// @route   POST /api/recipeWriters/login
// @desc    Authenticate recipe writer & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let writer = await RecipeWriter.findOne({ email });
    if (!writer) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (password !== writer.password) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user_id: writer._id,
      id: writer._id,
      role: "ROLE_RECIPE_WRITER",
      email: writer.email,
    };

    // Find an active subscription for the given user_id
    const subscription = await Subscription.findOne({
      user_id: writer._id,
    });

    jwt.sign(
      payload,
      process.env.JWT_TOKEN_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          ...writer.toJSON({ virtuals: true }),
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

// @route   POST /api/recipeWriters
// @desc    Create a new recipe writer
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
    let writer = new RecipeWriter({
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

    await writer.save();
    res.json(writer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/recipeWriters
// @desc    Get all recipe writers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const writers = await RecipeWriter.find();
    const finalResponse = await Promise.all(
      writers.map((writer) => getSubscription(writer.toJSON()))
    );
    res.json(finalResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/recipeWriters/:id
// @desc    Get a recipe writer by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const writer = await RecipeWriter.findById(req.params.id);
    if (!writer) {
      return res.status(404).json({ msg: "Recipe writer not found" });
    }
    // Find an active subscription for the given user_id
    const subscription = await Subscription.findOne({
      user_id: writer._id,
    });

    res.json({
      ...writer.toJSON({ virtuals: true }),
      subscription: subscription ? { ...subscription.toJSON() } : {},
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/recipeWriters/:id
// @desc    Update a recipe writer
// @access  Public
router.put("/:id", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    compensation_balance,
    favorites_list,
    status,
  } = req.body;

  const updatedFields = {};

  if (first_name) updatedFields.first_name = first_name;
  if (last_name) updatedFields.last_name = last_name;
  if (email) updatedFields.email = email;
  if (password) updatedFields.password = password;
  if (compensation_balance)
    updatedFields.compensation_balance = compensation_balance;
  if (favorites_list) updatedFields.favorites_list = favorites_list;
  if (status) updatedFields.status = status;

  try {
    let writer = await RecipeWriter.findById(req.params.id);
    if (!writer) {
      return res.status(404).json({ msg: "Recipe writer not found" });
    }

    writer = await RecipeWriter.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(writer);
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
    let writer = await RecipeWriter.findById(req.params.id);
    if (!writer) {
      return res.status(404).json({ msg: "Recipe writer not found" });
    }

    writer = await RecipeWriter.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(writer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/recipeWriters/:id
// @desc    Delete a recipe writer
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    let writer = await RecipeWriter.findById(req.params.id);
    if (!writer) {
      return res.status(404).json({ msg: "Recipe writer not found" });
    }

    await RecipeWriter.findByIdAndRemove(req.params.id);
    res.json({ msg: "Recipe writer removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
