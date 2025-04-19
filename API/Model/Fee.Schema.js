import mongoose from "mongoose";

const feeSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    fullName: {type:String, required:true},
    phone: {type:Number, required:true},
    courseId:  {type:String, required:true},
    uId: {type:String, required:true},
    amount: {type:String, required:true},
    remark: {type:String, required:true},
},{timestamps:true})

export const Fee = mongoose.model("Fee",feeSchema);