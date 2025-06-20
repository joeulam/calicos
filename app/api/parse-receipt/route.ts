import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Buffer } from "buffer";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("receipt") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const supabase = await createClient();

  const data = await supabase.from("categories").select("*");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: file.type,
          data: buffer.toString("base64"),
        },
      },
      {
        text: `You're a receipt parser. Return ONLY a valid JSON object like:
        {
          "title": "Transaction description or merchant name",
          "amount": 12.34,
          "date": "YYYY-MM-DD",
          "category": "category id from list below"
        }

        Use the list of categories below. Your job is to match the receipt to the most relevant category **by name**, then return ONLY the matching **id** from the list. Do NOT invent categories. Use the exact ID from the list.

        Here is the list of categories:
        ${JSON.stringify(
          data.data!.map(({ name, id }) => ({ name, id })),
          null,
          2
        )}

        Do NOT include backticks or markdown formatting. Respond ONLY with the JSON object.
        `,
      },
    ],
  });

  const text = response.text;
  console.log(text);

  try {
    const parsed = JSON.parse(text!);
    return new Response(JSON.stringify(parsed), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: "Failed to parse Gemini output", raw: text }),
      {
        status: 500,
      }
    );
  }
}
