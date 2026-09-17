import asyncHandler from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comments.models.js";
import { Post } from "../models/post.models.js";
import { PostStatusEnum } from "../utils/constants.js";

const createComment = asyncHandler(async(req, res)=>{
    const {content} = req.body 
    const {postId} = req.params 

    if(!content?.trim()){
        throw new ApiErrors(400 , "Comment is required")

    }
    
    const post = await Post.findById(postId)
    if(!post){
        throw new ApiErrors(404 , " Post not found ")
    }

    if(post.status !== PostStatusEnum.PUBLISHED){
        throw new ApiErrors(400 , "Cannot comment on unpublished Post")
    }
    
    const comment = await Comment.create({
        content , 
        author : req.user._id ,
        post: postId 
    })

    return 
        res
        .status(200)
        .json( new ApiResponse(201 , comment , "Comment done"))

})

const getAllComments = asyncHandler(async(req, res)=>{
    const {postId} = req.params 
    const post = await Post.findById(postId) 
    if(!post){
        throw new ApiErrors(404 , "Post not found")
    }

    const comments = await Comment.find({
        post:postId
    })
    .populate("author" , "username avatar")
    .sort({createdAt:-1});

    return res
        .status(200)
        .json(new ApiResponse(200 , comments , "All comments are fetched"))
})

const updateComment = asyncHandler(async(req ,res)=>{
    
    const {newcontent} = req.body
    const { commentId} =req.params
    
    if(!newcontent?.trim()){
        throw new ApiErrors(400 , "Content is required")
    }
    const comment = await Comment.findById(commentId) 
    if(!comment){
        throw new ApiErrors(404 , "Comment not found")
    }
    if(comment.author.toString()!== req.user._id.toString()){
        throw new ApiErrors(403 ,"You cannot update the comment")
    }
    comment.content = newcontent.trim()
    await comment.save() 
    
    return res
            .status(200)
            .json(new ApiResponse(200 , comment , "comment updated succesfully"))

})
const deleteComment = asyncHandler(async(req ,res)=>{
    const {commentId}  = req.params 
    
    const comment = await Comment.findById(commentId) ;
    if(!comment){
        throw new ApiErrors(404 , "Comment not found")
    }

    if(comment.author.toString()!==req.user._id.toString()){
        throw new ApiErrors(403 , "You do not have any right to delete the comment ")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200 , null , "Comment deleted Successfully"))

})
export {createComment , getAllComments ,updateComment , deleteComment}