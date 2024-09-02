"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllPosts, formatImagePath } from "@/functions/export";
import Carousel from "./carousel";
import { useSession } from "next-auth/react";
import VideoPlayer from "../posts/videoPlayer";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePosts = () => {
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const [isMuted, setIsMuted] = useState(false);
  const [playStates, setPlayStates] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      const userPosts = data.filter(
        (post) => post.username === session.user.username && typeof post.data !== "string"
      );

      const postsWithLikes = userPosts.map((post) => ({
        ...post,
        liked: post.likedby.includes(session.user.username),
      }));

      setPosts(postsWithLikes);
      setPlayStates(new Array(userPosts.length).fill(false));
      setVisiblePosts(new Array(userPosts.length).fill(false)); // Initialize visiblePosts here
    };

    fetchPosts();
  }, [session.user.username]);

  useEffect(() => {
    const observers = [];

    const observePost = (postIndex) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisiblePosts((prev) => {
              const newVisiblePosts = [...prev];
              newVisiblePosts[postIndex] = true;
              return newVisiblePosts;
            });
            observer.unobserve(entry.target); // Stop observing once visible
          }
        },
        { threshold: 0.1 } // Trigger when 10% of the post is visible
      );

      observers.push(observer);
      return observer;
    };

    const postElements = document.querySelectorAll(".post-item");
    postElements.forEach((postElement, index) => {
      const observer = observePost(index);
      observer.observe(postElement);
    });

    return () => observers.forEach((observer) => observer.disconnect()); // Cleanup observers
  }, [posts]);

  // Variants for animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid grid-cols-3 w-full overflow-hidden gap-x-4">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={index}
            className="relative lg:mb-14 h-32 w-32 md:mx-auto lg:h-96 lg:w-96 post-item"
            initial="hidden"
            animate={visiblePosts[index] ? "visible" : "hidden"}
            exit="hidden"
            variants={itemVariants}
            transition={{ duration: 0.5, delay: index * 0.2 }} // Staggered delay
          >
            {Array.isArray(post.data) && post.data.length > 1 ? (
              <Carousel images={post.data} height="100%" />
            ) : Array.isArray(post.data) && post.data.length === 1 ? (
              <div className="h-full w-full flex justify-center items-center">
                {post.data[0].endsWith("mp4") ? (
                  <VideoPlayer
                    src={formatImagePath(post.data[0])}
                    initialMuted={isMuted}
                    isPlaying={playStates[index] || false}
                    onPlay={() => {
                      const newPlayStates = [...playStates];
                      newPlayStates[index] = true;
                      setPlayStates(newPlayStates);
                    }}
                    onPause={() => {
                      const newPlayStates = [...playStates];
                      newPlayStates[index] = false;
                      setPlayStates(newPlayStates);
                    }}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                  />
                ) : (
                  <Image
                    width={200}
                    height={200}
                    alt=""
                    src={formatImagePath(post.data[0])}
                    className="h-full w-full object-cover rounded-xl"
                  />
                )}
              </div>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePosts;
