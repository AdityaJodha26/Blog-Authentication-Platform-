import express from "express" 
import cors from "cors"
import healthCheckRouter from "./routes/healthcheck.route.js"
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import bookmarkRouter from "./routes/bookmark.route.js"
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express() ; 
const apiLimiter = rateLimit({
    windowMs:15*60*1000,
    max:100 ,
    message:"Too many request , Please Try again later"
})
app.use("/api", apiLimiter)
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public")) 
app.use(cookieParser()) ; 
app.use(helmet())
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods:["GET" , "POST" , "PUT" ,"DELETE" , "PATCH" , "OPTIONS"],
    allowedHeaders:["CONTENT-TYPE" , "AUTHORIZATION"] ,
})) ; 

app.get("/" , (req ,res)=>{
    res.send("Welcome to the home page")
})


app.use("/api/v1/users" , authRoute)
app.use("/api/v1/healthcheck" , healthCheckRouter)

app.use("/api/v1/posts" , postRouter) 
app.use("/api/v1/comments" ,commentRouter)
app.use("/api/v1/likes" , likeRouter) 
app.use("/api/v1/bookmark" , bookmarkRouter)

export default app