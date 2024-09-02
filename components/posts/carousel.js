"use client";
import Image from "next/image";
import { formatImagePath } from "@/functions/export";
import { useState, useRef, useEffect } from "react";
import VideoPlayer from "./videoPlayer";

// Carousel component to display a series of images with navigation controls
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current slide index
  const [playStates, setPlayStates] = useState(
    Array(images.length).fill(false)
  ); // State to track play status for each video
  const [volume, setVolume] = useState(1); // State to track volume
  const [isMuted, setIsMuted] = useState(false); // State to track mute status
  const containerRef = useRef(null); // Reference to the parent container

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      // Use container dimensions for image and video
    }
  }, [containerRef.current]);

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

  return (
    <div
      className="relative bg-black overflow-hidden w-full h-[25rem] lg:h-full rounded-xl"
      ref={containerRef}
    >
      <button
        onClick={prevSlide}
        className={`opacity-70 absolute z-10 left-0 top-1/2 transform -translate-y-1/2 text-white p-2 ${
          currentIndex === 0 ? "hidden" : ""
        } bg-gray-800 hover:bg-gray-900 font-medium rounded-xl text-xl px-5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
      >
        ‹
      </button>

      <div
        className="flex items-center max-h-full max-w-full transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full flex justify-center"
            style={{ height: '30rem' }} // Fixed dimensions for image and video
          >
            {image.endsWith("mp4") ? (
              <VideoPlayer
                src={formatImagePath(image)}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                index={index}
                playStates={playStates}
                setPlayStates={setPlayStates}
                className="rounded-xl"
              />
            ) : (
                <Image
                  src={formatImagePath(image)}
                  alt={`Slide ${index}`}
                  className=" object-cover object-center rounded-xl"
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
        className={`opacity-70 absolute z-10 right-0 top-1/2 transform -translate-y-1/2 text-white p-2 ${
          currentIndex === images.length - 1 ? "hidden" : ""
        } bg-gray-800 hover:bg-gray-900 font-medium rounded-xl text-xl px-5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
      >
        ›
      </button>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <span>
          {currentIndex + 1}/{images.length}
        </span>
      </div>
    </div>
  );
};

export default Carousel;
