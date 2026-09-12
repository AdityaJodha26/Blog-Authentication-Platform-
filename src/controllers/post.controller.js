import asyncHandler from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Post } from "../models/post.models.js";
import slugify from "slugify" 

const createPost = asyncHandler(async(req ,res)=>{
    const {title , content , excerpt } = req.body ;

    const slug = slugify(title , {
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

export {createPost}