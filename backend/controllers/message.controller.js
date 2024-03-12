import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const {message} = req.body;
        const receiverId = req.params.id; // id of the person to which we want to send the message
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants : {$all : [senderId, receiverId]}
        })
        if(!conversation) {
            conversation = await Conversation.create({
                participants : [senderId, receiverId],
            })
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await newMessage.save();
        await conversation.save();
        res.status(201).json(newMessage)
    } catch(error) {
        console.log("error in sending the message");
        res.status(500).json({
            error : "Internal server error"
        })
    }
}

export async function getMessages(req, res) {
    try {
        const userToChatId = req.params.id;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants : {$all : [senderId, userToChatId]}
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);
        const messages = conversation.messages;
        res.status(201).json(messages)
    } catch(error) {
        console.log("Error fetching the messages");
        res.status(500).json({
            error : "Internal server error"
        })
    }

}
