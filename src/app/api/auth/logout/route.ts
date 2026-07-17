import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/auth/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    if (token) {
      await deleteSession(token);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /api/auth/logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
