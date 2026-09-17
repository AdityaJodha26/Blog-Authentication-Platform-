import asyncHandler from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.models.js";
import { Post } from "../models/post.models.js";
import { PostStatusEnum } from "../utils/constants.js";


const toggleLike = asyncHandler(async(req , res)=>{
    const {postId} = req.params
    const userId = req.user._id 
    const post = await Post.findById(postId)
    if(!post){
        throw new ApiErrors(404 , "post not found")

    }if(post.status!==PostStatusEnum.PUBLISHED){
        throw new ApiErrors(400 , "Only Published post can be liked")
    }

    const existingLike = await Like.findOne({
      
        author: userId , 
        post:postId
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        
        return res
            .status(200)
            .json(new ApiResponse(200 , {liked:false} , "Unliked successfully"))
    }
   
    const like = await Like.create({
        post:postId ,
        author:userId ,
    })

    return res
        .status(201)
        .json(new ApiResponse(201 , {liked:true , like} , "Post like successfully"))

})

const getLikesDetails = asyncHandler(async(req , res)=>{
    const {postId} = req.params 
    const post = await Post.findById(postId)
    if(!post){
        throw new ApiErrors(404, "Post not found")

    }

    const likecount = await Like.countDocuments({
        post:postId
    })

    const likedByCurrentUser = await Like.findOne({
        author:req.user._id , 
        post:  postId
    })

    return res
        .status(200)
        .json(new ApiResponse(200 , {likecount , liked:!!likedByCurrentUser} , "likes details fetched successfully"))


})

export {toggleLike , getLikesDetails} 