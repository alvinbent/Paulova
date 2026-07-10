import { NextResponse } from "next/server";
import { processChatbotMessage } from "@/lib/chatbot/openai-assistant";

// GET handler for Meta webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "paunova_verify_token_2026";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WhatsApp Webhook verified successfully!");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

// POST handler for incoming WhatsApp messages
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Standard WhatsApp Cloud API payload parsing
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Return 200 OK immediately for non-message status updates (sent, delivered, read)
      return NextResponse.json({ success: true });
    }

    const from = message.from; // Phone number
    const messageId = message.id; // Unique message id (for idempotency)
    const textBody = message.text?.body;

    if (!textBody) {
      return NextResponse.json({ success: true });
    }

    console.log(`WhatsApp Webhook: Received message ${messageId} from ${from}: "${textBody}"`);

    // WhatsApp expects an immediate 200 OK response to prevent retries.
    // We trigger the processing asynchronously so it does not block the HTTP thread.
    processMessageAsync(from, textBody).catch((err) => {
      console.error(`Error processing WhatsApp message for ${from}:`, err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in WhatsApp webhook endpoint:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Asynchronous helper to handle OpenAI processing and send message back
async function processMessageAsync(from: string, userMessage: string) {
  // 1. Process conversational and tool logic with OpenAI
  const reply = await processChatbotMessage(from, userMessage);

  // 2. Call Meta Cloud API to send response
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !token) {
    console.warn("WhatsApp credentials not set. Response bypass:", reply);
    return;
  }

  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "text",
        text: { body: reply },
      }),
    });

    const data = await res.json();
    if (data.error) {
      console.error("WhatsApp Send API Error:", data.error);
    } else {
      console.log(`WhatsApp Webhook: Successfully sent reply to ${from}`);
    }
  } catch (err) {
    console.error("Failed to send WhatsApp message via Meta API:", err);
  }
}
