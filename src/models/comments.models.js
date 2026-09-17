import mongoose,{Schema} from "mongoose"

const commentSchema = new Schema(
    {
        content:{
            type: String , 
            required:true ,
            trim:true , 
            
        },
        author:{
            type: Schema.Types.ObjectId,
            ref: "User" ,
            required:true , 
            trim : true ,

        },
        post:{
            type:Schema.Types.ObjectId,
            ref:"Post",
            required:true ,
        }
    },{timestamps:true} 
)

export const Comment = mongoose.model("Comment" , commentSchema) 

