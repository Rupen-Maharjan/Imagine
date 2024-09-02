"use server"
import { PostMod } from "@/models/export"


const updateLikes = async(liked,postId,username)=>{
if(liked){
    await PostMod.updateOne({id:postId},{$inc:{likes:1},$push:{likedby:username}})
}
else {
    await PostMod.updateOne({id:postId},{$inc:{likes:-1},$pull:{likedby:username}})
}
}

export default updateLikes;