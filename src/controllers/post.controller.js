import asyncHandler from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Post } from "../models/post.models.js";
import slugify from "slugify" 
import { PostStatusEnum } from "../utils/constants.js";
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
    const posts = await Post.find()
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
    return res
            .status(200)
            .json(
                new ApiResponse(200 , post , "Post fetched successfully")
            )
})

export {createPost ,getAllPost , getPostBySlug}