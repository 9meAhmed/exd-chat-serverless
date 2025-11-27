import connectDB from "../_db.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: "email required" });
  if (!password) return res.status(400).json({ error: "password required" });

  await connectDB();

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ user: { ...user._doc, password: undefined }, token });
}
