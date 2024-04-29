import { Router } from "express";
import {chatCall} from "../controllers/chat.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();




// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************


router.get("/", verifyJWT,chatCall)









export default router;
