import express from "express";
import { getMessages, getUsersForSidevar, markMessageAsSeen, sendMessage } from "../controler/messagecontroller.js";
import { protectRoute } from "../middleware/auth.js";


const messageRouter = express.Router();

messageRouter.post("/users",protectRoute,getUsersForSidevar);
messageRouter.post("/:id",protectRoute,getMessages);
messageRouter.post("mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);


export default messageRouter