import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    readBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        readAt: Date,
      },
    ],
  },
  { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: -1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
