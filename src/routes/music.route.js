import { Router } from "express";
import { uploadMusic , getMusicById , deleteMusic } from "../controllers/music.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



// Route 

// Secured Route
router.route("/upload").post(verifyJWT, uploadMusic);
router.route("/details").post(verifyJWT, getMusicById);
router.route("/deleteById").post(verifyJWT, deleteMusic);


export default router;
