import asyncHandler from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Post } from "../models/post.models.js";
import slugify from "slugify" 
import { AvailablepostStatuses, PostStatusEnum } from "../utils/constants.js";
import mongoose from "mongoose";


const createPost = asyncHandler(async(req ,res)=>{
    const {title , content , excerpt } = req.body ;

    let slug = slugify(title , {
        lower : true , 
        strict : true , 
    })

    let slugExist = await Post.findOne({slug})

    let counter = 1 ;

    while(slugExist){
        slug = `${slugify(title , {
            lower:true , 
            strict:true , 
        })}-${counter}`

        slugExist = await Post.findOne({slug})

        counter++ 
    }

    const post = await Post.create({
        title ,
        slug , 
        content , 

        excerpt , 
        author: req.user._id,
    })
    
    if(!post){
        throw new ApiErrors(
            500,"Post could not be created"
        )
    }

    return res
        .status(201)
        .json(new ApiResponse(201 , post , "post created successfully"))
})

const getAllPost = asyncHandler(async(req ,res)=>{
    const posts = await Post.findOne({status:PostStatusEnum.PUBLISHED})
    .populate("author" , "username fullname avatar")
    .sort({createdAt:-1})
    

    

    return res  
            .status(200)
            .json( new ApiResponse(200 , posts ,"Posts fetched successfully"))
})

const getPostBySlug = asyncHandler(async(req,res)=>{
    const {slug} = req.params

    const post = await Post.findOne({slug})
        .populate("author","username fullname avatar")
        
    if(!post){
        throw new ApiErrors(404 , "Post not found")

    }
    if(post.status = PostStatusEnum.DRAFT){
        if(!req.user || post.author._id.toString() !== req.user._id.toString()){
            throw new ApiErrors(404  ,"Post not found")
        }
    }
    return res
            .status(200)
            .json(
                new ApiResponse(200 , post , "Post fetched successfully")
            )
})
const updatePost = asyncHandler(async(req ,res)=>{
    const {slug} = req.params 
    const {title , content , excerpt} = req.body 
    const post = await Post.findOne({slug})
    
    if(!post){
        throw new ApiErrors(404 ," Post not found")
    }
   
    if(post.author.toString()!== req.user._id.toString()){
        throw new ApiErrors(403 ,"You are not allowed to update this blog")
    }

    if(title!== undefined){
        post.title = title 
    }
    if(content!== undefined){
        post.content = content 
    }
    if(excerpt!==undefined){
        post.content = content
    }
    await post.save()

    return res
            .status(200)
            .json(new ApiResponse(200 , post , "Post updated Successfully"))
})

const deletePost = asyncHandler(async(req ,res)=>{
    const {slug} = req.params
    const post = await Post.findOne({slug})
    
    if(!post) {
        throw new ApiErrors(404 , "post not found")
    }

    if(post.author.toString()!==req.user._id.toString()){
        throw new ApiErrors(403 , "You are not allowed to delete this ")
    }

    await Post.deleteOne({_id : post._id}) ; 
    return res
            .status(200) 
            .json(new ApiResponse(200 , null ,"Post deleted Successfully"))
})

const publishPost = asyncHandler(async(req ,res)=>{
    const {slug} = req.params
    const post = await Post.findOne({slug})
    if(!post){
        throw new ApiErrors(404 , "post not found")

    }
    if(post.author.toString()!== req.user._id.toString()){
        throw new ApiErrors(404 ,"You cannot publish it ")
    }

    post.status = PostStatusEnum.PUBLISHED ;
    post.publishedAt = new Date()
    await post.save() 

    return res 
            .status(200)
            .json( new ApiResponse(200 , {} , "Post published successfully"))

})
const unpublishPost = asyncHandler(async(req, res)=>{
    const {slug} = req.params 
    const post = await Post.findOne({slug})
    if(!post){
        throw new ApiErrors(404 , "Post not found")

    }

    if(post.author.toString()!==req.user._id.toString()){
        throw new ApiErrors(403 , "You cannot publish it ")
    }

    post.PostStatusEnum = AvailablepostStatuses.DRAFT 
    post.publishedAt = null
    await post.save()

    return res
        .status(200)
        .json(new ApiResponse(200 , "Post unpublished successfully"))
})

const getMyPost = asyncHandler(async(req ,res)=>{
    const {status} = req.query 
    
    const filter ={author: req.user._id}

    if(status){
        filter.status = status 
    }

    const posts = await Post.find(filter)
        .sort({createdAt:-1})

    return res  
            .status(200)
            .json(new ApiResponse(200 , posts , "Post fetched successfully"))
    


})


export {createPost ,getAllPost , getPostBySlug , updatePost , deletePost 
    , publishPost , unpublishPost , getMyPost}