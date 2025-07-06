## pre-plan to build language translator web app with Next.js

# specific requirements
- for translation, I want to use google service direct .feel free to suggest me something easy to implement.

# here is the example of how to use
```sh

npm install @google-cloud/translate

```
# this is the example code from google
```js

const {TranslationServiceClient} = require('@google-cloud/translate');

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'hola-tts';
const location = 'global';
const text = 'Hello, world!';

async function translateText() {
    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'en',
        targetLanguageCode: 'es',
    };

    // Run request
    const [response] = await translationClient.translateText(request);

    for (const translation of response.translations) {
        console.log(`Translation: ${translation.translatedText}`);
    }
}

```