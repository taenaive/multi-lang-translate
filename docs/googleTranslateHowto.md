# 1. Secure Your API Key
Before writing any code, the most critical step is to secure your API key. Never hardcode your API key directly in your source code. Instead, use environment variables.

Create a .env file: In the root directory of your project, create a file named .env. This file will store your API key and is excluded from version control (via .gitignore).

```sh
GOOGLE_API_KEY="YOUR_API_KEY"

```

Add .env to .gitignore: Create a .gitignore file in your project's root and add .env to it to prevent your credentials from being accidentally committed to a repository.

```sh
.env

```
# 2. Local Server Setup with Node.js and Express

This setup uses the popular Express framework to create a simple server that can handle translation requests.

Initialize your project and install dependencies:

```sh

npm init -y
npm install express @google-cloud/translate dotenv

```
## Create your server file (e.g., server.js):

```js

/**
 * This script demonstrates how to translate text using the Google Cloud Translation API
 * with an API Key.
 */

// 1. Load environment variables from the .env file
require('dotenv').config();

// 2. Imports the Google Cloud Translation library's v2 client
const { Translate } = require('@google-cloud/translate').v2;

// 3. The text you want to translate
const text = 'Hello, world!';
// 4. The target language code (e.g., 'es' for Spanish, 'fr' for French)
const targetLanguage = 'sr-Latn'; // Serbian (Latin)

// 5. Check if the API key is available
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: GOOGLE_API_KEY is not set in your .env file.");
  process.exit(1);
}

// 6. Instantiates a client, passing the API key in the configuration object
const translate = new Translate({
  key: apiKey,
});

/**
 * Asynchronous function to perform the translation.
 */
async function translateText() {
  try {
    // The v2 client has a simpler method signature
    const [translation] = await translate.translate(text, targetLanguage);

    console.log(`Original Text: ${text}`);
    console.log(`Translation: ${translation}`);

  } catch (error) {
    console.error('ERROR during translation:', error);
  }
}

// Run the translation function
translateText();

```
## Run your server:

```sh
node server.js
```