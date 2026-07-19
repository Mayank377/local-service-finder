const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        "mysecretkey",
        {
            expiresIn: "7d"
        }
    );
};

module.exports = generateToken;