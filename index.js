const { Telegraf, Markup } = require('telegraf');
const translate = require("translate");
translate.from = "ru";
const token = "5165218952:AAES9_1NPNxtVHhvANE2cI8jd6JQTa10OS4";
const covidApi = require('covid19-api');
const COUNTRYS_LIST = require('./country.js');
const bot = new Telegraf(token);

const checkNaN = (number) => {
    if (isNaN(number)) {
        return 'Неизвестно';
    } else {
        return number;
    }
}

bot.start(ctx => ctx.reply(`Добро пожаловать ${ctx.message.from.first_name}.

Я могу показать информацию о коронавирусе.

Введи название страны и получи статистику.

Посмотреть названия всех стран на английском можно с помощью команды /help`, Markup.keyboard(
[
    [Markup.button.callback("США", "Us"), Markup.button.callback("Россия", "Russian")],
    [Markup.button.callback("Украина", "украина"), Markup.button.callback("Белоррусия", "Белоруссия")],
]
).resize()));

bot.help(ctx => {ctx.reply(COUNTRYS_LIST)})

bot.on('text', async ctx => {
    const text = await translate(ctx.message.text, "en");
    const chatId = ctx.message.from.id;
    try {
        sentText = "";
        
        if (text === "США" || text == "USA" || text === "Соединенные Штаты Америки") {
            const dataCovid = await covidApi.getReportsByCountries("us");
            sentText = `Страна: США` +
            `\nCлучаи: ${checkNaN(dataCovid[0][0].cases)}` +
            `\nСмертей: ${checkNaN(dataCovid[0][0].deaths)}` +
            `\nВыздоровели: ${checkNaN(dataCovid[0][0].recovered)}`;
        } else {
            const dataCovid = await covidApi.getReportsByCountries(text);
            console.log(dataCovid);
            sentText = `Страна: ${await translate(dataCovid[0][0].country, {from: "en", to: "ru"}) }` +
            `\nCлучаи: ${checkNaN(dataCovid[0][0].cases)}` +
            `\nСмертей: ${checkNaN(dataCovid[0][0].deaths)}` +
            `\nВыздоровели: ${checkNaN(dataCovid[0][0].recovered)}`;
        }
        ctx.reply(sentText);
    } catch {
        console.log("Ошибка");
        ctx.reply(`Данная страна не найденна: ${ctx.message.text}, воспользуйтесь /help`);
    }
});


bot.launch();
console.log("Бот запущен");
