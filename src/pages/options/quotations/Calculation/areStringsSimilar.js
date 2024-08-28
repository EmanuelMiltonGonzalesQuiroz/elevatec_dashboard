const areStringsSimilar = (str1, str2) => {
    const normalize = str => str.toLowerCase().replace(/[\s\_\-\(\)]/g, '');
    return normalize(str1) === normalize(str2);
  };
  
export default areStringsSimilar;
  