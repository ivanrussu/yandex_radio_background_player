const Session = require("./src/YandexMusic/Session");
const SocketController = require("./src/SocketController");
const puppeteer = require('puppeteer');
require('dotenv').config();

const fs = require('fs');

if (!fs.existsSync('./cookies.json')) {
    fs.writeFileSync('./cookies.json', '[]');
}

let cookies = require('./cookies.json');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

(async () => {
    let options = {
        headless: true,
        ignoreDefaultArgs: [
            "--mute-audio",
        ],
        args: [
            "--autoplay-policy=no-user-gesture-required",
        ],
    };

    if (Number(process.env.YRBP_PASPBERRY_PI) === 1) {
        options.executablePath = '/usr/bin/chromium-browser';
    }

    let browser = await puppeteer.launch(options);

    let session = new Session(cookies, process.env.YRBP_LOGIN, process.env.YRBP_PASSWORD);

    let radio = await session.getRadio(browser);
    await radio.play();

    fs.writeFileSync('./cookies.json', JSON.stringify(session.cookies));

    io.on('connection', async (socket) => {
        new SocketController(socket, radio);
    });

    server.listen(process.env.YRBP_PORT, () => {
        console.log('listening on port ' + process.env.YRBP_PORT);
    });
})();