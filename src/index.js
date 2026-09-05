import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
}); 

import app from "./app.js"

const port = process.env.PORT || 3001

import connectDB from "./database/databaseCnFl.js"
connectDB()
.then(()=>{
    app.listen(port , ()=>{
        console.log(`example app is running on http://localhost:${port}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection error" , err) ;
})


