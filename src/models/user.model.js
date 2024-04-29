import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowerCase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    profileImage: {
      type: String, // cloudinary Url
    },
    address: {
      type: String, // 
      default:"Not Updated"
    },
    uploadedMusic: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      },
    ],

    chat:{
      type:Boolean,
      default:false
    },
   
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    token: {
      type: String,
    },
  },
  { timestamps: true }
);


export const User = mongoose.model("User", userSchema);
0