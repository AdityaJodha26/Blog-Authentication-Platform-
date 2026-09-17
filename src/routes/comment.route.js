import Router from "express"
import { createComment, getAllComments, updateComment , deleteComment} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
const router = Router()

router  
    .route("/:postId")
    .post(verifyJWT , createComment)

router
    .route("/:postId")
    .get(getAllComments)

router
    .route("/:commentId")
    .patch(verifyJWT , updateComment)

router
    .route("/:commentId")
    .delete(verifyJWT , deleteComment)
export default router 