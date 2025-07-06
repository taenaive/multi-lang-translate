const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const textToSpeechClient = new TextToSpeechClient();

const supportedLanguageCodes = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'];

async function getVoiceList() {
  console.log('Fetching voice list from Google Cloud...');
  try {
    const [result] = await textToSpeechClient.listVoices({});
    const allVoices = result.voices;

    console.log('--- Raw API Response ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('------------------------\n');

    if (!allVoices || allVoices.length === 0) {
      console.log('No voices were returned from the API.');
      return;
    }

    console.log('Available voices for your supported languages:\n');

    supportedLanguageCodes.forEach(langCode => {
      const voicesForLang = allVoices.filter(voice => 
        voice.languageCodes.some(lc => lc.startsWith(langCode))
      );
      
      console.log(`--- ${langCode} ---`);
      if (voicesForLang.length > 0) {
        voicesForLang.forEach(voice => {
          console.log(`  Name: ${voice.name}, Gender: ${voice.ssmlGender}, Languages: ${voice.languageCodes.join(', ')}`);
        });
      } else {
        console.log(`  No voices found for this language code.`);
      }
      console.log('\n');
    });

  } catch (error) {
    console.error('Error fetching voice list:', error);
  }
}

getVoiceList();
