const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

let users = [];

// Register User
const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        token: generateToken(newUser.id),
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
};

// Login User
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid Email"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid Password"
        });
    }

    res.status(200).json({
        success: true,
        message: "Login Successful",
        token: generateToken(user.id),
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
};
// Get Logged-in User Profile
const getUserProfile = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: {
            id: req.user.id
        }
    });
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};