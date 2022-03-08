const { Telegraf, Markup } = require('telegraf');
const translate = require("translate");
translate.from = "ru";
const token = "5165218952:AAES9_1NPNxtVHhvANE2cI8jd6JQTa10OS4";
const covidApi = require('covid19-api');
const COUNTRYS_LIST = require('./country.js');
const bot = new Telegraf(token);

const checkNaN = (number) => {
    if (isNaN(number)) {
        return 'Неизвестно 🤷‍♂️';
    } else {
        return number;
    }
}

bot.start(ctx => {
    ctx.reply(`Добро пожаловать ${ctx.message.from.first_name}👋.

Я могу показать информацию о коронавирусе🦠.

Введи название страны и получи статистику📈.

Посмотреть названия всех стран на английском можно с помощью команды /help`, Markup.keyboard(
[
    [Markup.button.callback("США\ud83c\uddfa\ud83c\uddf2", "Us"), Markup.button.callback("Россия\ud83c\udde7\ud83c\uddfe", "Russian")],
    [Markup.button.callback("Украина\ud83c\uddfa\ud83c\udde6", "украина"), Markup.button.callback("Белоррусия\ud83c\uddf7\ud83c\uddfa", "Белоруссия")],
]
).resize());

console.log("Информация об отправителе",ctx.message);
});

bot.help(ctx => {ctx.reply(COUNTRYS_LIST)})

bot.on('text', async ctx => {
    const text = await translate(ctx.message.text.split("/")[0], "en");
    const chatId = ctx.message.from.id;
    try {
        sentText = "";
        
        if (text === "США" || text == "USA" || text === "Соединенные Штаты Америки") {
            const dataCovid = await covidApi.getReportsByCountries("us");
            sentText = `Страна: США` +
            `\nCлучаи: ${checkNaN(dataCovid[0][0].cases)} 📝` +
            `\nСмертей: ${checkNaN(dataCovid[0][0].deaths)} ☠` +
            `\nВыздоровели: ${checkNaN(dataCovid[0][0].recovered)} 🥳`;
        } else {
            const dataCovid = await covidApi.getReportsByCountries(text);
            console.log(dataCovid);
            sentText = `Страна: ${await translate(dataCovid[0][0].country, {from: "en", to: "ru"}) }` +
            `\nCлучаи: ${checkNaN(dataCovid[0][0].cases)} 📝` +
            `\nСмертей: ${checkNaN(dataCovid[0][0].deaths)} ☠` +
            `\nВыздоровели: ${checkNaN(dataCovid[0][0].recovered)} 🥳`;
        }
        ctx.reply(sentText);
    } catch {
        console.log("Ошибка");
        ctx.reply(`Данная страна не найденна: ${ctx.message.text}, воспользуйтесь /help 👈`);
    }

    console.log("Информация об отправке", ctx.message);
});


bot.launch();
console.log("Бот запущен");
