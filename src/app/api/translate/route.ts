import { NextResponse } from 'next/server';
import translate from 'translate';

import { supportedLanguages } from '@/lib/languages';

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

    const translatedText = await translate(text, { from: fromCode, to: toCode });

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
