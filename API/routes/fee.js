import  { Router } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { checkAuth } from "../MiddleWAre/checkAuth.js";
import {Fee} from "../Model/Fee.Schema.js"


export const feeRoute = Router();

feeRoute.get("/",(req,res)=>{
    res.status(200).json({
        msg:"fee page here"
    })
})

feeRoute.post("/add-fee",checkAuth,(req,res)=>{
    console.log(req.body)

     const token = req.headers.authorization.split(" ")[1];
     const verify =jwt.verify(token, "keep it in .env file")

     const fee = new Fee({
       _id: new mongoose.Types.ObjectId,
        uId: verify.uID,
        fullName: req.body.fullName,
        phone: req.body.phone,
        courseId: req.body.courseId,
        amount: req.body.amount,
        remark: req.body.remarks,
     });

     fee.save()
     .then(result=>{
        res.status(201).json({
            msg:"fee saved successfully",
            fee:result,
        })
     }).catch(err=>{
        res.status(500).json({
            msg:"error in saving fee",
            error:err
        })
     })
})
// get all fee collections for a user(Admin)
feeRoute.get("/fee-history",checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file");

    Fee.find({uId:verify.uID})
    .then(result=>{
        res.status(200).json({
            feeHistory:result
        })
    }).catch(error=>{
        res.status(500).json({"Found Error":error})
    })
})

// get all payments for a particular student in a course

feeRoute.get("/all-payments",checkAuth,(req,res)=>{
    console.log(req.query)

    const token = req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token, "keep it in .env file");

    Fee.find({uId:verify.uID,courseId:req.query.courseId,phone:req.query.phone})
    .then(result=>{
        res.status(200).json({
            allFee:result
        })
    }).catch(error=>{
        res.status(500).json({"Found Error":error})
    })
})