import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    courseName: {type:String, required:true},
    prise: {type:Number, required:true},
    description: {type:String, required:true},
    startDate: {type:Date, required:true},
    endDate: {type:Date, required:true},
    thumbNailUrl: {type:String, required:true},
    thumbNailId: {type:String, required:true},
    uId: {type:String, required:true},
})

export const Course = mongoose.model("Course",courseSchema);