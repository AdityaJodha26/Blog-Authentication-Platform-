import { Router } from "express";
import {createPost , deletePost, getAllPost, getPostBySlug , updatePost ,publishPost, unpublishPost, getMyPost, searchPost} from "../controllers/post.controller.js"
import { createBlogValidator } from "../validators/index.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {validate} from "../middleware/validator.middleware.js"
import { upload } from "../middleware/multer.middleware.js";


const router = Router() 
router
    .route("/my-posts")
    .get(verifyJWT , getMyPost)
router
    .route("/create-post")
    .post(verifyJWT , createBlogValidator() , validate , upload.single("coverImage"), createPost)
router
    .route("/get-all-post")
    .get(verifyJWT , getAllPost)
router
    .route("/search")
    .get(verifyJWT , searchPost)
router
    .route("/:slug")
    .get(getPostBySlug)
router
    .route("/update-post/:slug")
    .patch(verifyJWT , updatePost)
router
    .route("/delete-post/:slug")
    .delete(verifyJWT , deletePost)
router
    .route("/publish-post/:slug")
    .patch(verifyJWT , publishPost)
router
    .route("/unpublish-post/:slug")
    .patch(verifyJWT , unpublishPost)

export default router 