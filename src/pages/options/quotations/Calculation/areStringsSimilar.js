const areStringsSimilar = (str1, str2) => {
    const normalize = str => str.toLowerCase().replace(/[\s_-]/g, '');
    return normalize(str1) === normalize(str2);
  };
  
  export default areStringsSimilar;
  