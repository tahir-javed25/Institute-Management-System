import { Router } from "express";
import cloudinary from "cloudinary";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { checkAuth } from "../MiddleWAre/checkAuth.js";
import { Course } from "../Model/Course.Schema.js";
import { Student } from "../Model/Student.Schema.js";



configDotenv();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

// Uploading courses.
export const courseRoute = Router();
// before adding the course we have to verfiy that the user is logged in, if the user is loggen in he will be redirected to the add-course upon add-course route,
courseRoute.post("/add-course",checkAuth,(req,res)=>{
    // console.log(req.body)
    // console.log(req.files)
    // const {name,description,price,category,thumbnail} = req.body;
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, "keep it in .env file");
    // remember onething there must be the name of the image in req.files.image which you have given in the name attribute of the formData.
    cloudinary.uploader.upload(req.files.thumbNail.tempFilePath, (result)=>{
        // console.log(result.secure_url,"and",result.public_id);
        const course = new Course({
            _id: new mongoose.Types.ObjectId,
            courseName: req.body.courseName,
            prise: req.body.prise,    
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            uId: verify.uID,
            thumbNailUrl: result.secure_url,
            thumbNailId: result.public_id,
        });

        course.save()
        .then(result=>{
            res.status(201).json({message:"Course Added Successfully",result})
        })
        .catch(error=>{
            res.status(500).json({message:"Error Occured Why??",error})
        })

    })
    // res.status(200).json({
    //     msg:"Course page here"
    // })
})


// get all courses for a particular/logged in user.

courseRoute.get("/all-courses",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "keep it in .env file");

    Course.find({uId:verify.uID})
    .then(result=>{
        console.log(result);
        res.status(200).json({courses:result})
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


// Now if we want to get a specific course based on the search params
courseRoute.get('/course-detail/:id',checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "keep it in .env file");
// just find only one course which is matched with the given id with findById. Now to find all the students within that course we have to pass the Student Information from Student.Schema.js, it is done after making the student API
    Course.findById({_id:req.params.id})
    .then(result=>{
        Student.find({courseId:req.params.id})
        .then(result1=>{
            res.status(200).json({course:result,studentsList:result1})
        })
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


// Delete a Course from the DB

courseRoute.delete("/:id",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file")

    Course.findById(req.params.id)
    .then(course=>{
        // console.log(course);
        if(course.uId === verify.uID){
            Course.findByIdAndDelete(req.params.id)
            .then(result=>{
                cloudinary.uploader.destroy(course.thumbNailId,(deleted)=>{
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

// update the Course, we have two conditions here one is, when the new Image is uploaded and other is when the old image is used
courseRoute.put("/:id",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file");

    Course.findById(req.params.id)
    .then(course=>{
        // console.log(course);
        if(course.uId !== verify.uID)
            {
                return res.status(400).json({
                    error:"You are not Eligible to update this course"
                })
            }
            if(req.files){
                cloudinary.uploader.destroy(course.thumbNailId,(deleted)=>{
                    cloudinary.uploader.upload(req.files.image.tempFilePath, (result)=>{
                        const newUpdatedCourse = {
                            courseName: req.body.courseName,
                            prise: req.body.prise,
                            description: req.body.description,
                            startDate: req.body.startDate,
                            endDate: req.body.endDate,
                            uId: verify.uID,
                            thumbNailUrl: result.secure_url,
                            thumbNailId: result.public_id,
                        };

                        Course.findByIdAndUpdate(req.params.id,newUpdatedCourse,{new:true})
                        .then(data=>{
                            res.status(200).json({UpdateCourse:data});
                        }).catch(err=>{
                            res.status(500).json({
                                error:err,
                            })
                        })

                })

            })
                console.log("FIles are Available");
                // console.log(req.files);
                
            }else{
                // console.log("No Files are Available");
                const updatedData = {
                    courseName: req.body.courseName,
                    prise: req.body.prise,
                    description: req.body.description,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    uId: verify.uID,
                    thumbNailUrl: course.thumbNailUrl,
                    thumbNailId: course.thumbNailId,
                }

                Course.findByIdAndUpdate(req.params.id,updatedData,{new:true})
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


courseRoute.get("/latest-courses",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file");

    Course.find({uId:verify.uID})
    .sort({$natural:-1}).limit(5)
    .then(data=>{
        res.status(200).json({result:data})
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
})