import {Router} from "express";
import {addMembersToProject, createProject,deleteMember,deleteProject,getProjectById,getProjectMembers,getProjects,updateMemberRole,updateProject} from "../controllers/project.controllers.js";
import {validate} from "../middlewares/validator.middlewares.js";
import {createProjectValidator, addMemberToProjectValidator} from "../validators/index.js";
import {verifyJWT, validateProjectPermission} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT)  // required always in project section because bcuz user must be logged in

router
 .route("/")
 .get(getProjects)
 .post(createProjectValidator(), validate, createProject)

router
 .route("/:projectId")
 .get(validateProjectPermission(AvailableUserRole), getProjectById)
 .put(validateProjectPermission([UserRolesEnum.ADMIN]), createProjectValidator(), validate, updateProject)
 .delete(validateProjectPermission([UserRolesEnum.ADMIN]),deleteProject )

router
 .route("/:projectId/members")
 .get(getProjectMembers)
 .post(validateProjectPermission([UserRolesEnum.ADMIN]) , addMemberToProjectValidator(), validate,addMembersToProject) 

router
 .route("/:projectId/members/:userId")
 .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole) 
 .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember)


export default router;