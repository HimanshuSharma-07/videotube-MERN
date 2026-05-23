import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"



const toggleSubscription = asyncHandler( async (req, res) => {
    const { channeId} = req.body

    if (!channeId) {
        throw new ApiError(404, "Channe ID is required")
    }

    
})