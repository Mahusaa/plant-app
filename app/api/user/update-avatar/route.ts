import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image } = body;

    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    // In a production app, you would upload to a cloud storage service
    // For now, we'll store the base64 directly (not recommended for production)
    await db
      .update(user)
      .set({
        image,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update avatar error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
