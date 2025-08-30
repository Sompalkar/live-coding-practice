

import { Schema, model } from "mongoose";


const chatSchema = new Schema({

    message: {
        type: String,
        required: true,
    },  
    response: {
        type: String, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },          

})

const Chat = model("chat", chatSchema); // chat is the collection name in the database           

export default Chat;