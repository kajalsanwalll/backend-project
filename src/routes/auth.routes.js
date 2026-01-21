import {Router} from "express";
import { registerUser, login, logoutUser} from "../controllers/auth.controllers.js";
import {validate} from "../middlewares/validator.middlewares.js";
import {userRegisterValidator, userLoginValidator} from "../validators/index.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegisterValidator(),validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);


export default router;
