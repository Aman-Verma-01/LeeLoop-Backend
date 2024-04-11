import dotenv from 'dotenv'
import {connectDB} from './db/index.js'
import {app} from './app.js'


dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server running at ${port}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB Connection Failed :: " + err);
})

