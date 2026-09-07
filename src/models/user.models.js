import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt" 
import crypto from "crypto" 
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    avatar:{
        type:{
            url: String , 
            localPath: String , 
        },
        default:{
            url:`https://www.istockphoto.com/illustrations/default-user-icon` , 
            localPath:"" , 
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
    }
    ,
    fullname:{
        type:String , 
        trim:true ,
        required:true ,
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
        type:String
    }
    ,
    forgotPasswordToken:{
        type:Date , 
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

userSchema.generateAccessToken = function(){
    return jwt.sign({
        _id:this.id , 
        email:this.email , 
        username: this.username 
    },
    process.env.ACCESS_TOKEN_SECRET ,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
)
}

userSchema.generateRefreshToken = function(){
    return jwt.sign({
        _id: this.id ,
    },
    process.env.REFRESH_TOKEN_SECRET , 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY 

    }
)
}

userSchema.generateTemporaryToken = function(){
    const unhashedToken = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
    const tokenExpiry = Date.now() + (34*43*10) ;
    return {unhashedToken , hashedToken , tokenExpiry} ;
}



export const User = mongoose.model("User" , userSchema);

