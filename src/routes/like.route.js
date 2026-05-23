import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware"
import { toggleLike } from "../controllers/like.controller";


const router = Router();


router.route("video/:videoId")
    .post(verifyJWT, toggleLike)


router.route("/comments/:commentId")
    .post(verifyJWT, toggleLike)

router.route("/comments/:tweetId")
    .post(verifyJWT, toggleLike)


export default router