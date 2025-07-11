import mongoose from 'mongoose'

const connectDb=async()=>{
    try {
        
         mongoose.connection.on('connected',()=>{
        console.log("Database Connected");})
            await mongoose.connect(`${process.env.MONGO_URI}/Chatapp`)
    } catch (error) {
       console.log(error);
        
    }
   

    
}

export default connectDb