import crypto from "crypto";
import { db } from "../../db";
import { agencyAuditLogs } from "../../db/schema";

const IMPERSONATION_SECRET = process.env.IMPERSONATION_SECRET || "nexx-secret-impersonation-token-key-2026";
// Guarantee 32-byte key using SHA-256 hash
const KEY = crypto.createHash("sha256").update(IMPERSONATION_SECRET).digest();
const IV_LENGTH = 16;

export interface ImpersonationPayload {
  agencyId: string;
  actorUserId: string;
  targetOrganizationId: string;
  expiresAt: number;
}

export const agencyImpersonation = {
  /**
   * Generates an encrypted token that allows agency staff to impersonate a client workspace
   */
  async generateImpersonationToken(options: {
    agencyId: string;
    actorUserId: string;
    targetOrganizationId: string;
  }): Promise<string> {
    const { agencyId, actorUserId, targetOrganizationId } = options;

    try {
      const payload: ImpersonationPayload = {
        agencyId,
        actorUserId,
        targetOrganizationId,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes expiration
      };

      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
      let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
      encrypted += cipher.final("hex");

      const token = `${iv.toString("hex")}:${encrypted}`;

      // Insert audit log record
      await db
        .insert(agencyAuditLogs)
        .values({
          agencyId,
          userId: actorUserId,
          action: "impersonation-start",
          targetId: targetOrganizationId,
          details: { timestamp: new Date().toISOString() },
        });

      return token;
    } catch (e) {
      console.error("[Agency Impersonation] Token generation failed:", e);
      throw new Error("Failed to generate impersonation session");
    }
  },

  /**
   * Decrypts and verifies an impersonation token
   */
  verifyImpersonationToken(token: string): ImpersonationPayload {
    try {
      const [ivHex, encryptedHex] = token.split(":");
      if (!ivHex || !encryptedHex) {
        throw new Error("Invalid token format");
      }

      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
      let decrypted = decipher.update(encryptedHex, "hex", "utf8");
      decrypted += decipher.final("utf8");

      const payload = JSON.parse(decrypted) as ImpersonationPayload;

      // Verify expiration
      if (Date.now() > payload.expiresAt) {
        throw new Error("Token expired");
      }

      return payload;
    } catch (e: any) {
      console.error("[Agency Impersonation] Verification failed:", e);
      throw new Error(e?.message || "Token verification failure");
    }
  },

  /**
   * Logs an audit event when an impersonation session terminates
   */
  async logImpersonationEnd(agencyId: string, actorUserId: string, targetOrganizationId: string) {
    try {
      await db
        .insert(agencyAuditLogs)
        .values({
          agencyId,
          userId: actorUserId,
          action: "impersonation-end",
          targetId: targetOrganizationId,
          details: { timestamp: new Date().toISOString() },
        });
    } catch (e) {
      console.error("[Agency Impersonation] Failed to log impersonation-end audit trail:", e);
    }
  }
};
