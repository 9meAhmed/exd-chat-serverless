import { connectDB, User, Chat, Message } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { chat, sender } = req.body;

  await connectDB();

  const user = await User.findOne({ name: sender.name }).lean();

  const messages = await Message.find({ chat }).lean();

  const messagesData = messages.map((msg) => {
    const isSender = msg.user._id.equals(user._id);
    return {
      id: msg._id,
      text: msg.message,
      sender: isSender ? "sender" : "other",
      timestamp: new Date(msg.createdAt - 300000),
    };
  });

  res.status(201).json(messagesData);
}
