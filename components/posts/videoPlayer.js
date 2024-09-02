"use client";
import { useRef, useState, useEffect } from "react";

const VideoPlayer = ({
  src,
  isMuted,
  setIsMuted,
  index = 0,
  playStates = [false],
  setPlayStates = () => {},
  isInCarousel = false,
}) => {
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "0px",
      threshold: [0.5],
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && isInCarousel) {
      video.play();
    }
  }, [isInCarousel, videoRef]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      const updatedPlayStates = [...playStates];
      if (video.paused) {
        video.play();
        updatedPlayStates[index] = true;
      } else {
        video.pause();
        updatedPlayStates[index] = false;
      }
      setPlayStates(updatedPlayStates);
    }
    setShowControls((prev) => !prev);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  const handleVolumeChange = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (event) => {
    const video = videoRef.current;
    if (video) {
      const seekTime = (event.target.value / 100) * video.duration;
      video.currentTime = seekTime;
    }
  };

  const handleTimeUpdate = (event) => {
    setCurrentTime(event.target.currentTime);
    setDuration(event.target.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
  };

  const handleMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  return (
    <div
      className="relative h-full w-full flex bg-black rounded-xl justify-center items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="max-h-full max-w-full"
        muted={isMuted}
        autoPlay
        onPlay={() => {
          const updatedPlayStates = [...playStates];
          updatedPlayStates[index] = true;
          setPlayStates(updatedPlayStates);
        }}
        onPause={() => {
          const updatedPlayStates = [...playStates];
          updatedPlayStates[index] = false;
          setPlayStates(updatedPlayStates);
        }}
        onTimeUpdate={handleTimeUpdate}
      />
      {showControls && (
        <>
          <div className="absolute inset-0 flex justify-center items-center">
            <button onClick={togglePlayPause} className="focus:outline-none">
              <img
                className="h-10"
                src={
                  isInCarousel
                    ? playStates[index]
                      ? "icons/pause.png"
                      : "/icons/play.png"
                    : videoRef.current?.paused
                    ? "/icons/play.png"
                    : "/icons/pause.png"
                }
                alt="Play/Pause"
              />
            </button>
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex space-x-4 w-full justify-between p-2">
            <div className="w-[90%]">
              <p className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="w-full"
              />
            </div>
            <button
              onClick={handleVolumeChange}
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl p-2"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
