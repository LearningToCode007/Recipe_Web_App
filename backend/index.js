import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from "./routes/admins.js";
import recipeWritersRoutes from "./routes/recipeWriters.js";
import subscriberRoutes from "./routes/subscribers.js";
import recipeRoutes from "./routes/recipes.js";
import categoryRoutes from "./routes/categories.js";
import paymentRoutes from "./routes/payments.js";
import subscriptionRoutes from "./routes/subscriptions.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'images')));

//  Routes
app.use("/api/admins", adminRoutes);
app.use("/api/recipe-writers", recipeWritersRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
