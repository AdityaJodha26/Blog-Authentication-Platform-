import asyncHandler from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.models.js";
import { Post } from "../models/post.models.js";
import { PostStatusEnum } from "../utils/constants.js";


const toggleLike = asyncHandler(async(req , res)=>{
    const {postId} = req.params
    const {userId} = req.user_id 
    const post = await Post.findById(postId)
    if(!post){
        throw new ApiErrors(404 , "post not found")

    }if(post.status!==PostStatusEnum.PUBLISHED){
        throw new ApiErrors(403 , "Only Published post can be liked")
    }

    const existingLike = Like.findOne({
        post :postId ,
        user : userId , 
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike_id)
        
        return res
            .status(200)
            .json(new ApiResponse(200 , {liked:false} , "Unliked successfully"))
    }
   
    const like = Like.create({
        postId , 
        userId
    })

    return res
        .status(201)
        .json(new ApiResponse(201 , {liked:true , like} , "Post like successfully"))

})

export {toggleLike}