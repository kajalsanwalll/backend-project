import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.model.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-errors.js";
import mongoose from "mongoose";
import { AvailableTaskStatuses, AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async( req, res) => {
    const {projectId} = req.params;

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(
            404, "project not found!"
        )
    }

    const tasks = await Task.find({
        project: new mongoose.Types.ObjectId("projectId")
    }).populate("assignedTo", "avatar username fullName")

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            tasks,
            "Task fetched successfully!"
        )
     )
})

const createTask = asyncHandler(async( req, res) => {
    const {title, description, assignedTo, status} = req.body;
    const {projectId} = req.params;

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(
            404, "project not found!"
        )
    }
    
    const files = req.files || []

    // now loop through using `map`
    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    const task = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments
    })

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            task,
            "Task created successfully!"
        )
     )

})

const getTaskById = asyncHandler(async( req, res) => {
    const {taskId} = req.params
    const task = await Task.aggregate([

        // first
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },

        //second
        {
            $lookup:{
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        _id: 1,
                        username:1,
                        fullName: 1,
                        avatar: 1
                    }
                ]

            }
        },

        //third
        {
           $lookup:{
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $project:{
                                        _id: 1,
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            createdBy:{
                                arrayElemAt: ["${createdBy}",0]
                            }
                        }
                    }
                ]
            }
        },

        //fourth
        {
            $addFields:{
                assignedTo:{
                    arrayElemAt: ["${assignedTo}", 0]
                }
            }
        }
    ]);

    if(!task || task.length === 0){
        throw new ApiError(
            404, "Task not found!"
        )
    }

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            task[0],
            "Task fetched successfully!"
        )
     )
})

const updateTask = asyncHandler(async( req, res) => {
    
})

const deleteTask = asyncHandler(async( req, res) => {
    
})

const createSubTask = asyncHandler(async( req, res) => {
    
})

const updateSubTask = asyncHandler(async( req, res) => {
    
})

const deleteSubTask = asyncHandler(async( req, res) => {
    
})

export {
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTasks,
    updateSubTask,
    updateTask,
    getTaskById
}