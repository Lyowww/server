import mongoose from 'mongoose';


mongoose
.connect('mongodb://127.0.0.1:27017/social')
.then(() => console.log('Connected!'));

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String
    }
});

export const User = mongoose.model('User', userSchema);


