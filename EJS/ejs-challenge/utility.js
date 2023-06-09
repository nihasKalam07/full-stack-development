



exports.getTruncatedString = (str, numberOfChars = 100) => {
    if(str.length <= numberOfChars){
        return str;
    } else {
        return str.substring(0, numberOfChars) + "...";
    }
};