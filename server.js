import 'dotenv/config';
import mongoose from 'mongoose';
import bot from './bot.js';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

bot.launch().then(() => {
    console.log('Bot started');
});
