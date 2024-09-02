"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImgUpload } from "@/actions/export"; // Assuming ImgUpload handles the API call for uploading images
import { useSession } from "next-auth/react";
import MediaCarouselModal from "../comon/mediaCaroselModal"; // Import the carousel component

const UploadForm = ({ toggle, setToggle }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef(null);
  const { data: session } = useSession();

  const click = () => {
    formRef.current.querySelector('input[type="file"]').click();
  };

  const upload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("media", file);
    });
    await ImgUpload(formData, session.user.id);
  };

  const handleChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to an array
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append selected files
    }
  };

  const handleRemove = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePreview = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handleBackgroundClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setToggle(false); // Hide the form if the click is outside of it
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        onClick={handleBackgroundClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-slate-900/20 overflow-y-auto"
      >
        <motion.div
          ref={formRef}
          initial={{ scale: 0, rotate: "12.5deg" }}
          animate={{ scale: 1, rotate: "0deg" }}
          exit={{ scale: 0, rotate: "0deg" }}
          className="space-y-5 flex flex-col py-2 rounded-xl items-center bg-gradient-to-br from-violet-600 to-indigo-600 overflow-hidden w-full max-w-lg p-6 shadow-xl"
        >
          <form
            onSubmit={upload}
            encType="multipart/form-data"
            className="w-96 justify-center items-center flex flex-col space-y-2"
          >
            <div className="bg-slate-200 w-full py-1 px-2 text-black rounded-3xl mt-2">
              <input
                type="text"
                name="caption"
                placeholder="What's on your mind?"
                className="p-2 w-full bg-transparent border-none outline-none"
              />
            </div>
            <input
              hidden
              type="file"
              onChange={handleChange}
              accept="image/jpeg,image/webp,image/jpg,video/mp4"
              multiple
              name="media"
            />
            <div className="flex space-x-2 overflow-x-auto">
              {files.length === 0 ? (
                <img
                  src="/photo-gallery.gif"
                  width={120}
                  height={120}
                  className="rounded-xl"
                  alt="Default"
                />
              ) : (
                files.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 flex-shrink-0"
                    onClick={() => handlePreview(index)}
                  >
                    {file.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    )}
                    {file.type.startsWith("video/") && (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const videoElement = e.target;
                          if (videoElement.paused) {
                            videoElement.play();
                          } else {
                            videoElement.pause();
                          }
                        }}
                      />
                    )}
                    <button
                      onClick={() => handleRemove(index)}
                      type="button"
                      className="absolute top-1 right-1 h-5 bg-white rounded-full p-1 text-black z-10"
                    >
                      <img className="h-full" src="/cross.png" alt="" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div>
              <button type="button" onClick={click}>
                Choose files
              </button>
            </div>
            <button type="submit">Upload</button>
          </form>
          {files.length > 0 && (
            <MediaCarouselModal
              files={files}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadForm;
