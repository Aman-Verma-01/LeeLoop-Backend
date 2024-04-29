import { User } from "../models/user.model.js";
import axios from 'axios'

import dotenv from "dotenv";
dotenv.config();


export const chatCall =async (req,res) => {
   try {
    const userId = req.user

    const user = await User.findById(userId)

    
    const username = user.email
    const secret = user.email

    if(user.chat === true){
      try {
        const r = await axios.get("https://api.chatengine.io/users/me/", {
          headers: {
            "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
            "User-Name": username,
            "User-Secret": secret,
          },
        });
        return res.status(r.status).json({
         
          message:"User Logged in ",
        
          data:r.data
        });
    }catch (e) {
      return res.status(e.response.status).json(e.response.data);
    }
  } else {
    try {
      const r = await axios.post(
        "https://api.chatengine.io/users/",
        { username, secret },
        { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
      );

      const updateUserChat = await User.findByIdAndUpdate(userId, {
        chat: true,
      });

      return res.status(r.status).json({
         
        message:"User Signed Up  ",
       
        data:r.data
      });
    } catch (e) {
      console.log(e)
      return res.status(401).json(e);
    }


 }
  
   
   }catch(error){
    console.log(error)
    return res.status(500).json({
      
      message: "Internal server error",
    });
   }
  }
