import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () =>{
    try {
        console.log(process.env.MONGODB_URL)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(`\n MongoDB Connected  !! DB Host : ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("MongoDb Connection Error" + error);
        process.exit(1);
    }
}