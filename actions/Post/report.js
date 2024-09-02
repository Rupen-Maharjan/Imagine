"use server";
import { ReportMod } from "@/models/export"; // Correct path to your model

const Report = async (data, postId, userId) => {
  try {
    // Finding the post in the report
    const found = await ReportMod.findOne({ postId });
    if (found) {
      // Checking if the user already reported the post
      const userReported = found.users.some(user => user.userId === userId);
      if (userReported) {
        return { success: false, message: "User has already reported this post." };
      }
      // Add the new report to the existing post
      found.users.push({
        userId,
        Type: data.reports,
        Message: data.message,
      });
      await found.save();
      return { success: true, message: "Report added to existing post." };
    } else {
      // Create a new report if the post was not found
      const newReport = new ReportMod({
        postId,
        users: [{
          userId,
          Type: data.reports || [],
          Message: data.message || [],
        }],
      });
      await newReport.save();
      return { success: true, message: "Report created for new post." };
    }
  } catch (error) {
    console.error("Error reporting post:", error);
    return { success: false, message: "An error occurred while reporting the post." };
  }
};

export default Report;
