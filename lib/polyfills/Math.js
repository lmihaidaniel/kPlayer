export default (function() {
    Math.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    Math.randomDec = function (min, max, decimals) {
        return (Math.random() * (max - min) + min).toFixed(decimals || 2);
    };
    Math.randomList = function (list) {
        return list[Math.randomInt(0, list.length)];
    };
})();