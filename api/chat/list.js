import connectDB from "../_db.js";
import auth from "../auth/_auth.js";
import Chat from "../models/Chat.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const user = await auth(req, res);

  try {
    await connectDB();

    const chats = await Chat.find({
      "members.userId": user._id,
    })
      .populate("members.userId", "name email avatar")
      .populate("lastMessage.senderId", "name avatar")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (e) {
    res
      .status(401)
      .json({ message: "Something wrong please check the server logs." });
    return null;
  }

  /*

  let chats = await Chat.find().lean();

  chats = await Promise.all(
    (chats = chats.map(async (chat) => {
      const lastMessage = await Message.findOne({ chat: chat._id })
        .sort({ createdAt: -1 })
        .lean();

      return {
        ...chat,
        lastMessage: lastMessage?.message || "No messages yet",
        timestamp: lastMessage?.createdAt || "",
        unread: 2,
        online: true,
      };
    }))
  );
  */
}
