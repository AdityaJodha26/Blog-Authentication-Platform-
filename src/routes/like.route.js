import Router from "express" 
import { verifyJWT } from "../middleware/auth.middleware.js"
import {getLikesDetails, toggleLike} from "../controllers/like.controller.js"

const router = Router() 

router
    .route("/toggle/:postId")
    .post(verifyJWT , toggleLike)
router
    .route("/:postId")
    .get(verifyJWT , getLikesDetails)
export default router
