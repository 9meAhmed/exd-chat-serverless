import connectDB from "../_db.js";
import auth from "../auth/_auth.js";
import Chat from "../models/Chat.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const user = await auth(req, res);

  try {
    await connectDB();

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    let chat = await Chat.findOne({
      isGroup: false,
      "members.userId": { $all: [user._id, userId] },
    });

    if (!chat) {
      chat = await Chat.create({
        isGroup: false,
        members: [{ userId: user._id }, { userId: userId }],
      });
    }

    res.status(200).json(chat);
  } catch (e) {
    res.status(401).json({
      message: "Something wrong please check the server logs.",
      error: e,
    });
    return null;
  }
}
