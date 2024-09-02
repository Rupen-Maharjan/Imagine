"use server";
import { PostMod, UsrMod } from "@/models/export";

const getAllPosts = async () => {
    try {
        // Fetch all posts and sort them by createdDate in descending order
        const posts = await PostMod.find({}).sort({ createdAt: -1 }).lean();

        // Fetch all users to match userId with username (not used in your current mapping)
        const users = await UsrMod.find({});

        if (posts.length > 0) {
            const result = posts.map(post => {
                return {
                    username: post.username,
                    id: post.id,
                    userId: post.userId,
                    data: post.data, // Assuming post.data is a simple JSON-serializable field like an array of image paths
                    caption: post.caption,
                    likedby: post.likedby,
                    comments: post.comments
                };
            });

            return result;
        } else {
            console.log("No posts found");
            return [];
        }
    } catch (err) {
        console.log("Error fetching posts:", err);
        throw err; // Propagate the error for handling in the caller
    }
};

export default getAllPosts;
