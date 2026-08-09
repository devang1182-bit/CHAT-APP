import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchWord = searchParams.get("searchWord");

  if (!searchWord) {
    return NextResponse.json(
      { error: "Search word is required" },
      { status: 400 }
    );
  }

  try {
    await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        searchWord
      )}`
    );

    return NextResponse.json(true);

  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 404
    ) {
      return NextResponse.json(false);
    }
    
    return NextResponse.json(
      { error: "Failed to verify word" },
      { status: 500 }
    );
  }
}