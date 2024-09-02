"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getAllPosts, formatImagePath } from "@/functions/export";
import Carousel from "../posts/carousel";
import PostButtons from "../posts/postButtons";
import { useSession } from "next-auth/react";
import VideoPlayer from "../posts/videoPlayer";
import DropdownButton from "../comon/dropdown";
import { CapDelete, CapEdit } from "@/actions/export";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const [editMode, setEditMode] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [newComment, setNewComment] = useState("");
  const editInputRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [playStates, setPlayStates] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      const postsWithLikes = data.map((post) => ({
        ...post,
        liked: post.likedby.includes(session.user.username),
      }));
      setPosts(postsWithLikes);
      setPlayStates(new Array(data.length).fill(false));
    };
    fetchPosts();
  }, [session.user.username]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editInputRef.current && !editInputRef.current.contains(event.target)) {
        setEditMode(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editInputRef]);

  const handleEdit = async (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    if (postToEdit) {
      setEditMode(postId);
      setNewCaption(postToEdit.caption);
    }
  };

  const saveCaption = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        CapEdit(postId, newCaption);
        return { ...post, caption: newCaption };
      }
      return post;
    });
    setPosts(updatedPosts);
    setEditMode(null);
  };

  const toggleComments = (postId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleCommentSubmit = (postId) => {
    if (!newComment.trim()) return;

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newCommentObj = {
          username: session.user.username,
          text: newComment,
        };
        return { ...post, comments: [...post.comments, newCommentObj] };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewComment("");
    setShowCommentInput((prevState) => ({
      ...prevState,
      [postId]: false,
    }));
  };

  const handleDelete = async (postId) => {
    await CapDelete(postId, session.user.id);
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  return (
    <div className="py-3 lg:p-4 w-full">
      {posts.map((post, index) => (
        <div key={index} className="relative mb-10">
          <div className={`flex mb-2 justify-between h-10 items-center relative`}>
            <h3 className="text-lg tracking-wider font-bold">{post.username}</h3>
            <div>
              <DropdownButton
                post={post}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          </div>

          {editMode === post.id ? (
            <div ref={editInputRef} className="flex items-center mb-2 px-2 justify-between">
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="bg-transparent mb-2 w-[70%] focus:outline-none"
                placeholder=" Edit caption"
              />
              <button onClick={() => saveCaption(post.id)} className="ml-2">
                Edit
              </button>
            </div>
          ) : (
            post.caption && <p className="text-gray-400 mb-2">{post.caption}</p>
          )}

          {Array.isArray(post.data) && post.data.length > 1 ? (
            <Carousel images={post.data} />
          ) : Array.isArray(post.data) && post.data.length === 1 ? (
            <div className=" h-[25rem] lg:h-[30rem] w-full flex justify-center items-center">
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
                  width={400}
                  height={200}
                  alt=""
                  src={formatImagePath(post.data[0])}
                  className="h-full w-full object-cover rounded-xl"
                />
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-xl">{post.data}</h1>
            </div>
          )}

          <PostButtons
            post={post}
            setPosts={setPosts}
            posts={posts}
            setIsMuted={setIsMuted}
            isMuted={isMuted}
            setPlayStates={setPlayStates}
            playStates={playStates}
            toggleComments={toggleComments}
            toggleCommentInput={toggleCommentInput}
            handleCommentSubmit={handleCommentSubmit}
            newComment={newComment}
            setNewComment={setNewComment}
            expandedComments={expandedComments}
            showCommentInput={showCommentInput}
          />
        </div>
      ))}
    </div>
  );
};

export default Posts;
