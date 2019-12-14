module.exports = {
  firstUpper: str => {
    const strFinal = str.toLowerCase();
    return strFinal.charAt(0).toUpperCase() + strFinal.slice(1);
  },

  lowerCase: str => {
    return str.toLowerCase();
  }
};
