import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a helpful AI assistant for NewTech Shop — a premium home solutions company based in Delhi NCR, India.

You help customers with:
- Product recommendations based on their needs
- Pricing and discount information
- Measurement tips (ask for width × height in feet or inches)
- Installation guidance
- Comparing products
- Guiding them to fill the quote form

Products and prices:
BLINDS:
• Roller Blinds — ₹1,499 (MRP ₹1,999) | Best Seller | Smooth chain, UV protection, custom sizes
• Zebra Blinds — ₹1,799 (MRP ₹2,299) | Hot | Dual-layer day/night control, motorisation ready
• Wooden Blinds — ₹2,499 (MRP ₹3,200) | New | Premium hardwood, moisture-resistant
• Printed Blinds — ₹1,699 (MRP ₹2,199) | Custom photo/pattern, fade-resistant ink

PLEATED MESH:
• Polyester Pleated Mesh — ₹999 (MRP ₹1,299) | Best Seller | Insect protection, accordion fold
• SS 304 Pleated Mesh — ₹1,599 (MRP ₹1,999) | Hot | Stainless steel, 10× stronger, pet & child safe

HONEYCOMB:
• Honeycomb Blackout — ₹2,199 (MRP ₹2,799) | New | 100% blackout, thermal insulation, noise reduction
• 2-in-1 Pleated + Honeycomb — ₹2,799 (MRP ₹3,499) | New | Insect mesh + blackout in one frame

PARTITIONS & DOORS:
• PVC Partition — ₹3,499 (MRP ₹4,500) | Modular, no civil work, soundproof options
• Security Mesh — ₹2,999 (MRP ₹3,799) | Hot | 316-grade SS, anti-intrusion, transparent
• Crystal Partition Door — ₹5,999 (MRP ₹7,500) | New | Tempered glass, slim aluminium, sliding or hinged

Be friendly, concise, and professional. Always use ₹ for prices. When customers need exact pricing for their window size, encourage them to fill the quote form on the page. Never discuss topics unrelated to NewTech Shop or home solutions.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        message:
          "I'm currently offline. Please fill the quote form below or WhatsApp us directly and we'll get back to you shortly! 😊",
      });
    }

    const geminiMessages = (messages as { role: string; content: string }[]).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      message: "Sorry, I'm having trouble right now. Please try again shortly.",
    });
  }
}
