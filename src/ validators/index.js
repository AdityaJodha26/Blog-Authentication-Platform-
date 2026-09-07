import {body} from "express-validator" 
import { registerUser } from "../controllers/auth.controller"

const UserRegisterValidator = ()=>{
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is compulsory")
            .isEmail()
            .withMessage("Enter a valid Email")
        ,
        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is required")
            .isLowerCase()
            .withMessage("username should be in lowercase")
            .isLength({min:3})
            .withMessage("username atleast be 3 character long")
        ,
        body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required") 

        ,
        body("fullname")
            .trim() 
            .optional()


    ]
} 
export {UserRegisterValidator} 