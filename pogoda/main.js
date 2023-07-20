const API_KEY = '76718bf6a90d44b9bc8153803232605';
const BOT_KEY = '6324580848:AAFlLW7sgRcuPU_a4VB0usztf383EbqBS3o';

import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
let chat_id;
const bot = new TelegramBot(BOT_KEY, {polling: true});

bot.on('text',async msg =>{
    let chat_id = msg.chat.id;
    
    // if(msg === '/start'){
        bot.sendMessage(chat_id,'Привет ,это бот,который показывает в выброном городе.Назови свой город и узнаю в нем погоду');
        bot.on('text',async msg=>{
            let url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${msg.text}&days=10&aqi=no&alerts=no&lang=ru`;
            let answ;
            fetch(url)
                .then(res => res.json())
                .then(json =>console.log(json));
        })
   // }
    
   
})
