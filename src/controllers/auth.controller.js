import {ApiErrors} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js"
import  asyncHandler from "../utils/asyncHandler.js"
import {sendMail , emailVerificationMailgenContent, forgotPasswordMailgenContent} from "../utils/mail.js"
import jwt from "jsonwebtoken" 
import {User} from "../models/user.models.js"
import crypto from "crypto"

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
        throw new ApiErrors(500 , "Something went wrong while generating access and refresh Token")

    }

}
const registerUser = asyncHandler(async(req, res ,next)=>{
    const {email , username , password , role} = req.body ; 

    const existedUser = await User.findOne({
        $or:[{username} , {email}]
    })
    
    if(existedUser){
        throw new ApiErrors(402 , "User already exist")
    }

    const user = await User.create({
        username ,
        email ,
        password ,
        isEmailVerified:false 
    })

    const {unhashedToken , hashedToken , tokenExpiry} = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken ;
    user.emailVerificationExpiry = tokenExpiry ;
    await user.save({validateBeforeSave: false})

    await sendMail({
        email: user?.email , 
        subject: "Please verify email" ,
        mailgenContent: emailVerificationMailgenContent(
            user.username , 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}` 
        )
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry") ;
    if(!createdUser) {
        throw new ApiErrors(
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

    const{ accessToken , refreshToken } = await generateAccessAndRefreshToken(user?._id) ;

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

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
const logout = asyncHandler(async(req  , res , next)=>{
    await User.findByIdAndUpdate(
        req.user?.id , 
        {
            $set:{
                refreshToken: ""
            }
        }, 
        {
            new :true , 
        }
    )

    const options = {
        httpOnly :true , 
        secure:true , 
    }

    return res  
            .status(200) 
            .clearCookie("accessToken" , accessToken) 
            .clearCookie("refreshToken" , cookie) 
            .json({
                success: true ,
                message: "User logged Out successfully"
            })            
})
const getCurrentUser = asyncHandler(async(req, res)=>{
    return res  
        .status(200)
        .json(new ApiResponse(200 , req.user , "Current User fetched Successfully"))

})

const verifyEmail = asyncHandler(async(req ,res)=>{
    const {verificationToken} = req.params
    if(!verificationToken){
        throw new ApiErros(400 , "Email verification token is missing")

    }
    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

    const user = await User.findOne({
            emailVerificationToken:hashedToken , 
            emailVerificationExpiry: {$gt: Date.now()}

    })
    if(!user){
            throw new ApiErrors(400 , "Token is invalid or expired")

    }

    user.emailVerificationToken = undefined 
    user.emailVerificationExpiry = undefined

        user.isEmailVerified = true 
        await user.save({validateBeforeSave:false})
      

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200 ,
                    {
                        isEmailVerified : true 
                    } ,

                    "Email is Verified"
                )
            )

    
})
const resendEmailVerification = asyncHandler(async(req ,res)=>{
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiErrors(404 , "User not found")

    }

    if(user.isEmailVerified){
        throw new ApiErrors(404 , "Email is already verified")
    }

    const {unhashedToken , hashedToken , tokenExpiry} = user.generateTemporaryToken() 

    user.emailVerificationToken  = hashedToken ; 
    user.emailVerificationExpiry  = tokenExpiry ; 

    await sendMail({
        email: user?.email ,
        subject: options.subject , 
        mailgenContent: emailVerificationMailgenContent(
            user.username , 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        ) , 

    })

    return res
            .status(200)
            .json(new ApiResponse(200 , {} ,"Verification email has been sent"))
    
})

const refreshAccessToken = asyncHandler(async(req ,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken 

    if(!incomingRefreshToken) {
        throw new ApiErrors(401 , "Unauthorized Access")
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiErrors(404 , "User not found")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiErrors(400 , "Unauthorized Access")
        }
        
        const options = {
            httpOnly : true ,
            secure: true , 
        }

        const {accessToken , refreshToken : newRefreshToken} = await generateAccessAndRefreshToken(user?._id)

        user.refreshToken = newRefreshToken 

        await user.save()

        return res
                .status(200) 
                .cookie( "accessToken" , accessToken , options) 
                .cookie( "refreshToken" , newRefreshToken , options)
                .json(new ApiResponse(
                    200 , {accessToken , refreshToken:newRefreshToken} , "new AccessToken generated"
                )) 
    }
    catch(error){
        throw new ApiError(401, "Invalid refresh token");

    }
})

const forgotPassword = asyncHandler(async(req ,res)=>{
    const {email} = req.body ; 

    const user = await User.findOne({email})
    if(!user){
        throw new ApiErrors(400 , "User not found")
    }

    const {unhashedToken , hashedToken , tokenExpiry} = user.generateTemporaryToken() ;

    user.forgotPasswordToken = hashedToken 
    user.forgotPasswordExpiry = tokenExpiry

    await user.save({validateBeforeSave : true})

    await sendMail({
        email: user?.email , 
        subject: "Verify your mail" ,
        mailgenContent: forgotPasswordMailgenContent(
            user.username , 
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedToken}`
        )

    })

    return res
            .status(200)
            .json(new ApiResponse(200 , {}, "Password reset email has been sent to your email"))


})

const resetPassword = asyncHandler(async(req ,res)=>{
    const {resetToken} = req.params 
    const {newPassword} = req.body

    let hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    const user = await User.findOne({
        forgotPasswordToken:hashedToken , 
        forgotPasswordExpiry: {$gt: Date.now()}

    })

    if(!user){
        throw new ApiErrors(404 ," User not found")
    }
    user.forgotPasswordToken = undefined 
    user.forgotPasswordExpiry = undefined 


    user.password = newPassword 
    await user.save({validateBeforeSave : false})
    return res
        .status(200)
        .json(new ApiResponse(200 , {} , "Password Reset is successfull"))

})

const changePassword = asyncHandler(async(req, res)=>{
    const {oldPassword , newPassword} = req.body 
    const user = await User.findById(user?.id)
    if(!user){
        throw new ApiErrors(404 ,"User not found")
    }

    const isPasswordValid = await User.isPasswordCorrect(oldPassword)
    if(!isPasswordValid){
        throw new ApiErrors(400 , "Password is not correct")
    }

    user.password = newPassword 
    await user.save({validateBeforeSave:false})

    return res
            .status(200)
            .json( new ApiResponse(200 , {} , "Password Changed Successfully"))
})

export {registerUser , login , logout, verifyEmail , getCurrentUser , resendEmailVerification ,refreshAccessToken , forgotPassword , resetPassword ,changePassword }
