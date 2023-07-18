const API_KEY = '76718bf6a90d44b9bc8153803232605';
const BOT_KEY = '6324580848:AAFlLW7sgRcuPU_a4VB0usztf383EbqBS3o';

import TelegramBot from "node-telegram-bot-api";

let chat_id;
const bot = new TelegramBot(BOT_KEY, {polling: true});

bot.on('text',async msg =>{
    console.log(msg);
    chat_id = msg.chat.id;
    bot.sendMessage(chat_id,'привет');
})
