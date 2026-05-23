import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { 
    addComment,
    deleteComment,
    getCommentByVideoId,
    getVideoCommentByVideoId,
    getVideoComments,
    updateComment,

} from "../controllers/comment.controller.js"


const router = Router();


router.route("/video/:videoId").get(getCommentByVideoId)


router.route("/add-comment").post(verifyJWT, addComment)
router.route("/update/:commentId").patch(verifyJWT, updateComment)
router.route("/delete/:commentId").delete(verifyJWT, deleteComment)



export default router;