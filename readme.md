# Yandex Radio background player based on headless chrome with control over websockets

This project is an experiment with headless chrome and websockets which supposed to provide a remote control for
switching tracks and play/pause Yandex Radio.

Note, that the app uses login and password stored in plain text for automated authentication. It is not a secure way of
storing credentials, but since Yandex didn't provide API for Radio, I didn't find any other way of doing automated
authentication.

## Requirements

NodeJS and NPM installed.

I did run this code with Node v14.15.3 and NPM v6.14.9, probably it will work on earlier versions.

## Setup

1. Create `.env` file in the same directory where `.env.example` file located (You can copy `.env.example`).

2. Set variable `YRBP_LOGIN` to your yandex account login and `YRBP_PASSWORD` to your yandex password. You can also
   set `YRBP_PORT` for changing port for websockets.

3. If you're going to run this script on raspberry pi, set environment variable `YRBP_PASPBERRY_PI` to `1` and install
   codecs
   `sudo apt install chromium-browser chromium-codecs-ffmpeg`.

4. Install dependencies with `npm install`.

5. Run the app with `node main.js`

## How it works

The app opens yandex authentication page and enters user's credentials. After successful authentication it saves cookies
to avoid excess authentication and reduce risk of blocking authentication process.

Then it opens `https://music.yandex.ru/radio` page and clicks on play button.

At the same time it launches websocket server and listens for commands.

The app parses web page for emitting state.

## API

The app uses socket.js library for handling websockets.

[Example remote controller app based on HTML and JS](https://github.com/ivanrussu/yrbp_remote).

## Commands

| Command | Description |
| -----| ---------------- |
| play | If on pause, clicks 'play' button. Emits state |
| pause | If not on pause, clicks 'pause' button. Emits state |
| next | Clicks 'next' button. Emits state |
| state | Emits state |

## State

When the app emits (broadcasts) state it sends object with the following structure:

```json
{
  "track": {
    "title": "Nine Thou",
    "version": "Grant Mohrman Superstars Remix",
    "length": "4:03",
    "artist": {
      "name": "Styles of Beyond",
      "url": "https://music.yandex.ru/artist/127209"
    },
    "album": {
      "title": "Grant Mohrman Remixes",
      "url": "https://music.yandex.ru/album/11362898",
      "cover_url": "https://avatars.yandex.net/get-music-content/2808981/f2ed293c.a.11362898-1/400x400"
    }
  },
  "progress": "0:01",
  "is_playing": true
}
```