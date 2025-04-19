import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    fullName: {type:String, required:true},
    email: {type:String, required:true},
    phone: {type:Number, required:true},
    password: {type:String, required:true},
    imageUrl: {type:String, required:true},
    imageID: {type:String, required:true}
})

export const User = mongoose.model("User",userSchema);