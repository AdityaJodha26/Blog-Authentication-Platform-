import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    post : {
        type: Schema.Types.ObjectId ,
        ref:"Post" , 
        required:true 
    }

    ,
    author:{
        type:Schema.Types.ObjectId ,
        ref:"User" ,
        required:true
    }

} , {timestamps:true })

likeSchema.index({ // single user can like a post only 1 time
    user:1 , post:1
} , {unique: true })

export const Like = mongoose.model("Like" , likeSchema)
