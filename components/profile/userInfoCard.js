"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CurrentUser } from "@/functions/export";
import formatImagePath from "@/functions/export";
import { useRouter } from "next/navigation";

const UserInfoCard = ({ user}) => {
  const [userImg, setUserImg] = useState("/icons/user.png");
  const [userdata, setUserData] = useState({});
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      const res = await CurrentUser(user);
      if (res) {
        if (res.profilePic) {
          setUserImg(formatImagePath(res.profilePic));
        }
        const { firstName, lastName, username,posts,followers,following } = res;
        
        setUserData({
          firstName,
          lastName,
          username,
          posts:posts.length,
          followers:followers.length,
          following:following.length
        });
      }
    };

    fetchUserData();
  }, [session, user, router]);

  return (
    <div className="relative">
      <div className="text-center w-full flex justify-between">
        <div className="relative flex items-center justify-center">
          <Image
            src={userImg}
            className="rounded-full object-cover object-center h-10 w-10 lg:h-24 lg:w-24"
            height={20}
            width={20}
            alt="Profile"
          />
        </div>
        <div className="py-2 items-center justify-between">
          <div className="my-auto">
            {userdata&&<h3 className="font-bold text-lg lg:text-2xl text-gray-800 dark:text-white">
              {userdata.username}
            </h3>}
            <p className="text-slate-500">Bio</p>
          </div>
          <div className="space-x-5 text-sm">
            <span>{userdata.posts} Posts</span>
            <span>{userdata.followers} Followers</span>
            <span>{userdata.following} Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
