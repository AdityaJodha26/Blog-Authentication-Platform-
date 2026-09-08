import {ApiErrors} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js"
import  asyncHandler from "../utils/asyncHandler.js"
import {sendMail , emailVerificationMailgenContent, forgotPasswordMailgenContent} from "../utils/mail.js"
import jwt from "jsonwebtoken" 
import {User} from "../models/user.models.js"

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave : false})
        return {accessToken , refreshToken}
    }
    catch(err){
        throw new ApiError(500 , "Something went wrong while generating access and refresh Token")

    }

}
const registerUser = asyncHandler(async(req, res ,next)=>{
    const {email , username , password , role} = req.body ; 

    const existedUser = await User.findOne({
        $or:[{username} , {email}]
    })
    
    if(existedUser){
        throw new ApiError(402 , "User already exist")
    }

    const user = await User.create({
        username ,
        email ,
        password ,
        isEmailVerified:false 
    })

    const {unhashedToken , hashedToken , tokenExpiry} = user.generateTemporaryToken

    user.emailVerificationToken = hashedToken ;
    user.emailVerificationExpiry = tokenExpiry ;
    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email , 
        subject: "Please verify email" ,
        mailgen: emailVerificationMailgenContent(
            user.username , 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}` 
        )
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry") ;
    if(!createdUser) {
        throw new ApiError(
            400 , "User not created"
        )
    }

    return res.
            status(200) 
            .json(new ApiResponse(200 ,createdUser , "User created Successfully"))
    
})

const login = asyncHandler(async(req, res ,next)=>{

    const {email , password} = req.body ;

    if(!email){
        throw new ApiErrors(402 , "Email is required") 
    }
    const user = await User.findOne({email})

    if(!user){
        throw new ApiErrors(404 , "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiErrors(402, "Password is not Correct")
    }

    const{ accessToken , refreshToken } = await generateAccessAndRefreshToken() ;

    const loggedInUser = await User.findById(user._id).select("-password refreshToken emailVerificationToken emailVerificationExpiry")

    const options= {
        httpOnly : true ,
        secure : true , 
    }

    return res
            .status(200)
            .cookie("accessToken" , accessToken , options)
            .cookie("refreshToken" , refreshToken , options)
            .json(new ApiResponse (200 , { user : loggedInUser  , accessToken , refreshToken}) , "User logged in successfully")
            

})

export {registerUser}
