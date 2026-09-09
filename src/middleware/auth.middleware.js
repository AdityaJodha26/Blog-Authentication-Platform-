import {User} from "../models/user.models.js" 
import { ApiErrors } from "../utils/apiErrors.js" 
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req , res , next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "" )
    if(!token) {
        throw new ApiErrors(402 , "Token not found")

    }

    try{
        const decodedToken = await jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) 
        
        const user = await User.findById(decodedToken?.id).select("-password  refreshToken emailVerificationToken emailVerificationExpiry")

        if(!user){
            throw new ApiErrors(401 , " User not valid")

        }

        req.user = user 
        next()
    }catch(error){
        throw new ApiErrors(401 , "Invalid User")
    }
    
})