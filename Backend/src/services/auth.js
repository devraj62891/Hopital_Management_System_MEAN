const jwt = require("jsonwebtoken");
const secret = "MediCare_Secret_123";

function setUser(payload) {

    return jwt.sign(payload, secret, { expiresIn: "24h" });
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = { setUser, getUser };