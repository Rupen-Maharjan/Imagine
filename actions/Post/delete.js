"use server"
import { PostMod, UsrMod } from "@/models/export"
import fs from "fs"

const Delete = async (postId, userId) => {
  if (userId) {
    try {
      // Delete the post from PostMod
      await PostMod.findOneAndDelete({ id: postId });

      // Remove the post from UsrMod's posts array
      await UsrMod.findOneAndUpdate(
        { id: userId }, // Find the user by userId
        { $pull: { posts: { postId: postId } } } // Remove the post with the matching postId
      );

      console.log(`Post with id ${postId} deleted successfully.`);
    } catch (err) {
      console.log("Post delete error = " + err);
    }
  } else {
    console.log("You don't have access.");
  }
}

export default Delete;
