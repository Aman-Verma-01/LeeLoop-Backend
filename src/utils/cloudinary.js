import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 const uploadOnCloudinary = async (file) => {
  try {
    if (!file) return null;
    //upload file on Cloudinary
    const response = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    // File has been uploaded Successfully
    console.log("File Uploaded on Cloudinary" + response.url);
   
    return response.url;
  } catch (error) {
   
    // Removes loacl saved temporary file as the upload operation gets failed
    console.log("Error in cloudlinary Uploading file : " + error)

    return null;
  }
};


export {uploadOnCloudinary}