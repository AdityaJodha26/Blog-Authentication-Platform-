import multer from "multer"
const storage = multer.diskStorage({
    destination:function(req, file , cb){
        cb(null , "./public/temp") ;
    }
    , 
    filename:function(req, file , cb){
        cb(null ,file.originalname)
    }
    
    
})

const fileFilter = (req , file , cb)=>{
    const allowedTypes = [
        "images/jpeg" , 
        "images/png" , 
        "images/webp"
    ]
    if(allowedTypes.includes(file.mimeTypes)){
        cb(null ,true)
    }else{
        cb(new Error("only jpeg , png and webp files are allowed") ,false)
    }
}

export const upload = multer({storage , fileFilter , limits:{filesize:5*1024*1024}})