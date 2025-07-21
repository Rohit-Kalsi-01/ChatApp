import exprees from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDb from "./lb/mongodb.js";
import userRouter from "./routes/userroutes.js";
import messageRouter from "./routes/messageroutes.js";
import { Server } from "socket.io";





//Create Express app and HTTP server
const app=exprees();
const server=http.createServer(app);

//Initialize socket.io server
export const io=new Server(server,{
    cors:{origin:"*"}
})

//Store online users
export const userSocketMap={};

//Socket.io connection handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    if(userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${userId}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
    
})

//Middleware setup
app.use(exprees.json({limit:"4mb"}));
app.use(exprees.urlencoded({extended:true,limit:"4mb"}));
app.use(cors());

//Routes setup
app.use("/api/status",(req,res)=>res.send("Server is live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

//Connect to MongoDB
await connectDb();

const PORT=process.env.PORT||5000;

server.listen(PORT,()=>console.log("server is running on port"+PORT))