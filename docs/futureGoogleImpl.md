## pre-plan to build language translator web app with Next.js

# specific requirements

- This application will look like a google translate.
- However, instead of just translate between 2 langages. this will have simulatneous multiple target languages.
- each languages will have a text panel with their language codes.
- user should have menu to add or remove multiple panels
- for translation, I want to use google service .feel free to suggest me something easy to implement.



```sh

npm install @google-cloud/translate

```

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