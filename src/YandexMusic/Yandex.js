const Radio = require("./Radio");

class Yandex {
    constructor(browser) {
        this.browser = browser;
    }

    async login(login, password) {
        const authPage = await this.browser.newPage();
        await authPage.goto('https://passport.yandex.ru/auth')

        await authPage.focus('input[name=login]')
        await authPage.keyboard.type(login, {delay: 30})
        await authPage.click('button.Button2_type_submit');

        await authPage.waitForSelector('input[name=passwd]');
        await authPage.focus('input[name=passwd]')
        await authPage.keyboard.type(password, {delay: 30});
        await authPage.click('button.Button2_type_submit');
        await authPage.waitForNavigation();

        const profilePage = await this.browser.newPage();
        await profilePage.goto('https://passport.yandex.ru/profile');

        return await profilePage.cookies();
    }

    async getRadio(cookies) {
        const radioPage = await this.browser.newPage();
        await radioPage.setCookie(...cookies);
        await radioPage.goto('https://music.yandex.ru/radio');
        await radioPage.waitForSelector('a.track__title');
        return new Radio(radioPage);
    }
}

module.exports = Yandex;