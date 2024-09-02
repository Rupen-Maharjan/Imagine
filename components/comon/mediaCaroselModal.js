import { AnimatePresence, motion } from "framer-motion";

const MediaCarouselModal = ({
  files,
  isOpen,
  setIsOpen,
  currentIndex,
  setCurrentIndex,
}) => {
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? files.length - 1 : prevIndex - 1
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-hidden cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <div className="flex justify-between mb-2">
              {files.length > 1 && (
                <>
                  <button onClick={handlePrevious}>Previous</button>
                  <button onClick={handleNext}>Next</button>
                </>
              )}
            </div>
            <div className="relative z-10 h-96">
              {files[currentIndex].type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(files[currentIndex])}
                  className=" mx-auto rounded-xl h-full"
                  alt=""
                />
              ) : (
                <video
                  src={URL.createObjectURL(files[currentIndex])}
                  className=" mx-auto rounded-xl h-full"
                  controls
                  autoPlay
                  loop
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaCarouselModal;
