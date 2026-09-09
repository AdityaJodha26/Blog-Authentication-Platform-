import express from "express" 
import cors from "cors"
const app = express() ; 

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public")) 
app.use(cookieParser()) ; 

app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods:["GET" , "POST" , "PUT" ,"DELETE" , "PATCH" , "OPTIONS"],
    allowedHeaders:["CONTENT-TYPE" , "AUTHORIZATION"] ,
})) ; 

app.get("/" , (req ,res)=>{
    res.send("Welcome to the home page")
})
import healthCheckRouter from "./routes/healthcheck.route.js"
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser";

app.use("/api/v1/users" , authRoute)
app.use("/api/v1/healthcheck" , healthCheckRouter)


export default app