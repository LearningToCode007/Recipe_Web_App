import jwt from "jsonwebtoken";

export const createJwtToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
