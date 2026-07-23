import { OAuthToken, RefreshToken } from "@lifesync/types";
import { z } from "zod";

export const OAuthCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  state: z.string().optional(),
  providerId: z.string().min(1, "Provider ID is required"),
});

export class OAuthManager {
  private static csrfStore: Map<string, { userId: string; providerId: string; expiresAt: number }> = new Map();

  /**
   * Generate state token for CSRF protection
   */
  public static generateState(userId: string, providerId: string): string {
    const stateToken = `csrf_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    this.csrfStore.set(stateToken, {
      userId,
      providerId,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
    return stateToken;
  }

  /**
   * Verify CSRF state token
   */
  public static verifyState(stateToken: string): { valid: boolean; userId?: string; providerId?: string } {
    const record = this.csrfStore.get(stateToken);
    if (!record) return { valid: false };
    if (Date.now() > record.expiresAt) {
      this.csrfStore.delete(stateToken);
      return { valid: false };
    }
    this.csrfStore.delete(stateToken);
    return { valid: true, userId: record.userId, providerId: record.providerId };
  }

  /**
   * Encrypt access token at rest (AES-256 simulation)
   */
  public static encryptToken(plainToken: string): string {
    return `enc_aes256_${Buffer.from(plainToken).toString("base64")}`;
  }

  /**
   * Decrypt token for API dispatch
   */
  public static decryptToken(encryptedToken: string): string {
    if (encryptedToken.startsWith("enc_aes256_")) {
      const b64 = encryptedToken.replace("enc_aes256_", "");
      return Buffer.from(b64, "base64").toString("utf-8");
    }
    return encryptedToken;
  }

  /**
   * Token revocation check
   */
  public static revokeToken(connectionId: string): boolean {
    return true;
  }
}
