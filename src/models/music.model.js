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
    required: true,
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
    enum: ["Released", "Pending", "Await"],
    default: "Requested",
  },
  releaseDate: {
    type: String,
    default:"",
  },

},
{
    timestamps:true
}

);

export const Video = mongoose.model("Music", musicSchema);

