import connectDB from "./_db.js";
import User from "./models/User.js";
import Message from "./models/Message.js";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { sender, contact, message } = req.body;

  if (!message) return res.status(400).json({ error: "Message required" });
  if (!sender) return res.status(400).json({ error: "sender required" });
  if (!contact) return res.status(400).json({ error: "contact required" });

  try {
    await connectDB();

    const user = await User.findById(sender._id).lean();

    if (user) {
      const msg = await Message.create({
        chatId: contact._id,
        senderId: user._id,
        text: message,
      });

      const msgData = {
        id: msg._id,
        text: message,
        sender,
        timestamp: new Date(msg.createdAt - 300000),
        chat: msg.chatId,
      };

      await pusher.trigger("adored-sage-858", "new-message", msgData);

      res.status(201).json(msgData);
    }
  } catch (error) {
    console.log(error);
  }
}
