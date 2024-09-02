"use server"
import { PostMod } from "@/models/export"

const edit = async(postId,caption) => {
    await PostMod.findOneAndUpdate({id:postId},{caption})
}

export default edit