"use server"
import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
       await mongoose.connect("mongodb://localhost:27017/imaginaDB",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
       console.log("Connected to database");
    }
    catch(err){
        console.log("connection error: "+ err);
    }
}

export default connectDB;