import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "choose-word.json");
    const file = await fs.readFile(filePath, "utf-8");
    const words: string[] = JSON.parse(file);
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    return NextResponse.json(randomWord);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load word" }, { status: 500 });
  }
}
