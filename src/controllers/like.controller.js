
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleLike = asyncHandler( async( req, res) => {

    const { commentId, videoId, tweetId } = req.body 

    const targets = [commentId, videoId, tweetId].filter(Boolean)

    if (targets.length !== 1) {
        throw new ApiError(400, "Provide exactly one target (comment, video, or tweet)")

    }

    let query = {}
    let model = null

    if (commentId) {
        if (mongoose.Types.ObjectId.isValid(commentId)) {
            throw new ApiError(400, "Invalid comment Id")
        }

        const exits = await Comment.exits({ _id: commentId}) 
        
        if (!exits) {
            throw new ApiError(404, "Comment not found")
        }

        query = { comment: commentId}
    }

    if (videoId) {
        if (mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "Invalid video Id")
        }

        const exits = await Video.exits({ video: videoId})

        query = { video: videoId}

    }   

    if (tweetId) {
        if (mongoose.Types.ObjectId.isValid(tweetId)) {
            throw new ApiError(400, "Invalid tweet Id")
        }

        const exist = await Tweet.exists({ tweet: tweetId})

        qwery = { tweet: tweetId}
    }

    const existingLike = await Like.findOne({
        ...query,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
            .status(200)
            .json(
                new ApiResponse(
                     200, { liked: false}, "Unliked Successfully"
                )
            )
    }

    await Like.create({
        ...query,
        likedBy: req.user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { liked: true }, "Liked S  uccessfully") 
        )
})


export { 
    toggleLike,
     
}