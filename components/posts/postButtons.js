"use client";
import Image from "next/image";
import { updateLikes } from "@/actions/export";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

// Helper function to format large numbers
const formatNumber = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + "k";
  } else {
    return number.toString();
  }
};

const PostButtons = ({ post, setPosts }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [likes, setLikes] = useState(post.likedby.length);
  const [likedBy, setLikedBy] = useState(post.likedby);
  const [commentNum] = useState(post.comments.length);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef(null); // Ref for the comment input container

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentInputRef.current && !commentInputRef.current.contains(event.target)) {
        setShowCommentInput(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentInputRef]);

  const handleLike = (postId) => {
    if (!user) return;

    setPosts(prevPosts => {
      return prevPosts.map(p => {
        if (p.id === postId) {
          const like = !p.liked;
          updateLikes(like, postId, user.username);

          if (like) {
            setLikes(likes + 1);
            setLikedBy(prev => [user.username, ...prev.filter(username => username !== user.username)]);
          } else {
            setLikes(likes - 1);
            setLikedBy(prev => prev.filter(username => username !== user.username));
          }

          return {
            ...p,
            liked: like
          };
        }
        return p;
      });
    });
  };

  const handleComment = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleShare = (postId) => {
    console.log(`Shared post with id ${postId}`);
  };

  const renderLikedBy = () => {
    if (user && likedBy.includes(user.username)) {
      if (likedBy.length > 10) {
        return `you and ${formatNumber(likedBy.length - 1)} others`;
      } else {
        return `you${likedBy.filter(username => username !== user.username).map(username => `, ${username}`)}`;
      }
    } else {
      if (likedBy.length > 10) {
        return `${formatNumber(likedBy.length)} likes`;
      } else {
        return likedBy.join(', ');
      }
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    setPosts(prevPosts => {
      return prevPosts.map(p => {
        if (p.id === post.id) {
          const newCommentObj = {
            username: user.username,
            text: newComment,
          };
          return { ...p, comments: [...p.comments, newCommentObj] };
        }
        return p;
      });
    });

    setNewComment("");
    setShowCommentInput(false);
  };

  return (
    <>
      {/* Buttons for Like, Comment, and Share */}
      <div className="flex justify-start items-center space-x-10 mt-4">
        <div className="relative">
          <div className="flex space-x-4 items-center">
            <button
              onClick={() => handleLike(post.id)}
              className={`relative transition-opacity duration-300 ease-in-out group focus:outline-none`}
            >
              <Image
                src={post.liked ? "/icons/active.png" : "/icons/default.png"}
                alt="Like"
                className="w-8 h-8"
                width={32}
                height={32}
              />
            </button>
            <span className="text-sm">{formatNumber(likes)}</span>
          </div>

          <div className="text-xs w-24 absolute -bottom-6">
            {renderLikedBy()}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={handleComment} className="transition-opacity duration-300 ease-in-out">
            <Image
              src="/icons/coment.png"
              alt="Comment"
              className="w-8 h-8"
              width={32}
              height={32}
            />
          </button>
          <span>{formatNumber(commentNum)}</span>
        </div>

        <div>
          <button onClick={() => handleShare(post.id)} className="transition-opacity duration-300 ease-in-out">
            <Image
              src="/icons/share.png"
              alt="Share"
              className="w-8 h-8"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>

      {/* Comment input field */}
      {showCommentInput && (
        <div ref={commentInputRef} className="mt-10">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border border-gray-300 text-black rounded focus:outline-none focus:border-indigo-500"
            placeholder="Add a comment..."
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
};

export default PostButtons;
