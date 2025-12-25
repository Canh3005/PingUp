import { parseLimit } from "../../utils/pagination.js";
import Conversation from "../models/Conversation.js";
import User from "../../models/User.js";
import UserProfile from "../../models/UserProfile.js";
import Message from "../models/Message.js";

class ConversationService {
  async createConversation({ userId, type, memberIds, title, avatar }) {
    // Validate inputs
    if (!userId) {
      throw new Error("userId is required");
    }
    if (!memberIds || !Array.isArray(memberIds)) {
      throw new Error("memberIds must be an array");
    }
    
    // auto include self - convert all to strings
    const userIdStr = userId.toString ? userId.toString() : String(userId);
    const memberIdsStr = memberIds.map(id => id.toString ? id.toString() : String(id));
    const uniqueMembers = Array.from(new Set([userIdStr, ...memberIdsStr]));

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
      title,
      avatar,
      createdBy: userIdStr,
    });

    return conv.toObject ? conv.toObject() : conv;
  }

  async getConversationOrThrow({ userId, conversationId }) {
    const conv = await Conversation.findById(conversationId);
    if (!conv) throw new Error("Conversation not found");
    
    // Convert userId to string for comparison since memberIds are strings
    const userIdStr = userId.toString ? userId.toString() : String(userId);
    
    // Debug logging
    console.log('[getConversationOrThrow] userId:', userIdStr, 'type:', typeof userIdStr);
    console.log('[getConversationOrThrow] memberIds:', conv.memberIds, 'types:', conv.memberIds.map(id => typeof id));
    console.log('[getConversationOrThrow] includes check:', conv.memberIds.includes(userIdStr));
    
    if (!conv.memberIds.includes(userIdStr)) {
      throw new Error(`Not a member. userId: ${userIdStr}, memberIds: ${conv.memberIds.join(', ')}`);
    }
    
    // Populate user info for direct chats
    if (conv.type === 'direct') {
      const otherUserId = conv.memberIds.find(id => id !== userIdStr);
      if (otherUserId) {
        try {
          const otherUser = await User.findById(otherUserId).select('userName email').lean();
          
          // Also get avatarUrl from UserProfile
          const profile = await UserProfile.findOne({ userId: otherUserId }).select('avatarUrl').lean();
          
          const convObj = conv.toObject ? conv.toObject() : conv;
          convObj.otherUser = {
            ...otherUser,
            avatarUrl: profile?.avatarUrl || otherUser?.imageUrl || null
          };
          return convObj;
        } catch (err) {
          console.error('Error populating user:', err);
        }
      }
    }
    
    return conv;
  }

  async listInbox({ userId, cursor, limit }) {
    const lim = parseLimit(limit, 30, 50);
    const cursorDate = cursor ? new Date(cursor) : null;
    
    // Convert userId to string for comparison
    const userIdStr = userId.toString ? userId.toString() : String(userId);
    const q = { memberIds: userIdStr };
    if (cursorDate) q.updatedAt = { $lt: cursorDate };
    const items = await Conversation.find(q)
      .sort({ updatedAt: -1 })
      .limit(lim)
      .lean();

    // Populate user info for direct chats and last messages
    const enrichedItems = await Promise.all(
      items.map(async (conv) => {
        // For direct chats, get other user info
        if (conv.type === 'direct') {
          const otherUserId = conv.memberIds.find(id => id !== userIdStr);
          if (otherUserId) {
            const otherUser = await User.findById(otherUserId)
              .select('userName imageUrl email')
              .lean();
            
            // Also get avatarUrl from UserProfile
            const profile = await UserProfile.findOne({ userId: otherUserId })
              .select('avatarUrl')
              .lean();
            
            conv.otherUser = {
              ...otherUser,
              avatarUrl: profile?.avatarUrl || otherUser?.imageUrl || null
            };
          }
        }
        
        // Get last message if exists
        if (conv.lastMessageId) {
          const lastMessage = await Message.findById(conv.lastMessageId)
            .select('senderId type content createdAt')
            .lean();
          conv.lastMessage = lastMessage;
        }
        
        return conv;
      })
    );

    const nextCursor = enrichedItems.length
      ? enrichedItems[enrichedItems.length - 1].updatedAt.toISOString()
      : null;
    return { items: enrichedItems, nextCursor };
  }
}

export default new ConversationService();
