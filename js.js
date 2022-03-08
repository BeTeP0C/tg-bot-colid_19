translate = require("translate");

async function f () {
    translate.engine = "google"; // Or "yandex", "libre", "deepl"
    translate.key = process.env.GOOGLE_KEY;
    // translate.from = "ru"
    translate.from = "en"

    const text = await translate("Привет мир", {from: "ru", to: "en"});
    console.log(text);
}
f();