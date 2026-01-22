import mongoose, {mongo, Schema} from "mongoose";
import {AvailableUserRole,UserRolesEnum} from "../utils/constants.js";

const projectMemberSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId ,  // getting value from another Schema
        ref: "User",
        required: true
    },
    project:{
        type: Schema.Types.ObjectId ,  // getting value from another Schema
        ref: "Project",
        required: true
    },
    role: {
        type: String,
        enum:AvailableUserRole,
        default: UserRolesEnum.MEMBER
    }


}, {timestamps: true}
);

export const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

