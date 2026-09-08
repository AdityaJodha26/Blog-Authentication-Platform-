import Router from "express" 
import { UserRegisterValidator } from "../ validators/index.js"
import { validate }  from "../middleware/validator.middleware.js"
import { registerUser } from "../controllers/auth.controller.js"

const router = Router()

router.route("/register").post(userRegisterValidator() , validate , registerUser)  
router.route("/login").post(userRegisterValidator() , validate , login)  

export default router