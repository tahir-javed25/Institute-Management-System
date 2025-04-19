import { Router } from "express";
import cloudinary from "cloudinary";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { checkAuth } from "../MiddleWAre/checkAuth.js";
import { Course } from "../Model/Course.Schema.js";
import { Student } from "../Model/Student.Schema.js";
import { Fee } from "../Model/Fee.Schema.js";

configDotenv();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


export const studentRoute = Router();

studentRoute.get("/",(req,res)=>{
    res.status(200).json({
        msg:"student page here"
    })
})


studentRoute.post("/add-student",checkAuth,(req,res)=>{
    // console.log(req.body)
    // const {name,description,price,category,thumbnail} = req.body;
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, "keep it in .env file");

    cloudinary.uploader.upload(req.files.image.tempFilePath, (result)=>{
        // console.log(result.secure_url,"and",result.public_id);
        const student = new Student({
            _id: new mongoose.Types.ObjectId,
            fullName:req.body.fullName,
            email:req.body.email,
            address:req.body.address,
            phone:req.body.phone,
            stdImgUrl: result.secure_url,
            stdImgId: result.public_id,
            courseId:req.body.courseId,
            uId: verify.uID,
        });

        student.save()
        .then(result=>{
            console.log(result)
            res.status(201).json({message:"Student Added Successfully",result})
        })
        .catch(error=>{
            res.status(500).json({message:"Error Occured",error})
        })

    })
    // res.status(200).json({
    //     msg:"Course page here"
    // })
})


// Get all Students

studentRoute.get("/all-students",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "keep it in .env file");

    Student.find({uId:verify.uID})
    .then(result=>{
        console.log(result);
        res.status(200).json({students:result})
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

// Students from a particular Course
studentRoute.get("/get-student/:id",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "keep it in .env file");

    Student.find({uId:verify.uID,courseId:req.params.id})
    .then(result=>{
        console.log(result);
        res.status(200).json({students:result})
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})
// Newly aded
studentRoute.get("/student-details/:id",checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "keep it in .env file");

    Student.findById({ _id:req.params.id})
    .then(result=>{
        // Fee.find({uId:verify.uID, phone:result.phone})
        Fee.find({uId:verify.uID, courseId:result.courseId,phone:result.phone})
        .then(fee=>{
            Course.findById(result.courseId)
            .then(courseData=>{
                res.status(200).json({studentResult:result,feeResult:fee,courseDetails:courseData})
            }).catch(
                error=>{res.status(500).json({
                    msg:"Result Not found",
                    err:error
                })})
        }).catch(
            error=>{res.status(500).json({
                msg:"Result Not found",
                err:error
            })})
    }).catch(
        error=>{res.status(500).json({
            msg:"Result Not found",
            err:error})}
    )
})


// Delete the Student
// this :id is the id of Student, but the confusion is that if we have give the uID or courseId then? We are getting it from req.params
studentRoute.delete("/:id",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file")

    Course.findById(req.params.id)
    .then(student=>{
        // console.log(course);
        if(student.uId === verify.uID){
            Student.findByIdAndDelete(req.params.id)
            .then(result=>{
                cloudinary.uploader.destroy(Student.stfImgId,(deleted)=>{
                    console.log(deleted)
                    res.status(200).json({
                        message:result,
                    })
                })
            })
        }else{
            return res.status(400).json({
                error:"You can't delete this course"
            })
        }
    })
    .catch(err=>{
        return res.status(500).json({
            error:err
        })
    })
})



// Updating the student

studentRoute.put("/:id",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file");

    Student.findById(req.params.id)
    .then(student=>{
        // console.log(course);
        if(student.uId !== verify.uID)
            {
                return res.status(400).json({
                    error:"You are not Eligible to update this course"
                })
            }
            if(req.files){
                cloudinary.uploader.destroy(student.stdImgId,(deleted)=>{
                    cloudinary.uploader.upload(req.files.image.tempFilePath, (result)=>{
                        const newUpdatedStudent = {
                            fullName: req.body.fullName,
                            email: req.body.email,
                            phone: req.body.phone,
                            address: req.body.address,
                            courseId: req.body.courseId,
                            uId: verify.uID,
                            stdImgUrl: result.secure_url,
                            stdImgId: result.public_id,
                        };

                        Student.findByIdAndUpdate(req.params.id,newUpdatedStudent,{new:true})
                        .then(data=>{
                            res.status(200).json({UpdatedStudent:data});
                        }).catch(err=>{
                            res.status(500).json({
                                error:err,
                            })
                        })

                })

            })
                // console.log("FIles are Available");
                // console.log(req.files);
                
            }else{
                // console.log("No Files are Available");
                const updatedData = {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    courseId: req.body.courseId,
                    uId: verify.uID,
                    stdImgUrl: student.stdImgUrl,
                    stdImgId: student.stdImgId,
                }

                Student.findByIdAndUpdate(req.params.id,updatedData,{new:true})
                .then(data=>{
                    res.status(200).json({result:data});
                }).catch(err=>{
                    res.status(500).json({
                        error:err,
                    })
                })
            }
    })
    .catch(err=>{
        return res.status(500).json({
            error:err
        })
    })
})

studentRoute.get("/latest-students",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file");

    Student.find({uId:verify.uID})
    .sort({$natural:-1}).limit(5)
    .then(data=>{
        res.status(200).json({result:data})
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
})