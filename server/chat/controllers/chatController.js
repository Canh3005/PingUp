import chatService from "../services/chatService.js";

class ChatController {
  async updateRead(req, res) {
    try {
    const { userId } = req.user;
    const { conversationId } = req.validated.params;
    const { lastReadMessageId } = req.validated.body;

    const data = await chatService.updateRead({ userId, conversationId, lastReadMessageId });
    res.json({ ok: true, ...data });
  }
    catch (error) {
        console.error("Error in updateRead controller:", error);
        res.status(500).json({
            ok: false,
            message: error.message || "Failed to update read state",
        });
    }
  }
}

export default new ChatController();
