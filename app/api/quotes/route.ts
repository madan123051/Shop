import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, serverTimestamp,
  orderBy, query,
} from "firebase/firestore";

export async function GET() {
  try {
    const q = query(collection(db, "quoteRequests"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const quotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    return NextResponse.json({ quotes });
  } catch (err) {
    console.error("GET /api/quotes error:", err);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, phone, email, category, product,
      width, height, quantity, address, notes,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "quoteRequests"), {
      name,
      phone,
      email: email || "",
      category: category || "",
      product: product || "",
      width: width || "",
      height: height || "",
      quantity: quantity || "1",
      address: address || "",
      notes: notes || "",
      status: "pending",
      reply: "",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/quotes error:", err);
    return NextResponse.json({ error: "Failed to save quote" }, { status: 500 });
  }
}
