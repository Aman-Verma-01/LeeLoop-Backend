
import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

import dotenv from 'dotenv'
dotenv.config()

// routes setup
import userRouter from "./routes/user.route.js"
import musicRouter from "./routes/music.route.js"
import adminRouter from "./routes/admin.route.js"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16Kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)




//route declaration
app.use("/api/v1/user" , userRouter);
app.use("/api/v1/music" , musicRouter);



// route for admin
app.use("/api/v1/admin" , adminRouter);


export {app}