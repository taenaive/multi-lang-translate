# using Kokoro  for speech

- for speeach we will use Kokoro private server(source URL: https://github.com/remsky/Kokoro-FastAPI) already running on http://kokoro.tabom.org 
- server is running on http://kokoro.tabom.org
- for POST call we will use this Kokoro's end point: /v1/audio/speech
- paylaod will look like this

```json
 
{"input":"Hi how are you?",
    "voice":"af_nicole",
    "response_format":"mp3",
    "download_format":"mp3",
    "stream":true,"speed":1,
    "return_download_link":true
}

```

- voices for different languages: 
    ( "ff_siwis" = french, "if_sara" = italian , "pf_dora" = portuguese,  "ef_dora"= spanish, "zf_xiaobei"=chinese, "jf_alpha" = japanese, "af_nicole" = english )
- The response body from Kokoro is : file

- reposne headers example:

```yml
 access-control-allow-credentials: true 
 access-control-allow-origin: * 
 cache-control: no-cache 
 content-disposition: attachment; filename=speech.mp3 
 content-type: audio/mpeg 
 date: Sat,07 Jun 2025 21:53:04 GMT 
 server: uvicorn 
 transfer-encoding: chunked 
 x-accel-buffering: no 
 x-download-path: /download/tmp58e0m8c2.mp3 

```