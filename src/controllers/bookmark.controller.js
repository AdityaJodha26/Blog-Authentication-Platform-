import asyncHandler from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Bookmark } from "../models/bookmarks.model.js";
import { Post } from "../models/post.models.js";
import { PostStatusEnum } from "../utils/constants.js";

const getBookmark = asyncHandler(async(req ,res)=>{
    const {postId} = req.params
    const userId = req.user._id
    const post = await Post.findById(postId)
    if(!post){
        throw new ApiErrors(404 , "Post not found")
    }
    if(post.status!==PostStatusEnum.PUBLISHED){
        throw new ApiErrors(400 , "Only Published post can be Bookmarked")
    }

    const existingBookmark = await Post.findOne({
        post:postId , 
        user:userId
    })
    if(existingBookmark){
        await Bookmark.findByIdAndDelete(existingBookmark._id)

        return res  
            .status(200)
            .json(new ApiResponse(200 , {bookmarked:false} , "Bookmarked remove successfully"))



    }

    const createBookmark = await Bookmark.create({
        post:postId ,
        user:userId
    })
    return res  
            .status(201)
            .json(new ApiResponse(201 , {bookmarked:true , createBookmark} , "Bookmarked successfully"))




})
export {getBookmark}