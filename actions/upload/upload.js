"use server"
import { writeFile, access, mkdir } from 'fs/promises'
import { v4 as uuid } from 'uuid'
import { NextResponse } from 'next/server'
import { PostMod, UsrMod } from '@/models/export'

// Function to sanitize filenames
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9._\s-]/g, '-') // Replace any character that's not a letter, number, dot, underscore, hyphen, or space with a hyphen
    .trim(); // Trim any leading or trailing whitespace
}

const upload = async (data, userId) => {
  const files = await data.getAll("media")
  const caption = await data.get("caption")
  const user = await UsrMod.findOne({ id: userId })
  const { username } = user
  const pathAr = []

  try {
    await access('./public/uploads')
  }
  catch (err) {
    if (err.code === 'ENOENT') { // ENOENT means directory doesn't exist
      // Create the directory
      await mkdir('./public/uploads', { recursive: true });
    } else {
      // Handle other potential errors here (e.g., permission issues)
      console.error('Unexpected error:', err);
      return NextResponse.json({ msg: "Failed to create directory" }, { status: 500 });
    }
  }

  try {
    for (const file of files) {
      if (file.name !== "undefined") {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Sanitize the filename
        const cleanName = sanitizeFilename(file.name);
        const filename = Date.now() + cleanName;
        const path = `./public/uploads/${filename}`;
        await writeFile(path, buffer);
        pathAr.push(path);
      }
    }
    if (pathAr.length !== 0) {
      const id = uuid();
      if(user.id===userId){
        await UsrMod.findOneAndUpdate({id:userId},{$push:{posts:{postId:id,data:pathAr}}});
      }
      if (files && !caption) {
        const upload = await PostMod({ id, userId, username, data: pathAr })
        await upload.save();
      }
      else if (files && caption) {
        const upload = await PostMod({ id, userId, username, caption, data: pathAr })
        await upload.save();
      }
    }
  }
  catch (err) {
    console.log("couldn't upload files " + err);
  }
}

export default upload
