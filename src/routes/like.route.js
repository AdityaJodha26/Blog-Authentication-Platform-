import Router from "express" 
import { verifyJWT } from "../middleware/auth.middleware.js"
import {toggleLike} from "../controllers/like.controller.js"

const router = Router() 

router
    .route("/toggle/:postId")
    .post(verifyJWT , toggleLike)

export default router
