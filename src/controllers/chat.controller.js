import { User } from "../models/user.model.js";
import axios from "axios";
import Stripe from "stripe"

import dotenv from "dotenv";
dotenv.config();

export const chatSignup = async (req, res) => {
  try {
    const {userId}  = req.body;
    console.log(userId)

    const user = await User.findById(userId);

    const username = user.email;
    const secret = user.email;
    const  email = user.email; 
    const  first_name = user.username;

    if (user.chat === true) {
      return res.status(401).json({
        message: "User Already Signed Up for chat ",
      });
    } else {


      // *******************************************

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

   
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode:"payment",
      success_url:process.env.STRIPE_SUCCESS_URL,
      customer_email:"123@gmail.com",
      line_items:[
        {
          price_data:{
            currency:process.env.STRIPE_CURRENCY,
            unit_amount: 5 * 100,
            product_data:{
              name:"Connect with ADMIN"
            }
          },
          quantity:1
        }
      ]

    })
   
      // *****************************************



      try {
        const r = await axios.post(
          "https://api.chatengine.io/users/",
          { username, secret , email , first_name  },
          { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
        );

        const updateUserChat = await User.findByIdAndUpdate(userId, {
          chat: true,
        });

        return res.status(r.status).json({
          message: "User Signed Up  ",

          data: r.data,
          session:session
        });
      } catch (e) {
        console.log(e);
        return res.status(401).json(e);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
      message: "Internal server error while calling chat signup Api",
    });
  }
};

export const chatLogin = async (req,res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId);

    const username = user.email;
    const secret = user.email;

    if (user.chat === true){
      try {
        const r = await axios.get("https://api.chatengine.io/users/me/", {
          headers: {
            "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
            "User-Name": username,
            "User-Secret": secret,
          },
        });
        return res.status(r.status).json(r.data);
      } catch (e) {
        return res.status(e.response.status).json(e.response.data);
      }
    }else {
      return res.status(401).json({
        message: "User Not Signed Up for chat ",
      });
    }
    
  } catch (error) {
    
  }
}
