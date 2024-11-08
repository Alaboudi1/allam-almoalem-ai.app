import { NextRequest, NextResponse } from "next/server";
import { askAllam } from "./allam.mjs";

export async function POST(request: NextRequest) {
  try {
    const { question, type } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 }
      );
    }
    // write the question to a file

    const allamResponse = await askAllam(question, type);
    return NextResponse.json({ allamResponse });
  } catch (error: unknown) {
    console.error("Error processing Allam request:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 }
    );
  }
}
