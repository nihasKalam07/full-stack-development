
exports.getDate = function () {
    let date = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    return date.toLocaleDateString("en-US", options);
};

exports.getDay = () => {
    let date = new Date();
    let options = {
        weekday: "long"
    }
    return date.toLocaleDateString("en-US", options);
};

console.log(module);