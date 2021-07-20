class SocketController {
    constructor(socket, radio) {
        this.socket = socket;
        this.radio = radio;

        socket.on('play', async () => {
            await this.radio.play();
            await this.sleep(1000);
            await this.emitState()
        });
        socket.on('pause', async () => {
            await this.radio.pause();
            await this.sleep(1000);
            await this.emitState()
        });
        socket.on('next', async () => {
            await this.radio.next();
            await this.sleep(1000);
            await this.emitState()
        });
        socket.on('state', async () => {
            await this.sleep(1000);
            await this.emitState()
        })

        this.emitState().then()
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async emitState() {
        this.socket.emit(
            'state',
            {
                track: await this.radio.getTrack(),
                progress: await this.radio.currentProgress(),
                is_playing: this.radio.isPlaying
            }
        );
    }
}

module.exports = SocketController;