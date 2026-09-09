import Router from "express" 
import { UserRegisterValidator , userLoginValidator , userResetPasswordValidator ,userForgotPasswordValidator , userChangeCurrentPasswordValidator } from "../ validators/index.js"
import { validate }  from "../middleware/validator.middleware.js"
import { registerUser , login , logout , verifyEmail ,getCurrentUser , changePassword , forgotPassword , resetPassword , resendEmailVerification ,refreshAccessToken } from "../controllers/auth.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
const router = Router()

router.route("/register").post(UserRegisterValidator() , validate , registerUser)  
router.route("/login").post(login)  
router.route("/logout").post(verifyJWT , logout)  
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").post(userForgotPasswordValidator(), validate , forgotPassword)
router.route("/reset-password/:resetToken").post(userResetPasswordValidator() , validate ,resetPassword)
router.route("/change-password").post(userChangeCurrentPasswordValidator() , validate ,verifyJWT , changePassword)
router.route("/getCurrentUser" ).get(getCurrentUser)


export default router