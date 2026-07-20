const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Temporary in-memory user storage
let users = [];

// ======================================
// Register User
// ======================================

const registerUser = async (req, res) => {

    console.log("REGISTER API CALLED");

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userExists = users.find(
            user => user.email === email
        );

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

        console.log("Current Users:", users);

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

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ======================================
// Login User
// ======================================

const loginUser = async (req, res) => {

    console.log("LOGIN API CALLED");

    try {

        const { email, password } = req.body;

        const user = users.find(
            user => user.email === email
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

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

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ======================================
// Get Logged-in User Profile
// ======================================

const getUserProfile = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: {
            id: req.user.id
        }
    });

};

// ======================================
// Export
// ======================================

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};