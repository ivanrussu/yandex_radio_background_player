const Artist = require("./Artist");
const Album = require("./Album");
const Track = require("./Track");

class Radio {
    constructor(radioPage) {
        this.page = radioPage;
        this.isPlaying = false;
    }

    async play() {
        if (this.isPlaying) {
            return;
        }
        await this.page.click('div.player-controls__btn_play');
        this.isPlaying = true;
    }

    async pause() {
        if (!this.isPlaying) {
            return;
        }
        await this.page.click('div.player-controls__btn_play');
        this.isPlaying = false;
    }

    async next() {
        await this.page.click('div.player-controls__btn_next');
        this.isPlaying = true;
    }

    async currentProgress() {
        return await this.page.evaluate(() => {
            return document.querySelector('.progress__left').innerText;
        });
    }

    async getTrack() {
        let result = await this.page.evaluate(() => {
            let cover = document.querySelector('.track-cover');
            let url_parts = document.querySelector('.entity-cover__image').src.split('/');
            url_parts[url_parts.length - 1] = '400x400';
            let cover_url = url_parts.join('/');

            let track_ver_selector = document.querySelector(".track__ver")
            let track_ver = '';
            if (track_ver_selector) {
                track_ver = track_ver.innerHTML;
            }

            return {
                artist: {
                    name: document.querySelector('.d-artists__expanded').innerText,
                    url: "",
                },
                album: {
                    title: cover.firstChild.title.substring(12, cover.firstChild.title.length - 1),
                    url: "",
                    cover_url: cover_url
                },
                track: {
                    title: document.querySelector(".track__title").innerHTML,
                    version: track_ver,
                    length: document.querySelector('.progress__right').innerText
                }
            };
        })

        let album = new Album(
            result.album.title,
            result.album.url,
            result.album.cover_url,
        );

        let artist = new Artist(
            result.artist.name,
            result.artist.url,
        )

        return new Track(
            result.track.title,
            result.track.version,
            artist,
            album,
            result.track.length
        )
    }
}

module.exports = Radio;