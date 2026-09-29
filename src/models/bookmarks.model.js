import mongoose, { Schema } from "mongoose"
 
const bookmarkSchema = new Schema({
    post : {
        type: Schema.Types.ObjectId ,
        ref: "Post" ,
        required: true
    } , 
    user:{
        type:Schema.Types.ObjectId , 
        ref:"User"  , 
        required:true , 


    }
},{timestamps:true})
bookmarkSchema.index({
    author:1 ,post : 1 
},{unique: true})

export const Bookmark = mongoose.model("Bookmark" , bookmarkSchema)
