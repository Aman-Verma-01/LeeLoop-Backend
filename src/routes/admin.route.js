import { Router } from "express";
import { getAllUser, getUserById } from "../controllers/user.controller.js";
import { uploadMusic , getMusicById, getAllMusic } from "../controllers/music.controller.js";


import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();




// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************


router.get("/allUsers", getAllUser)
router.get("/user", getUserById)
router.get("/allMusic", getAllMusic)
router.get("/music", getMusicById)








export default router;
