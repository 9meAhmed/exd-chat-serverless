import connectDB from "./_db.js";
import Message from "./models/Message.js";
import User from "./models/User.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { chat, sender } = req.body;

  await connectDB();

  const user = await User.findById(sender._id).lean();

  const messages = await Message.find({ chatId: chat._id }).lean();

  const messagesData = messages.map((msg) => {
    const isSender = msg.senderId.equals(user._id);
    return {
      id: msg._id,
      text: msg.text,
      sender: isSender ? "sender" : "other",
      timestamp: new Date(msg.createdAt - 300000),
    };
  });

  res.status(201).json(messagesData);
}
