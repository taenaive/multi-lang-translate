import { NextResponse } from 'next/server';
import { TranslationServiceClient } from '@google-cloud/translate';

import { supportedLanguages } from '@/lib/languages';

const translationClient = new TranslationServiceClient();

export async function POST(request: Request) {
  try {
    const { text, from, to } = await request.json();

    if (!text || !to || !from) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const fromCode = supportedLanguages.find(lang => lang.name === from)?.code;
    const toCode = supportedLanguages.find(lang => lang.name === to)?.code;

    if (!fromCode || !toCode) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    const projectId = process.env.GOOGLE_PROJECT_ID;
    const location = 'global';

    const translateRequest = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: fromCode,
      targetLanguageCode: toCode,
    };

    const [response] = await translationClient.translateText(translateRequest);
    const translatedText = response.translations?.[0]?.translatedText || '';

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
