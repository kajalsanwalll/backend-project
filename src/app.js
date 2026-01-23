// just for express code 

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


// basic configurations MIDDLEWARES 
app.use(express.json({limit: "16kb"}))   // CORS Error handling 
app.use(express.urlencoded({extended: true, limit: "16kb"}))   // encoded url transfer
app.use(express.static("public"))

//handling cookie using cookieParser
app.use(cookieParser());

/*
CORS (Cross origin resource sharing) is a Nodejs package for providing a 
Connect/Express middleware that can be used to enable CORS with various options.
  npm install cors  
*/

// cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// importing the routes 
import healthcheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);


app.get("/",(req,res)=> {
    res.send("Welcome to the Project!")
})
export default app;