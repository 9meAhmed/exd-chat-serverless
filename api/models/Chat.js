import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false },
    name: String,
    avatar: String,
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, default: "member" },
      },
    ],
    lastMessage: {
      messageId: mongoose.Schema.Types.ObjectId,
      text: String,
      senderId: mongoose.Schema.Types.ObjectId,
      createdAt: Date,
    },
  },
  { timestamps: true }
);

ChatSchema.index({ "members.userId": 1 });


export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
