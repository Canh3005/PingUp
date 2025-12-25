import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['direct', 'group'], required: true },
    // MVP: memberIds array (đến 1k users vẫn ổn)
    memberIds: { type: [String], required: true, index: true },
    title: { type: String, default: '' }, // group
    avatar: { type: String, default: '' }, // group
    createdBy: { type: String, default: '' },
    lastMessageId: { type: String, default: '' },
    lastMessageAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Query inbox nhanh
ConversationSchema.index({ memberIds: 1, updatedAt: -1 });

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;