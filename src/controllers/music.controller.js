import { User } from "../models/user.model.js";
import { Music } from "../models/music.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import dotenv from "dotenv";
dotenv.config();

export const uploadMusic = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    // title, subTitle , mainGenre , Duration   = req.body
    const {
      title,
      subTitle,
      mainGenre,
      duration,
      musicMastering,
      coverImageByLeeLoop,
    } = req.body;

    // Get thumbnail image from request files
    const coverImage = req.files.coverImage;
    
    // Get music file from request files
    const musicFile = req.files.musicFile;

    //   // Get thumbnail image and music file from request files
    //   const coverImage = req.files || req.files.coverImage; // Check if req.files exists
    //   console.log(coverImage)

    //   const musicFile = req.files || req.files.musicFile; // Check if req.files exists
    //   console.log(musicFile)

    // Check if any of the required fields are missing
    if (
      !title ||
      !subTitle ||
      !mainGenre ||
      !musicMastering ||
      !duration ||
      !coverImageByLeeLoop ||
      !musicFile
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    if (coverImageByLeeLoop === false) {
      return res.status(400).json({
        success: false,
        message: "Cover image is  required",
      });
    }

    // get artist mongoid from req.user
    const artist = req.user;

    // music , cover => Cloudinary
    const coverImageURL = await uploadOnCloudinary(coverImage);
    const musicFileURL = await uploadOnCloudinary(musicFile);

    // const durationInSec = parseInt(duration)
    // console.log(durationInSec)
    //  save in mongodb
    const newMusic = await Music.create({
      title,
      subTitle,
      mainGenre,
      duration,
      musicMastering,
      coverImageByLeeLoop,
      artist: artist,
      coverImage: coverImageURL,
      musicFile: musicFileURL,
    });

    //  save mongoid in the array ie uploadedMusic of User

    await User.findByIdAndUpdate(artist, {
      $push: { uploadedMusic: newMusic._id },
    });
    // return 200

    return res.status(200).json({
      sucess: true,
      message: "Music uploaded successfully",
      data: newMusic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create music",
      error: error.message,
    });
  }
};

export const getAllMusic = async (req, res) => {
  try {
    const allMusic = await Music.find().populate("artist").exec();

    return res.status(200).json({
      success: true,
      data: allMusic,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Music Data`,
      error: error.message,
    });
  }
};

export const getMusicById = async (req, res) => {
  try {
    const { id } = req.body;
    const music = await Music.findById(id).populate("artist").exec();

    return res.status(200).json({
      success: true,
      data: music,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Music Data`,
      error: error.message,
    });
  }
};

export const updateMusic = async (req, res) => {
  try {
    const { id , status , releaseDate, publishedLink } = req.body

    const updatedMusicDetails = await Music.findByIdAndUpdate(
      id,
      {
        status , releaseDate ,publishedLink
      },
      {
        new :true
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedMusicDetails,
    });



  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Error in  Updating  Music",
      error: error.message,
    });
  }
};




