import { Telegraf } from 'telegraf';
import { getRandomImage, listLikedImages, handleCallbackQuery } from './botController.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('random', getRandomImage);
bot.command('list', listLikedImages);
bot.on('callback_query', handleCallbackQuery);

export default bot;
