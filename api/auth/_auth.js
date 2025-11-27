import connectDB from "../_db.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export default async function auth(req, res) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: "Missing token" });
    return null;
  }

  try {
    await connectDB();
    const token = header.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return null;
    }

    return user;
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
    return null;
  }
}
