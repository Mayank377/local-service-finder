/* ==========================================================
   LOCAL SERVICE FINDER
   setRole.js
   Sets an existing user's role directly in the database.
   Usage:  node setRole.js youremail@example.com provider
========================================================== */

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const User = require("./models/User");

async function setRole() {

    const email = process.argv[2];
    const role = process.argv[3];

    if (!email || !role) {

        console.log("Usage: node setRole.js <email> <customer|provider>");

        return;

    }

    if (!["customer", "provider"].includes(role)) {

        console.log('Role must be either "customer" or "provider".');

        return;

    }

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const user = await User.findOneAndUpdate(
            { email },
            { role },
            { new: true }
        );

        if (!user) {

            console.log(`No user found with email "${email}".`);

        } else {

            console.log(`Updated: ${user.name} (${user.email}) is now role "${user.role}".`);

        }

        await mongoose.disconnect();

    }
    catch (error) {

        console.error("Failed to update role:", error.message);

        await mongoose.disconnect();

        process.exit(1);

    }

}

setRole();
