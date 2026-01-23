import {User} from "../models/user.models.js";
import {ProjectMember} from "../models/projectmember.models.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-errors.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.
    replace("Bearer ", "")

    if(!token){
        throw new ApiError(401, "Unauthorized request!")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).
        select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        );

        if(!user){
        throw new ApiError(401, "Invalid access Token!")
        }

        req.user = user
        next()

    } catch (error) {
        if(!user){
        throw new ApiError(401, "Invalid access Token!")
        }
    }
});

// checking for the permissions needed to do some task (who can do what)
export const validateProjectPermission = (roles = []) => {
    asyncHandler(async (req, res, next) => {
        const {projectId} = req.params

        if(!projectId){
            throw new ApiError(
                400, "project id is missing!"
            )
        }

        const project = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id)
        })

        if(!project){
            throw new ApiError(
                400, "Not a project member!"
            )
        }

        const givenRole = project?.role
        req.user.role = givenRole
        if(!roles.includes(givenRole)){
            throw new ApiError(
                403,
                "You dont have permission to perform this action!"
            )
        }

        next()

    })
}
