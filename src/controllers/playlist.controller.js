import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist

    if (!name || name.trim() === "" || !description || description.trim() === "") {
        throw new ApiError(400, "Name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                },
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    createdAt: 1,
                    views: 1
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1
                }
            }
        }

    ])

    if (!playlist?.length) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can add video to their playlist")
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to add video to playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can remove video from their playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to remove video from playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can delete their playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200, {playlistId}, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    if (!name || name.trim() === "" || !description || description.trim() === "") {
        throw new ApiError(400, "Name and description are required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can edit their playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to update playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
