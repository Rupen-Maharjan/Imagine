"use client"

const formatImagePath = (path) => {
    return path.replace('./public', '');
  };

  export default formatImagePath;