import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "",
});

const sendAudioToWhisper = async (blob: Blob) => {
    try {
        const formData = new FormData();
        formData.append('file', blob, 'audio.webm');
        formData.append('model', 'whisper-1');

        const response = await openai.audio.transcriptions.create({
            file: formData.get('file') as File,
            model: 'whisper-1',
            language: 'ar', // Specify Arabic language
            response_format: 'text', // Request text format
        });

        return response;
    } catch (error) {
        console.error('Error sending audio to Whisper:', error);
        throw error;
    }
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const transcription = await sendAudioToWhisper(file);

        return NextResponse.json({ text: transcription });
    } catch (error) {
        console.error('Error in speech-to-text:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
