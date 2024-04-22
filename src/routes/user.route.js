import { Router } from "express";
import { registerUser, loginUser,logoutUser, getUserById } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************


router.route("/register").post( registerUser);

router.route("/login").post(loginUser);

// Secured Route
router.route("/logout").post(verifyJWT, logoutUser);

router.get("/allDetails",verifyJWT , getUserById)


export default router;
