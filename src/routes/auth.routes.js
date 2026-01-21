import {Router} from "express";
import { registerUser, login, logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changeCurrentPassword, resendEmailVerification} from "../controllers/auth.controllers.js";
import {validate} from "../middlewares/validator.middlewares.js";
import {userRegisterValidator, userLoginValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator} from "../validators/index.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

// unsecured routes : dont require jwt verification
router.route("/register").post(userRegisterValidator(),validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router.route("/reset-Password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

//secured routes ( when user is logged in, i.e. has tokens!)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);


export default router;
