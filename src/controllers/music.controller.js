import { User } from "../models/user.model.js";
import { Music } from "../models/music.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {mailSender} from "../utils/mailSender.js"
import {musicRegisterSuccessfullMail} from "../mails/musicUploadedMail.js"
import Stripe from 'stripe'


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


    let amount = 5 
    if(coverImageByLeeLoop)
      {
        amount=amount+5
      }

    if(musicMastering)
     {
      amount=amount+8
     }




    // **********************************************************
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

   
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode:"payment",
      success_url:process.env.STRIPE_SUCCESS_URL,
       line_items:[
        {
          price_data:{
            currency:process.env.STRIPE_CURRENCY,
            unit_amount: amount * 100,
            product_data:{
              name:"Buy Music"
            }
          },
          quantity:1
        }
      ]

    })
   





    // **************************************************


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



    try {
      const emailResponse = await mailSender(
        'leeloop@gmail.com',
        "Registeration Successful",
        musicRegisterSuccessfullMail(artist, "email")
      );
      console.log("Email sent successfully:");
      
   

    // Sending JSON response with cookie set

    // Chnaged it 
    
    // return res.status(200).json({
    //   sucess: true,
    //   message: "Music uploaded successfully",
    //   data: newMusic,
    // });

///********************************* */
    res.status(200).json({
      success:true,
      message:"Paid",
      session:session
    })

    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });


    }
    // return 200

   
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

export const deleteMusic = async (req,res) => {
  try {
    const {musicId} = req.body
    const userId = req.user

    console.log("musicId " + musicId)



    const music = await Music.findById(musicId)
    if (!music) {
      return res.status(404).json({ message: "Music not found"})
    }





    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

   
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode:"payment",
      success_url:process.env.STRIPE_SUCCESS_URL,
       line_items:[
        {
          price_data:{
            currency:process.env.STRIPE_CURRENCY,
            unit_amount: 120 * 100,
            product_data:{
              name:"Delete Music"
            }
          },
          quantity:1
        }
      ]

    })


    await  await User.findByIdAndUpdate(userId, {
      $pull: { uploadMusic: musicId },
    })

    await Music.findByIdAndDelete(musicId)

   

    res.status(200).json({ message: 'Music deleted successfully.' , session:session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}




