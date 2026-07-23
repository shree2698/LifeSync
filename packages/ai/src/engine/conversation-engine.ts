import { Conversation, Message } from "@lifesync/types";

export class ConversationEngine {
  private static conversationsMap: Map<string, Conversation> = new Map();
  private static messagesMap: Map<string, Message[]> = new Map();

  /**
   * Create new conversation session
   */
  public static async createConversation(
    userId: string,
    title: string = "New Conversation",
    agentType: string = "ORCHESTRATOR"
  ): Promise<Conversation> {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();

    const conversation: Conversation = {
      id,
      userId,
      title,
      isPinned: false,
      isArchived: false,
      summary: null,
      agentType: agentType as any,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };

    this.conversationsMap.set(id, conversation);
    this.messagesMap.set(id, []);
    return conversation;
  }

  /**
   * Get single conversation by ID
   */
  public static async getConversation(conversationId: string): Promise<Conversation | null> {
    const conv = this.conversationsMap.get(conversationId);
    if (!conv) return null;
    const msgs = this.messagesMap.get(conversationId) || [];
    return { ...conv, messages: msgs };
  }

  /**
   * Add message to conversation and update title / summary automatically
   */
  public static async addMessage(
    conversationId: string,
    role: Message["role"],
    content: string,
    agentType?: string,
    toolCalls?: string
  ): Promise<Message> {
    const messages = this.messagesMap.get(conversationId) || [];
    const now = new Date().toISOString();

    const msg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      conversationId,
      role,
      content,
      agentType: agentType as any,
      tokens: Math.ceil(content.length / 4),
      toolCalls,
      createdAt: now,
    };

    messages.push(msg);
    this.messagesMap.set(conversationId, messages);

    // Auto update conversation title if first user prompt
    const conv = this.conversationsMap.get(conversationId);
    if (conv) {
      conv.updatedAt = now;
      if (conv.title === "New Conversation" && role === "USER") {
        conv.title = content.length > 35 ? content.slice(0, 35) + "..." : content;
      }
      // Auto summarize if message count is high (>10 messages)
      if (messages.length > 10) {
        conv.summary = `Conversation discussing ${conv.title}. Contains ${messages.length} messages.`;
      }
      conv.messages = messages;
      this.conversationsMap.set(conversationId, conv);
    }

    return msg;
  }

  /**
   * Get user conversations
   */
  public static async getConversations(
    userId: string,
    includeArchived: boolean = false
  ): Promise<Conversation[]> {
    const list: Conversation[] = [];
    for (const conv of this.conversationsMap.values()) {
      if (conv.userId === userId) {
        if (!includeArchived && conv.isArchived) continue;
        const msgs = this.messagesMap.get(conv.id) || [];
        list.push({ ...conv, messages: msgs });
      }
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Search conversations by title or message content
   */
  public static async searchConversations(userId: string, query: string): Promise<Conversation[]> {
    const userConvs = await this.getConversations(userId, true);
    const q = query.toLowerCase();

    return userConvs.filter((conv) => {
      if (conv.title.toLowerCase().includes(q) || (conv.summary && conv.summary.toLowerCase().includes(q))) {
        return true;
      }
      const msgs = conv.messages || [];
      return msgs.some((m) => m.content.toLowerCase().includes(q));
    });
  }

  /**
   * Get Context Window: returns recent N messages formatted for context injection
   */
  public static async getRecentContextWindow(conversationId: string, limit: number = 8): Promise<Message[]> {
    const messages = this.messagesMap.get(conversationId) || [];
    return messages.slice(-limit);
  }

  /**
   * Toggle pinned state
   */
  public static async togglePin(conversationId: string): Promise<boolean> {
    const conv = this.conversationsMap.get(conversationId);
    if (!conv) return false;
    conv.isPinned = !conv.isPinned;
    conv.updatedAt = new Date().toISOString();
    return conv.isPinned;
  }

  /**
   * Toggle archive state
   */
  public static async toggleArchive(conversationId: string): Promise<boolean> {
    const conv = this.conversationsMap.get(conversationId);
    if (!conv) return false;
    conv.isArchived = !conv.isArchived;
    conv.updatedAt = new Date().toISOString();
    return conv.isArchived;
  }

  /**
   * Delete conversation
   */
  public static async deleteConversation(conversationId: string): Promise<boolean> {
    const deleted = this.conversationsMap.delete(conversationId);
    this.messagesMap.delete(conversationId);
    return deleted;
  }
}

