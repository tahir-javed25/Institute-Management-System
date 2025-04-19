import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    fullName: {type:String, required:true},
    email: {type:String, required:true},
    address: {type:String, required:true},
    phone: {type:Number, required:true},
    stdImgUrl: {type:String, required:true},
    stdImgId: {type:String, required:true},
    courseId:  {type:String, required:true},
    uId: {type:String, required:true},
},{timestamps:true})

export const Student = mongoose.model("Student",studentSchema);