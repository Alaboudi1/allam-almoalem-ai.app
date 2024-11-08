import { NextRequest, NextResponse } from 'next/server';

const APIKEY = '';
const MAX_SCRIPT_LENGTH = 1024;
const POLLING_INTERVAL = 5000; // 5 seconds

async function requestAudioBuild(text: string, voice: string) {
    const response = await fetch(
        `https://api.narakeet.com/text-to-speech/m4a?voice=${encodeURIComponent(voice)}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'x-api-key': APIKEY,
            },
            body: text.replace(/[_\.]{2,}/g, ' '), // Replace 2 or more underscores or dots with "blank"
        }
    );

    if (!response.ok) {
        throw new Error(`Error requesting audio build: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return data.statusUrl;
}

async function pollForResults(statusUrl: string): Promise<string> {
    while (true) {
        const response = await fetch(statusUrl);
        const data = await response.json();

        if (data.finished) {
            if (data.succeeded) {
                return data.result;
            } else {
                throw new Error(`Audio build failed: ${data.message}`);
            }
        }

        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    }
}

async function downloadAudio(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error downloading audio: ${response.status} ${await response.text()}`);
    }
    return await response.arrayBuffer();
}

export async function POST(req: NextRequest) {
    try {
        const { text, voice } = await req.json();

        if (!text || !voice) {
            return new NextResponse('Missing required parameters', { status: 400 });
        }

        if (text.length <= MAX_SCRIPT_LENGTH) {
            // Use short content API for scripts within the length limit
            const response = await fetch(
                `https://api.narakeet.com/text-to-speech/m4a?voice=${encodeURIComponent(voice)}`,
                {
                    method: 'POST',
                    headers: {
                        'accept': 'application/octet-stream',
                        'x-api-key': APIKEY,
                        'content-type': 'text/plain'
                    },
                    body: text
                }
            );

            if (!response.ok) {
                console.error('Error from Narakeet API:', response.status, await response.text());
                return new NextResponse('Error from text-to-speech service', { status: response.status });
            }

            const audioData = await response.arrayBuffer();
            return new NextResponse(audioData, {
                headers: {
                    'Content-Type': 'audio/x-m4a',
                    'Content-Length': audioData.byteLength.toString(),
                },
            });
        } else {
            // Use long content API for longer scripts
            const statusUrl = await requestAudioBuild(text, voice);
            const audioUrl = await pollForResults(statusUrl);
            const audioData = await downloadAudio(audioUrl);

            return new NextResponse(audioData, {
                headers: {
                    'Content-Type': 'audio/x-m4a',
                    'Content-Length': audioData.byteLength.toString(),
                },
            });
        }
    } catch (error) {
        console.error('Error in TTS API:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
