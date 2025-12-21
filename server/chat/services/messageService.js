import { parseLimit } from "../../utils/pagination.js";
import Message from "../models/Message.js";
import conversationService from "./conversationService.js";

class MessageService {
  async listMessages({ userId, conversationId, limit, before }) {
    await conversationService.getConversationOrThrow({ userId, conversationId });

    const lim = parseLimit(limit, 30, 100);
    const beforeDate = before ? new Date(before) : null;
    const q = { conversationId, deletedAt: null };
    if (beforeDate) q.createdAt = { $lt: beforeDate };
    const items = await Message.find(q).sort({ createdAt: -1 }).limit(lim).lean();

    const nextCursor = items.length ? items[items.length - 1].createdAt.toISOString() : null;
    return { items, nextCursor };
  }
};

export default new MessageService();