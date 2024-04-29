import { User } from "../models/user.model.js";

import dotenv from "dotenv";
dotenv.config();


exports.chatSignup =async (req,res) => {
   try {
    const userId = req.user

    const user = await User.findById(userId)

    
    const username = user.email
    const secret = email

    if(user.chat === true){
        return res.status(401).json({
            message:"User Already Registered for Chat"
        })
    }

    try {
        const r = await axios.post(
          "https://api.chatengine.io/users/",
          { username, secret },
          { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
        );
        return res.status(r.status).json(r.data);
      } catch (e) {
        return res.status(e.response.status).json(e.response.data);
      }


   } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Error in Chat Signup API"
        })
   }

}