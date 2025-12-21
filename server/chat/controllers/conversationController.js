import conversationService from "../services/conversationService.js";

class ConversationController {
  async createConversation(req, res) {
    try {
      const { userId } = req.user;
      const { type, memberIds, title, avatar } = req.validated.body;
      const conv = await conversationService.createConversation({
        userId,
        type,
        memberIds,
        title,
        avatar,
      });

      res.status(200).json({ ok: true, conversation: conv });
    } catch (error) {
      console.error("Error in createConversation controller:", error);
      res.status(500).json({
        ok: false,
        message: error.message || "Failed to create conversation",
      });
    }
  }

  async listInbox(req, res) {
    try {
      const { userId } = req.user;
      const { limit, cursor } = req.validated.query;
      const data = await conversationService.listInbox({
        userId,
        limit,
        cursor,
      });
      res.json({ ok: true, ...data });
    } catch (error) {
      console.error("Error in listInbox controller:", error);
      res.status(500).json({
        ok: false,
        message: error.message || "Failed to list inbox",
      });
    }
  }
}

export default new ConversationController();
