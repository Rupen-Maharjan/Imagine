"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import ReportModal from "./reportModal";
import DeleteModel from "./deleteModel";
import { PostReport } from "@/actions/export";

const dropdownVariants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const DropdownButton = ({ post, handleEdit, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleDeleteClick = () => {
    setShowDelete(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2"
      >
        <div className="bg-white h-2 w-2 lg:h-3  lg:w-3 rounded-full"></div>
        <div className="bg-white h-2 w-2 lg:h-3  lg:w-3 rounded-full"></div>
        <div className="bg-white h-2 w-2 lg:h-3  lg:w-3 rounded-full"></div>
      </button>

      <motion.div
        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg origin-top-right z-50"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={dropdownVariants}
      >
        {session.user.id === post.userId ? (
          <>
            <motion.div
              variants={itemVariants}
              onClick={() => {
                setIsOpen(false);
                handleEdit(post.id);
              }}
            >
              <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none rounded-t-md mb-3">
                Edit
              </button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              onClick={() => {
                setIsOpen(false);
                handleDeleteClick();
              }}
            >
              <button className="w-full px-4 py-2 text-sm text-red-500 hover:text-gray-900 rounded-b-md hover:bg-red-400 focus:outline-none">
                Delete
              </button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              variants={itemVariants}
              onClick={() => {
                setIsOpen(false);
                // Implement any other action needed for non-owners
              }}
            >
              <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none rounded-t-md mb-3">
                Copy
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              onClick={() => {
                setIsOpen(false);
                handleReportClick();
              }}
            >
              <button className="w-full px-4 py-2 text-sm text-red-500 hover:text-gray-900 rounded-b-md hover:bg-red-400 focus:outline-none">
                Report
              </button>
            </motion.div>
          </>
        )}
      </motion.div>

      {isReportModalOpen && (
        <ReportModal 
          isOpen={isReportModalOpen} 
          setIsOpen={setIsReportModalOpen}
          onConfirm={(data)=>PostReport(data,post.id,session.user.id)
          
          }
        />
      )}

      {showDelete && (
        <DeleteModel
          isOpen={showDelete}
          setIsOpen={setShowDelete}
          onConfirm={() => handleDelete(post.id)}
        />
      )}
    </div>
  );
};

export default DropdownButton;
