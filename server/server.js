import exprees from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDb from "./lb/mongodb.js";
import userRouter from "./routes/userroutes.js";






//Create Express app and HTTP server
const app=exprees();
const server=http.createServer(app);


//Middleware setup
app.use(exprees.json({limit:"4mb"}));
app.use(exprees.urlencoded({extended:true,limit:"4mb"}));
app.use(cors());

//Routes setup
app.use("/api/status",(req,res)=>res.send("Server is live"));
app.use("/api/auth",userRouter);


//Connect to MongoDB
await connectDb();

const PORT=process.env.PORT||5000;

server.listen(PORT,()=>console.log("server is running on port"+PORT))