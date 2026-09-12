import { Router } from "express";
import {createPost} from "../controllers/post.controller.js"
import { createBlogValidator } from "../validators/index.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {validate} from "../middleware/validator.middleware.js"

const router = Router() 
 
router
    .route("/create-post")
    .post(verifyJWT , createBlogValidator() , validate , createPost)

export default router 