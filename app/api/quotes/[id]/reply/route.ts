import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reply } = await req.json();
    if (!reply?.trim()) {
      return NextResponse.json({ error: "Reply text is required" }, { status: 400 });
    }

    await updateDoc(doc(db, "quoteRequests", params.id), {
      reply: reply.trim(),
      status: "replied",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/quotes/[id]/reply error:", err);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
