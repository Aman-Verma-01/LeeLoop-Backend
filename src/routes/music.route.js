import { Router } from "express";
import { uploadMusic , getMusicById } from "../controllers/music.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



// Route 

// Secured Route
router.route("/upload").post(verifyJWT, uploadMusic);
router.route("/details").get(verifyJWT, getMusicById);


export default router;
