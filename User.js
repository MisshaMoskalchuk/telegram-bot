import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
        unique: true
    },
    likedImages: [
        {
            type: String,
            required: true
        }
    ]
});

const User = mongoose.model('User', userSchema);

export default User;
