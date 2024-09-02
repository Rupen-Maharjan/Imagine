"use server"
import mongoose from "mongoose";

const usrSchema = new mongoose.Schema({
    id:String,
    firstName:String,
    lastName:String,
    username:String,
    email:String,
    password: String,
    profilePic:{
        type:String,
        default:""
    },
    posts:Array,
    followers:Array,
    following:Array
},{timestamps:true})
const model = mongoose.models.users || mongoose.model("users",usrSchema);
export default model;

