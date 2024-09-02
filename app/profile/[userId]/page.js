// components/Profile.js
"use client";
import { motion } from "framer-motion";
import { UserInfoCard, UserPosts } from "@/components/export";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { CurrentUser } from "@/functions/export";

const Profile = () => {
  const { data: session } = useSession();
  if (!session) {
    redirect("/");
  }

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = async () => {
      const usrData = await CurrentUser(session.user.id);
      setUserData(usrData);
    };
    data();
  }, [session]);

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: "-100vw" },
    hide:{opacity:0,x:"100vw"},
    visible: { opacity: 1, x: 0 },
    fadeIn: { opacity: 1,x:0 },
  };

  return (
    <main className="flex justify-center items-center h-full w-full overflow-y-scroll scrollbar-hide">
      <div className=" md:w-full flex flex-col items-center justify-between lg:justify-normal space-y-24">
        {/* UserInfoCard with slide-in animation */}
        <motion.div
          className="w-[80%] lg:w-[50%] lg:mt-10"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", stiffness: 50, damping: 10, duration: 0.5 }}
        >
          <UserInfoCard user={session.user.id} />
        </motion.div>

        {/* UserPosts with fade-in animation, delayed until UserInfoCard animation ends */}
        <div
          className="w-full grid"
        >
          <motion.h1 variants={variants}
          initial="hide"
          animate="fadeIn"
          transition={{ type: "spring", stiffness: 50, damping: 10, duration: 0.5 }} className="text-center text-3xl lg:text-6xl font-bold mb-10">Posts</motion.h1>
          <UserPosts />
        </div>
      </div>
    </main>
  );
};

export default Profile;
