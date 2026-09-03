function isPrime(n) {
    if (n == 1) {
        return false;
    }
    for (let i = 2; i <= n / 2; i++) {
        if (Number.isInteger(n / i)) {
            return false;
        }
    }
    return true;
}

module.exports = {
    isPrime: isPrime
}