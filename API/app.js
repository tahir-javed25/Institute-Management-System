import express from "express";
import mongoose, { Mongoose } from "mongoose";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors"

import { courseRoute } from "./routes/course.js";
import { feeRoute } from "./routes/fee.js";
import { userRoute } from "./routes/user.js";
import { studentRoute } from "./routes/student.js";


mongoose.connect("mongodb+srv://institueManagement:1234@cluster0.kiwqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(console.log("Database Connected"))
.catch(err=>{
    console.log(err);
})



export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use("/user", userRoute);
app.use("/student", studentRoute);
app.use("/fee", feeRoute);
app.use("/course", courseRoute);

// incase of 404 error 
app.use("*", (req,res)=>{
    res.status(404).json({message: "Route not found"})
})

// const router = app.route();


