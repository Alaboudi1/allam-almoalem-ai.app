import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: "",
});

// Define schema for vision analysis response
const VisionAnalysisSchema = z.object({
  content: z.string().describe('extracted text'),
  isArabic: z.number().describe('1 if Arabic text is present, 0 if not'),
  isMath: z.number().describe('1 if it related to math in any way, 0 if not'),
  isQuestion: z.number().describe('1 if it is a question that can be answered, 0 if not. Question is either ends with question mark or with blank space or any other word that indicates question'),
  visualDescription: z.string().describe('A visual description of the image, including colors, objects, and layout'),
});

export async function analyzeImageWithGPT4Vision(imageBase64: string, prompt: string): Promise<z.infer<typeof VisionAnalysisSchema>> {
  if (!imageBase64 || !prompt) {
    throw new Error('Image data and prompt are required');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ],
        },
      ],
      max_tokens: 3000,
      response_format: zodResponseFormat(VisionAnalysisSchema, "vision_analysis")
    });

    const generatedContent = response.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No response generated');
    }

    // Parse and validate response against schema
    const parsedResponse = VisionAnalysisSchema.parse(JSON.parse(generatedContent));
    return parsedResponse;

  } catch (error) {
    console.error("Error analyzing image with GPT-4 Vision:", error);
    throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}