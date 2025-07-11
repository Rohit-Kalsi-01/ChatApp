//Get all user except the logged in user 

import cloudinary from "../lb/cloudinary.js";
import {io,userSocketMap} from "../server.js";

export const getUsersForSidevar= async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        //count the number of message not seen
        const userseenMessages ={}
        const promises = filteredUsers.map(async (user) => {
            const message = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(message.length > 0){
                userseenMessages[user._id] = message.length;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, userseenMessages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: true, users: filteredUsers, userseenMessages });
        
    }
}

//Get all message for selected user

export const getMessages = async (req, res) => {
    try {
        const { id:selectedUserId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({ success: true, messages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
      const {id}=req.params;
      await Message.findByIdAndUpdate(id, { seen: true })
      res.json({ success: true});
    } catch (error) {
         console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const {  text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image) 
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage =await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getMessage", newMessage);
        }
        res.json({ success: true, newMessage });

        
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}