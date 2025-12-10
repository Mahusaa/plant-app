import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { aiChatMessages, aiChatSessions } from "@/db/schema";

export async function getChatSessions(userId: string) {
  return db.query.aiChatSessions.findMany({
    where: eq(aiChatSessions.userId, userId),
    orderBy: desc(aiChatSessions.updatedAt),
  });
}

export async function getChatSessionById(sessionId: string, userId: string) {
  return db.query.aiChatSessions.findFirst({
    where: and(
      eq(aiChatSessions.id, sessionId),
      eq(aiChatSessions.userId, userId),
    ),
  });
}

export async function createChatSession(
  data: typeof aiChatSessions.$inferInsert,
) {
  const [session] = await db.insert(aiChatSessions).values(data).returning();
  return session;
}

export async function updateChatSession(
  sessionId: string,
  userId: string,
  data: Partial<typeof aiChatSessions.$inferInsert>,
) {
  const [updated] = await db
    .update(aiChatSessions)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(eq(aiChatSessions.id, sessionId), eq(aiChatSessions.userId, userId)),
    )
    .returning();

  return updated;
}

export async function getChatMessages(sessionId: string) {
  return db.query.aiChatMessages.findMany({
    where: eq(aiChatMessages.sessionId, sessionId),
    orderBy: desc(aiChatMessages.createdAt),
  });
}

export async function createChatMessage(
  data: typeof aiChatMessages.$inferInsert,
) {
  const [message] = await db.insert(aiChatMessages).values(data).returning();
  return message;
}

export async function deleteChatSession(sessionId: string, userId: string) {
  const [deleted] = await db
    .delete(aiChatSessions)
    .where(
      and(eq(aiChatSessions.id, sessionId), eq(aiChatSessions.userId, userId)),
    )
    .returning();

  return deleted;
}
