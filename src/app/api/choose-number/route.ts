import { NextResponse } from "next/server";

export async function GET() {
  try {
    const randomNumber = Math.floor(Math.random() * 20) + 1;
    return NextResponse.json(randomNumber);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load word" }, { status: 500 });
  }
}
