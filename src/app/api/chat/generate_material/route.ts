export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fetch from "node-fetch"; // For server-side HTTP

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PDFCO_KEY = process.env.PDFCO_API_KEY!; // Add your key to .env as PDFCO_API_KEY

/**
 * Uses PDF.co to extract text (with OCR) from any PDF.
 */
async function extractTextFromPdf(pdfUrl: string): Promise<string> {
  // PDF.co works with files on the public web or you can POST file data (advanced)
  const apiUrl = "https://api.pdf.co/v1/pdf/convert/to/text";
  const payload = {
    url: pdfUrl,
    inline: true,
    pages: "",      // empty = all pages
    async: false,   // wait for the result
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "x-api-key": PDFCO_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!data?.body) {
    throw new Error(
      `PDF.co failed: ${data.message || JSON.stringify(data)}`
    );
  }
  return data.body;
}

export async function POST(req: NextRequest) {
  try {
    const { urls, course, contentType } = await req.json();
    if (!urls || !Array.isArray(urls) || !urls.length || !course || !contentType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    let allText = "";

    for (const url of urls) {
      const text = await extractTextFromPdf(url);
      allText += text + "\n";
      if (allText.length > 12000) break;
    }
    const truncatedText = allText.slice(0, 4000);

    const prompt = `Create a ${contentType} in LaTeX for the course: "${course}" from this material. Only output LaTeX.\n\n${truncatedText}`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a LaTeX expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });

    return NextResponse.json({
      latex: chat.choices[0]?.message?.content ?? "No output",
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Server Error: " + (error as Error).message },
      { status: 500 }
    );
  }
}