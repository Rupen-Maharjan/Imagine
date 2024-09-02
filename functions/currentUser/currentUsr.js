"use server"
import { UsrMod } from "@/models/export"

const CurrentUser = async(userId)=>{
    const currentUsr = await UsrMod.findOne({id:userId}).lean();
    return currentUsr;
}

export default CurrentUser;