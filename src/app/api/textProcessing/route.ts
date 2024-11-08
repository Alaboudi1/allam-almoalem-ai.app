import { NextRequest, NextResponse } from "next/server"
import { analyzeImageWithGPT4Vision } from "./apiAiVision"

export async function POST(request: NextRequest) {

  let prompt = `
  Extract only text. The text may be in any language.
  `

  const body = await request.json()
  const {

    croppedImage,
  } = body


  try {
    const base64Data = croppedImage.split(",")[1]
    const response = await analyzeImageWithGPT4Vision(base64Data, prompt)


    return NextResponse.json({ extractedText: response })
  } catch (error: unknown) {
    console.error("Error extracting text:", error)
    return NextResponse.json(
      { error: "Failed to extract text", details: (error as Error).message },
      { status: 500 }
    )
  }
}
