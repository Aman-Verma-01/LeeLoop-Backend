import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

const registerUser = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { username, email, password } = req.body;
    // Check if All Details are there or not
    if (!username || !email || !password) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }
    // Check if password and confirm password match

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        token: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json({ success: true, message: "User Logged Out Successfully" });
};

const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find().populate("uploadedMusic").exec();

    return res.status(200).json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch User Data`,
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.user;
    console.log("ID ********************************");
    console.log(id);
    const user = await User.findById(id).populate("uploadedMusic").select("-password").exec();

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch User Data`,
      error: error.message,
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { username, address } = req.body;
    // Get  image from request files
    const profileImage = req.files.coverImage;
    const id = req.user;

    const profileImageURL = await uploadOnCloudinary(coverImage);

    const updateUserDetails = await User.findByIdAndUpdate(
      id,
      {username, address , profileImage:profileImageURL},
      {new:true}
    )

    return res.status(200).json({
      success:true,
      message:"User Details Updated",
      data:updateUserDetails
    })
  
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: `Can't Update User Details`,
      error: error.message,
    });
  }
};

const changePassword = async(req,res) => {}

export {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  getUserById,
  updateUserDetails,
  changePassword
};
