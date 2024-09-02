"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const ReportModal = ({ isOpen, setIsOpen, onConfirm }) => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [reportMessage, setReportMessage] = useState("");

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedReports((prev) =>
      checked ? [...prev, value] : prev.filter((report) => report !== value)
    );
  };

  const handleReport = () => {
    onConfirm({ reports: selectedReports, message: reportMessage });
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-center mb-4">
                Report this post?
              </h3>
              <div className="mb-4 text-xl">
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    value="offensive"
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4"
                  />
                  Offensive Post
                </label>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    value="nudity"
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4"
                  />
                  Nudity
                </label>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    value="copyright"
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4"
                  />
                  Copyright
                </label>
                {/* Add more checkboxes as needed */}
              </div>
              <textarea
                placeholder="Optional report message"
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                className="w-full p-2 rounded text-black mb-4 focus:outline-none resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Report
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
