import mongoose from "mongoose" 

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`✅ MongoDb successfully connected , ${connectionInstance.connection.host}` )

    }
    catch(error){
        console.error("❌ MongoDb not connected")
        console.log("Error" , error) ;
    }
    
}
export default connectDB 