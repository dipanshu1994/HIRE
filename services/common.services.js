let randomStr = (len, arr) => {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans +=
            arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

module.exports = {
    generateOtp: randomStr
}