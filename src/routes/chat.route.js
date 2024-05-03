import { Router } from "express";
import {chatLogin,chatSignup} from "../controllers/chat.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();




// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************


router.post("/login", verifyJWT,chatLogin)
router.post("/signup", verifyJWT,chatSignup)









export default router;
