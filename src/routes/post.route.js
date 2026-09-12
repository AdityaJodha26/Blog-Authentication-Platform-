import { Router } from "express";
import {createPost , getAllPost, getPostBySlug , updatePost} from "../controllers/post.controller.js"
import { createBlogValidator } from "../validators/index.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {validate} from "../middleware/validator.middleware.js"

const router = Router() 
 
router
    .route("/create-post")
    .post(verifyJWT , createBlogValidator() , validate , createPost)
router
    .route("/get-all-post")
    .get(verifyJWT , getAllPost)
router
    .route("/:slug")
    .get(getPostBySlug)
router
    .route("/update-post/:slug")
    .patch(verifyJWT , updatePost)
export default router 