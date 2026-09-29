import Router from "express" ;
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getBookmark } from "../controllers/bookmark.controller.js";


const router = Router()

router
    .route("/toggle/:postId")
    .post(verifyJWT , getBookmark)

export default router

