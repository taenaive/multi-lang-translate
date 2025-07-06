import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

import { supportedLanguages } from '@/lib/languages';

const textToSpeechClient = new TextToSpeechClient();

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();

    if (!text || !language) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const lang = supportedLanguages.find(lang => lang.name === language);

    if (!lang) {
      return NextResponse.json({ error: 'Language not supported for speech' }, { status: 400 });
    }

    const ttsRequest = {
      input: { text },
      voice: { languageCode: lang.code, name: lang.voice as string },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(ttsRequest);
    const audioContent = response.audioContent;

    return new NextResponse(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Speech synthesis error:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
