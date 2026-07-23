import { MemoryCategory, MemoryItem, MemoryType } from "@lifesync/types";

export interface CreateMemoryParams {
  userId: string;
  category: MemoryCategory;
  key: string;
  value: string;
  confidence?: number;
  source?: string;
  memoryType?: MemoryType;
  expiresAt?: string | null;
}

export interface MemoryExportData {
  exportDate: string;
  userId: string;
  totalItems: number;
  memories: MemoryItem[];
}

export class MemoryPlatform {
  private static memoryStore: Map<string, MemoryItem[]> = new Map();

  /**
   * Add or update memory for a user
   */
  public static async storeMemory(params: CreateMemoryParams): Promise<MemoryItem> {
    const userMemories = this.memoryStore.get(params.userId) || [];

    // Check if memory key already exists in same category
    const existingIndex = userMemories.findIndex(
      (m) => m.category === params.category && m.key.toLowerCase() === params.key.toLowerCase()
    );

    const now = new Date().toISOString();
    const memoryItem: MemoryItem = {
      id: existingIndex >= 0 ? userMemories[existingIndex].id : `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: params.userId,
      category: params.category,
      key: params.key,
      value: params.value,
      confidence: params.confidence ?? 1.0,
      source: params.source || "USER",
      memoryType: params.memoryType || "LONG_TERM",
      expiresAt: params.expiresAt || null,
      createdAt: existingIndex >= 0 ? userMemories[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      userMemories[existingIndex] = memoryItem;
    } else {
      userMemories.push(memoryItem);
    }

    this.memoryStore.set(params.userId, userMemories);
    return memoryItem;
  }

  /**
   * Get memories for user filtered by category or type, applying retention policies
   */
  public static async getMemories(
    userId: string,
    category?: MemoryCategory,
    memoryType?: MemoryType
  ): Promise<MemoryItem[]> {
    let memories = this.memoryStore.get(userId) || [];

    // Retention policy enforcement: remove expired or obsolete short term items > 24 hours
    const now = Date.now();
    memories = memories.filter((m) => {
      if (m.expiresAt && new Date(m.expiresAt).getTime() < now) return false;
      if (m.memoryType === "SHORT_TERM") {
        const ageMs = now - new Date(m.createdAt).getTime();
        if (ageMs > 86400000) return false; // 24h short term retention limit
      }
      return true;
    });

    this.memoryStore.set(userId, memories);

    if (category) {
      memories = memories.filter((m) => m.category === category);
    }
    if (memoryType) {
      memories = memories.filter((m) => m.memoryType === memoryType);
    }

    return memories;
  }

  /**
   * Perform semantic / keyword search over user's memory layer
   */
  public static async searchMemories(userId: string, query: string): Promise<MemoryItem[]> {
    const allMemories = await this.getMemories(userId);
    const qLower = query.toLowerCase();

    return allMemories.filter(
      (m) =>
        m.key.toLowerCase().includes(qLower) ||
        m.value.toLowerCase().includes(qLower) ||
        m.category.toLowerCase().includes(qLower)
    );
  }

  /**
   * Delete memory item
   */
  public static async deleteMemory(userId: string, memoryId: string): Promise<boolean> {
    const memories = this.memoryStore.get(userId) || [];
    const initialLen = memories.length;
    const filtered = memories.filter((m) => m.id !== memoryId);

    this.memoryStore.set(userId, filtered);
    return filtered.length < initialLen;
  }

  /**
   * Clear all memories for a user (Privacy control)
   */
  public static async clearUserMemories(userId: string): Promise<void> {
    this.memoryStore.delete(userId);
  }

  /**
   * Export memory dump for GDPR / User Privacy Compliance
   */
  public static async exportMemories(userId: string): Promise<MemoryExportData> {
    const memories = await this.getMemories(userId);
    return {
      exportDate: new Date().toISOString(),
      userId,
      totalItems: memories.length,
      memories,
    };
  }
}

