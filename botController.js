import User from './user.js';
import { randomImages } from './images.js';

async function getRandomImage(ctx) {
    const chatId = ctx.chat.id;
    const imageUrl = randomImages[Math.floor(Math.random() * randomImages.length)];
    
    const replyMarkup = {
        inline_keyboard: [[{ text: "Like", callback_data: `like:${imageUrl}` }]]
    };
    
    await ctx.replyWithPhoto(imageUrl, {
        caption: "Like this image?",
        reply_markup: replyMarkup
    });
}

async function listLikedImages(ctx) {
    const chatId = ctx.chat.id;
    
    try {
        const user = await User.findOne({ telegramId: chatId });
        if (!user || !user.likedImages || user.likedImages.length === 0) {
            return ctx.reply("You have no liked images.");
        }

        for (const imageUrl of user.likedImages) {
            const replyMarkup = {
                inline_keyboard: [[{ text: "Delete", callback_data: `delete:${imageUrl}` }]]
            };
            
            await ctx.replyWithPhoto(imageUrl, {
                caption: "Remove this image?",
                reply_markup: replyMarkup
            });
        }
    } catch (error) {
        console.error("Error while listing liked images:", error);
        ctx.reply("An error occurred while fetching your liked images.");
    }
}

async function handleCallbackQuery(ctx) {
    const chatId = ctx.chat.id;
    const [action, imageUrl] = ctx.callbackQuery.data.split(':');
    
    try {
        let user = await User.findOne({ telegramId: chatId });

        if (action === 'like') {
            if (!user) {
                user = new User({ telegramId: chatId, likedImages: [imageUrl] });
            } else if (!user.likedImages.includes(imageUrl)) {
                user.likedImages.push(imageUrl);
            }
            
            await user.save();
            await ctx.editMessageCaption("Liked!");
        } else if (action === 'delete') {
            if (user && user.likedImages.includes(imageUrl)) {
                user.likedImages = user.likedImages.filter(img => img !== imageUrl);
                await user.save();
            }
            
            await ctx.editMessageCaption("Deleted!");
        }
    } catch (error) {
        console.error("Error while handling callback query:", error);
        ctx.reply("An error occurred while processing your request.");
    }
}

export {
    getRandomImage,
    listLikedImages,
    handleCallbackQuery
};
