import mongoose,{Schema} from "mongoose";
import { User } from "./user.models.js";
import { AvailablepostStatuses, PostStatusEnum } from "../utils/constants.js";

const postSchema = new Schema({
    title:{
        type:String , 
        trim:true , 
         
        required:true ,
        maxLength:30 , 
        minLength:3
    }
    ,
    slug:{
        type:String ,
        trim:true , 
        unique:true , 
        required:true ,
    } ,

    content:{
        type :String , 
        requred:true ,
        
    }
    ,
    excerpt:{
        type:String ,
        required:true , 
        maxLength:100 ,
    }
    ,
    author:{
        type:Schema.Types.ObjectId ,
        ref:"User" ,
        required:true ,

    },
    coverImage:{
        url:String ,
        publicId:String 
    },
    status:{
        type:String ,
        enum:AvailablepostStatuses ,
        default:PostStatusEnum.DRAFT , 

    } , 
    tags:{
        type : String ,
        trim: true , 
        lowercase :true , 
    } ,
    views:{
        type:Number ,
        default:0 , 
    },

    publishedAt:{
        type:Date , 
    }

} ,{timestamps: true })

export const Post = mongoose.model("Post" , postSchema)