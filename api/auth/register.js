import connectDB from "../_db";
import User from "../models/User";

export async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  if (!name) return res.status(400).json({ error: "name required" });
  if (!email) return res.status(400).json({ error: "email required" });
  if (!password) return res.status(400).json({ error: "password required" });

  await connectDB();

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) return res.status(409).json({ message: "User exists" });

  const user = await User.create({ name, email, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ user, token });
}
