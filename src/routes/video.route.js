import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { 
    deleteVideo, 
    getAllVideos, 
    getVideoById, 
    publishAVideo, 
    togglePublishStatus, 
    updateVideo 
} from "../controllers/video.controller.js"

const router = Router()

router.route("/").get(getAllVideos)

router.route("/upload-video").post(
        verifyJWT,
        upload.fields([
            { name: "video", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 }
        ]),
        publishAVideo
    )

router.route("/:videoId").get(getVideoById)
router.route("/update/:videoId").patch(
        verifyJWT,
        upload.fields([
            { name: "thumbnail", maxCount: 1 }  
        ]),
        updateVideo
    )


router.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus)
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo)

export default router