import { Router } from "express";
import cloudinary from "cloudinary";
import { configDotenv } from "dotenv";
import { User } from "../Model/User.Schema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRoute = Router();
configDotenv();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})



userRoute.post("/signup",(req,res)=>{
    console.log(req.body,req.files.image);
    User.find({email:req.body.email})
    .then((users)=>{
        if(users.length>0){
            return res.status(500).json({
                error:"Email already exist"
            })
        }else{
        if(req.files.image){
        //we got this "result" in result/response when we uploaded the photo to the cloudinary,
        cloudinary.uploader.upload(req.files.image.tempFilePath, (result) => {
            // console.log("image result is",result)
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error: "Error while hashing password", 
                    })
                }
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    fullName: req.body.fullName,
                    email: req.body.email,
                    phone: req.body.phone,
                    // password: req.body.password,
                    password: hash,
                    imageUrl: result.secure_url,
                    imageID: result.public_id
                });
        
                newUser.save().
                then(result=>{
                    res.status(200).json({student:result})
                })
                .catch(error=>{res.status(500).json({msg:error})});
            })
           
        })}}
    })
})


userRoute.post("/login",(req,res)=>{
    console.log(req.body)
   User.find({email:req.body.email})
   .then(user =>{
    // console.log(user)
    if(user.length == 0){
        return res.status(500).json({
            message:"Email is not registered"
        })}
// here this user[0] means the firs t item from the user array which we are getting in user, the result of the .find method
    bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
        if(!result){ 
            return res.status(500).json({
                message:"Invalid password....",
            })
        }
            // jwt token
            const token = jwt.sign({
                email:user[0].email,
                fullName:user[0].fullName,
                uID:user[0]._id 
            },
            "keep it in .env file",
            {expiresIn:"365d"});

           return res.status(200).json({
                message:"Login Successfull",
                _id:user[0]._id,
                email:user[0].email,
                fullName:user[0].fullName,
                imageUrl:user[0].imageUrl,
                imageId:user[0].imageID,
                token:token,
            })
        })

    })
})
