"use server"
import { signIn } from "next-auth/react"

const submit = async (data) => {
    const username = data.get("username")
    const password = data.get("password")

    if(!user){
      return{success:false,msg:"User not found"}
    }
 
    else{
    try {
        const result = await signIn("credentials", {
          redirect: false, // Set to false to handle response locally
          username,
          password
        });
  
        if (result.error) {
          // Handle login errors (e.g., display error message)
          console.error("Login error:", result.error);
          // You can set an error state in formState for display
        } else {
          // Login successful, handle user redirection or state
          console.log("Login successful:", result);
          // You can redirect to a protected route or update user state
        }
      } catch (error) {
        console.error("Login error:", error);
        // Handle unexpected errors
      }
    }
}

export default submit