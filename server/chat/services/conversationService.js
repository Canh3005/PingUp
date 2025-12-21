import { parseLimit } from "../../utils/pagination.js";
import Conversation from "../models/Conversation.js";

class ConversationService {
  async createConversation({ userId, type, memberIds, title, avatar }) {
    // auto include self
    const uniqueMembers = Array.from(new Set([userId, ...memberIds]));

    if (type === "direct") {
      if (uniqueMembers.length !== 2) {
        throw new Error("Direct conversation must have exactly 2 members");
      }
      // reuse existing direct conv
      const existing = await Conversation.findOne({
        type: "direct",
        memberIds: { $all: [uniqueMembers[0], uniqueMembers[1]] },
        $expr: { $eq: [{ $size: "$memberIds" }, 2] },
      }).lean();
      if (existing) return existing;
    }

    const conv = await Conversation.create({
      type,
      memberIds: uniqueMembers,
      title: type === "group" ? title || "" : "",
      avatar: type === "group" ? avatar || "" : "",
      createdBy: userId,
    });

    return conv.toObject ? conv.toObject() : conv;
  }

  async getConversationOrThrow({ userId, conversationId }) {
    const conv = await Conversation.findById(conversationId);
    if (!conv) throw new Error("Conversation not found");
    if (!conv.memberIds.includes(userId)) throw new Error("Not a member");
    return conv;
  }

  async listInbox({ userId, cursor, limit }) {
    const lim = parseLimit(limit, 30, 50);
    const cursorDate = cursor ? new Date(cursor) : null;
    const q = { memberIds: userId };
    if (cursorDate) q.updatedAt = { $lt: cursorDate };
    const items = await Conversation.find(q)
      .sort({ updatedAt: -1 })
      .limit(lim)
      .lean();

    const nextCursor = items.length
      ? items[items.length - 1].updatedAt.toISOString()
      : null;
    return { items, nextCursor };
  }
}

export default new ConversationService();
