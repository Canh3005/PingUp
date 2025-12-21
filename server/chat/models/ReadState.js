import mongoose from "mongoose";

const ReadStateSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    lastReadMessageId: { type: String, default: "" },
    lastReadAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ReadStateSchema.index({ conversationId: 1, userId: 1 }, { unique: true });

const ReadState = mongoose.model("ReadState", ReadStateSchema);
export default ReadState;