import { NextResponse } from 'next/server';
import { supportedLanguages } from '@/lib/languages';

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();

    if (!text || !language) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const voice = supportedLanguages.find(lang => lang.name === language)?.voice;

    if (!voice) {
      return NextResponse.json({ error: 'Language not supported for speech' }, { status: 400 });
    }

    const kokoroResponse = await fetch('http://localhost:8880/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        voice: voice,
        response_format: 'mp3',
        download_format: 'mp3',
        stream: true,
        speed: 1,
        return_download_link: true,
      }),
    });

    if (!kokoroResponse.ok) {
      return NextResponse.json({ error: 'Failed to generate speech' }, { status: kokoroResponse.status });
    }

    const audioData = await kokoroResponse.arrayBuffer();

    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Speech synthesis error:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
