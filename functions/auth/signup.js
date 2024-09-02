"use server"
import { UsrMod } from "@/models/export"
import bcrypt from "bcrypt"
import {v4 as uuid} from 'uuid'

const signup = async(data) => {
    const firstName = data.get("fName")
    const lastName = data.get("lName")
    const username = data.get("username")
    const password = data.get("password")
    const email = data.get("email")
    const profilePic =data.get("profilePic");
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password,salt)

    const existingUser = await UsrMod.findOne({  username  });

    if(profilePic && profilePic.name!="undefined"){
        console.log(profilePic.name);
    }

    else{
        console.log("no pp so default will be set");
    }
    

if (existingUser) {
  const message = "Username already taken";
  return { success: false, msg: message };
}
    else {
    try{
        const create = new UsrMod({id:uuid(),firstName,lastName,username,email,password:hashed})
        await create.save();
        return{success:true};
    }
    catch(Er){
        console.log(Er);
    }
}
} 

export default signup;