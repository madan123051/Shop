import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const snap = await getDoc(doc(db, "quoteRequests", params.id));
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data()?.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    });
  } catch (err) {
    console.error("GET /api/quotes/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDoc(doc(db, "quoteRequests", params.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/quotes/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
