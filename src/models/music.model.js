import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  mainGenre: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String, // Cloudinary
    
  },
  musicFile: {
    type: String, // Cloudinary
    required: true,
  },
  musicMastering:{
    type:Boolean,
    required:true,
  },
  coverImageByLeeLoop:{
    type:Boolean,
    required:true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Released", "Pending", "Await","Requested"],
    default: "Requested",
  },
  releaseDate: {
    type: String,
    default:"Not Set yet",
  },
  publishedLink:{
    type:String,
    default:"Not Released Yet"
  }

},
{
    timestamps:true
}

);

export const Music = mongoose.model("Music", musicSchema);

