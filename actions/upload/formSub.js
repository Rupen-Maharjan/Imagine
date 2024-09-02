"use server"
import { PostMod, UsrMod } from "@/models/export"
import { v4 as uuid } from 'uuid'

const formSub = async (data, userId) => {
    const text = await data.get("text")
    const user = await UsrMod.findOne({ id: userId })
    const { username } = user
    const id= uuid();
    
    try {
        const post = new PostMod({ id, userId, username, data: text })
        await post.save()
        
        if (post.userId === user.id) {
            await UsrMod.findOneAndUpdate(
                { id: post.userId },
                { $push: { posts: {postId:id,data:text} } }
            )
        }
        
        return { success: true, post }
    } catch (err) {
        console.log("Database error: " + err)
        return { success: false, error: err }
    }
}

export default formSub
