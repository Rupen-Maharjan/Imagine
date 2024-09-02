"use client";
import Image from "next/image";
import { formatImagePath } from "@/functions/export";
import { useState, useRef } from "react";
import VideoPlayer from "../posts/videoPlayer";

const Carousel = ({ images, height = "30rem" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [playStates, setPlayStates] = useState(
    Array(images.length).fill(true)
  );

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowButtons(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowButtons(false);
    }, 1000); // 1 second delay before hiding the buttons
  };

  return (
    <div
      className="relative bg-black overflow-hidden w-full rounded-xl"
      ref={containerRef}
      style={{ height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={prevSlide}
        style={{
          opacity: showButtons && currentIndex !== 0 ? 0.7 : 0,
          visibility: currentIndex !== 0 ? "visible" : "hidden",
          transition: "opacity 0.3s ease",
        }}
        className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 text-white lg:p-2 bg-gray-800 hover:bg-gray-900 font-medium rounded-xl text-xl px-3 lg:px-5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        ‹
      </button>

      <div
        className="flex items-center h-full transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full flex">
            {image.endsWith("mp4") ? (
              <VideoPlayer
                src={formatImagePath(image)}
                isMuted={true}
                playStates={playStates}
                className="w-full h-full object-cover"
                setPlayStates={setPlayStates}
              />
            ) : (
              <Image
                src={formatImagePath(image)}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover object-center rounded-xl"
                width={500}
                height={500}
                placeholder="blur"
                blurDataURL={formatImagePath(image)}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={nextSlide}
        style={{
          opacity: showButtons && currentIndex !== images.length - 1 ? 0.7 : 0,
          visibility: currentIndex !== images.length - 1 ? "visible" : "hidden",
          transition: "opacity 0.3s ease",
        }}
        className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 text-white lg:p-2 bg-gray-800 hover:bg-gray-900 font-medium rounded-xl text-xl px-3 lg:px-5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        ›
      </button>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 text-white">
        <span>
          {currentIndex + 1}/{images.length}
        </span>
      </div>
    </div>
  );
};

export default Carousel;
