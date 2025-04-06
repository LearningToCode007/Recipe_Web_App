import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import Admin from "../collection-models/Admin.js";

// @route   POST /api/admins/login
// @desc    Authenticate admin & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (password !== admin.password) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user_id: admin._id,
      id: admin._id,
      role: "ROLE_ADMIN",
      email: admin.email,
    };

    jwt.sign(
      payload,
      process.env.JWT_TOKEN_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          ...admin.toJSON({ virtuals: true }),
          ...payload,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/admins
// @desc    Get all admins
// @access  Private
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/admins/:id
// @desc    Get admin by ID
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/admins
// @desc    Create a new admin
// @access  Private
router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const newAdmin = new Admin({
      name,
      email,
      password,
      role,
    });

    const admin = await newAdmin.save();
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admins/:id
// @desc    Update admin by ID
// @access  Private
router.put("/:id", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Build admin object
  const adminFields = {};
  if (name) adminFields.name = name;
  if (email) adminFields.email = email;
  if (password) adminFields.password = password;
  if (role) adminFields.role = role;

  try {
    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: adminFields },
      { new: true }
    );

    res.json(admin);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/admins/:id
// @desc    Delete admin by ID
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    await Admin.findByIdAndRemove(req.params.id);

    res.json({ msg: "Admin removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.status(500).send("Server Error");
  }
});

export default router;
