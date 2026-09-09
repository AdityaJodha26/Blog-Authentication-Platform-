import {body} from "express-validator" 

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
            .isLowercase()
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
const userLoginValidator = () =>{
    return[
        body("email")
        .isEmail()
        .withMessage("Email should be in the correct format")
        .notEmpty()
        .withMessage("Email is compulsory")
        .trim()
        ,
        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
    ]
}
const userChangeCurrentPasswordValidator = () =>{
    return []
        body("oldPassword").notEmpty().withMessage("Old Password is required") 
        ,
        body("newPassword").notEmpty().withMessage("New Password is required")


}

const userForgotPasswordValidator = ()=>{
    return[
        body("email")
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is invalid")
    ]
}

const userResetPasswordValidator = ()=>{
    return [
        body("newPassword")
            .notEmpty()
            .withMessage("Password is required")
    ]
}
export {UserRegisterValidator , userLoginValidator , userChangeCurrentPasswordValidator ,userForgotPasswordValidator , userResetPasswordValidator} 