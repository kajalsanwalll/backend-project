import {body} from "express-validator";
import {AvailableUserRole} from "../utils/constants.js";

const userRegisterValidator = () => {
    return [
        body("email")
           .trim()
           .notEmpty()
           .withMessage("Email is required")
           .isEmail()
           .withMessage("Email invalid"),
        body("username")
           .trim()
           .notEmpty()
           .withMessage("username is required")
           .isLowercase()
           .withMessage("username must be in lowercase!")
           .isLength({min: 3})
           .withMessage("username must be 3 characters long"),
        body("password")
           .trim()   
           .notEmpty()
           .withMessage("password required"),
        body("fullName")
           .optional()
           .trim()
              



    ]
}

const userLoginValidator = () => {
   return [
      body("email")
       .optional()
       .isEmail()
       .withMessage("Email is invalid!"),
      body("password")
       .notEmpty()
       .withMessage("password field can't be empty!")
   ];
};

const userChangeCurrentPasswordValidator = () => {
   return [
      body("oldPassword")
       .notEmpty()
       .withMessage("Old password is required!"),
      body("newPassword")
       .notEmpty()
       .withMessage("new password field should not be empty!") 
   ]
}

const userForgotPasswordValidator = () => {
   return [
      body("email")
       .notEmpty()
       .withMessage("Email is required!")
       .isEmail()
       .withMessage("This field should be an email!")

   ]
}

const userResetForgotPasswordValidator = () => {
   return [
      body("newPassword")
       .notEmpty()
       .withMessage("New password is required!")
   ]
}

const createProjectValidator = () => {
   return [
      body("name")
       .notEmpty()
       .withMessage("name is required"),
      body("description")
       .optional() 
   ]
}

const addMemberToProjectValidator = () => {
   return [
      body("email")
       .trim()
       .notEmpty()
       .withMessage("email is required")
       .isEmail()
       .withMessage("email is invalid"),
      body("role")
       .notEmpty() 
       .withMessage("Role is required!")
       .isIn(AvailableUserRole)
       .withMessage("Role is invalid!")
   ]
}

export {
   userRegisterValidator, 
   userLoginValidator, 
   userChangeCurrentPasswordValidator,
   userForgotPasswordValidator,
   userResetForgotPasswordValidator,
   createProjectValidator,
   addMemberToProjectValidator
};