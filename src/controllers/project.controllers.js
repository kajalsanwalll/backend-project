import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-errors.js";

const getProjects = asyncHandler(async(req, res) => {

})

const getProjectById = asyncHandler(async(req, res) => {
    
})

const createProject = asyncHandler(async(req, res) => {
    
})

const updateProject = asyncHandler(async(req, res) => {
    
})

const deleteProject = asyncHandler(async(req, res) => {
    
})

const addMembersToProject = asyncHandler(async(req, res) => {
    
})

const getProjectMembers = asyncHandler(async(req, res) => {
    
})

const updateMemberRole = asyncHandler(async(req, res) => {
    
})

const deleteMember = asyncHandler(async(req, res) => {
    
})


export {
    addMembersToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject
};
