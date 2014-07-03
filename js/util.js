var deepCopy = function(x) {
    if (x instanceof Array) {
        var y = [];
        for (var i = 0; i < x.length; i++) {
            y.push(deepCopy(x[i]));
        }
        return y;
    } else {
        return x;
    }
};
