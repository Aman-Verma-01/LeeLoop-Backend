import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

import dotenv from 'dotenv'
dotenv.config()


export const verifyJWT = asyncHandler (async (req,res,next) => {
    try {
        
        const token =  req.cookies?.token || req.header("authorization").replace("bearer ", "")
        if(!token){

            return res.status(401).json({
				success: false,
				message: `Token is missing `,
			});
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id).select("-password ")

        if(!user){
            return res.status(401).json({
				success: false,
				message: `User is invalid`,
			});
        }

        req.user = user
        next()


    } catch (error) {
        // throw new ApiError(401, error?.message || "Invalid access token")
        return res.status(401).json({
            success: false,
            message: `Invalid response`,
            error:error,
        });
        
    }
}) 
