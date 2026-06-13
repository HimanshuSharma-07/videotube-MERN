import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    let { page = 1, limit = 10 } = req.query

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    page = Math.max(1, parseInt(page))
    limit = Math.min(50, parseInt(limit)) // prevent abuse

    const videoExists = await Video.exists({ _id: videoId })

    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        }
    ])

    const options = {
        page,
        limit
    }

    // Fallback if aggregatePaginate is not added as plugin in model
    // we use standard pagination or if it is added (as in standard Chai aur Code) we use it
    const comments = await Comment.aggregatePaginate(aggregate, options)

    return res
        .status(200)
        .json(
            new ApiResponse(200, comments, "Comments fetched successfully")
        )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body

    if (!videoId || !content) {
        throw new ApiError(400, "Video Id and content are required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const comment = await Comment.create({
        video: videoId,
        content,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, comment, "Comment added successfully")
        )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { commentId } = req.params
    const { content } = req.body

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    comment.content = content
    await comment.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment updated successfully")
        )

})


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment deleted successfully")
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}