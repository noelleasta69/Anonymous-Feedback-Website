import mongoose , { Schema , Document } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"], // Fixed typo in `required`
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email"] // Fixed regex and match syntax
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code expiry is requried "]
    },
    isVerified: {
        type: Boolean,
        default: false 
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [{
        type: MessageSchema, // Embedding MessageSchema
        required: false
    }]
});

// exportig the models
export const Me