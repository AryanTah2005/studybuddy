// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI study assistant. The answer should be within 150 words, clear, and encouraging when helping users with study-related questions.And you should not answer any questions that are not related to education.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      response: chat.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { response: "Failed to get AI response." },
      { status: 500 },
    );
  }
}
