"use server";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    id:String,
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required:true,
    },
    caption:String,
    data: {
        type: mongoose.Schema.Types.Mixed,
        validate: {
            validator: function(value) {
                return typeof value === 'string' || Array.isArray(value);
            },
            message: props => `${props.value} is not a valid data type!`
        },
        required: true
    },
    likedby:Array,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

const PostModel = mongoose.models.Post || mongoose.model("Post", postSchema);
export default PostModel;
