import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt" 
import crypto from "crypto" 
import jwt from "jsonwebtoken"
import { kMaxLength } from "buffer"

const userSchema = new Schema({
    avatar:{
        type:{
            url: String , 
            public_id: String , 
        },
        default:{
            url:`https://www.istockphoto.com/illustrations/default-user-icon` , 
            public_id:"" , 
        }

    },
    username:{
        type:String , 
        required: true , 
        trim: true ,
        lowercase:true ,
        unique:true , 
    }
    ,
    email:{
        type:String , 
        required:true , 
        unique:true ,
        lowercase:true ,
        trim:true ,
    },
    bio:{
        type:String ,
        trim : true , 
        maxlength:160 
    }
    ,
    fullname:{
        type:String , 
        trim:true ,
        
    }
    ,
    password:{
        type:String ,
        required:true , 

    }
    ,
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    }
    ,
    forgotPasswordExpiry:{
        type:Date
    }
    ,
    forgotPasswordToken:{
        type:String , 
    },
    emailVerificationToken:{
        type:String
    },
    emailVerificationExpiry:{
        type:Date,
    }


},{timestamps: true})

userSchema.pre("save" , async function(){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password , 10)

}) // works just after user registration

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this.id , 
        email:this.email , 
        username: this.username 
    },
    process.env.ACCESS_TOKEN_SECRET ,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this.id ,
    },
    process.env.REFRESH_TOKEN_SECRET , 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY 

    }
)
}

userSchema.methods.generateTemporaryToken = function(){
    const unhashedToken = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
    const tokenExpiry = Date.now() + (34*43*1000) ;
    return {unhashedToken , hashedToken , tokenExpiry} ;
}





export const User = mongoose.model("User" , userSchema);

