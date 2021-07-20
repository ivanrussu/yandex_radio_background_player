const Yandex = require("./Yandex");

class Session {
    constructor(cookies, login, password) {
        this.cookies = cookies;
        this.login = login;
        this.password = password;
    }

    async getRadio(browser) {
        const yandex = new Yandex(browser);
        if (!Object.keys(this.cookies).length) {
            this.cookies = await yandex.login(this.login, this.password);
        }
        return await yandex.getRadio(this.cookies)
    }
}

module.exports = Session;