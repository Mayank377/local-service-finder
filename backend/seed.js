/* ==========================================================
   LOCAL SERVICE FINDER
   seed.js
   Bulk-inserts sample services into MongoDB, linked to your
   existing user account. Run once with: node seed.js
========================================================== */

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const User = require("./models/User");
const Service = require("./models/Service");

const categories = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Cleaner",
    "Mechanic",
    "Tutor",
    "AC Repair",
    "Computer Repair",
    "Mobile Repair",
    "CCTV Installation",
    "RO Service",
    "Beautician",
    "Makeup Artist",
    "Photographer",
    "Gardener",
    "Laundry",
    "Cook",
    "Packers & Movers",
    "Pest Control",
    "Pet Care",
    "Interior Designer",
    "Tile Fitter",
    "Welder",
    "Locksmith"
];

const cities = [
    "Indore",
    "Bhopal",
    "Delhi",
    "Mumbai",
    "Pune",
    "Jaipur",
    "Ahmedabad",
    "Lucknow",
    "Nagpur",
    "Surat",
    "Hyderabad",
    "Bengaluru",
    "Chennai",
    "Kolkata",
    "Noida",
    "Gurugram",
    "Patna",
    "Raipur",
    "Kanpur",
    "Chandigarh"
];

const names = [
    "Raj","Amit","Rahul","Suresh","Vikram","Mohit","Deepak","Ravi",
    "Ankit","Manoj","Rakesh","Arjun","Rohan","Shivam","Akash",
    "Abhishek","Ajay","Prakash","Nitin","Yash","Kunal","Rohit",
    "Varun","Aditya","Harsh","Pankaj","Gaurav","Sachin","Vivek",
    "Sunil","Mahesh","Kishan","Tarun","Aman","Naveen","Sanjay",
    "Dinesh","Lokesh","Ashish","Vikas"
];

const descriptions = [
    "Professional service with affordable pricing.",
    "Fast doorstep service with experienced staff.",
    "Reliable and verified technician.",
    "24x7 emergency support available.",
    "Trusted by hundreds of happy customers.",
    "Quality work with warranty.",
    "Experienced professional for residential and commercial work."
];

const sampleServices = [];

for (let i = 1; i <= 500; i++) {

    const category = categories[Math.floor(Math.random() * categories.length)];

    sampleServices.push({

        name: `${names[Math.floor(Math.random() * names.length)]} ${category}`,

        category,

        city: cities[Math.floor(Math.random() * cities.length)],

        price: Math.floor(Math.random() * 1800) + 300,

        description: descriptions[Math.floor(Math.random() * descriptions.length)]

    });

}

async function seed() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        // Find an existing user to own these services.
        // Pass an email as a command-line argument to pick a specific user,
        // e.g.:  node seed.js mayank@example.com
        const emailArg = process.argv[2];

        const owner = emailArg
            ? await User.findOne({ email: emailArg })
            : await User.findOne();

        if (!owner) {

            console.log(
                emailArg
                    ? `No user found with email "${emailArg}". Register an account first, or run without an email to use any existing user.`
                    : "No users found in the database. Register an account through your app first, then re-run this script."
            );

            await mongoose.disconnect();

            return;

        }

        console.log(`Attaching all services to user: ${owner.name} (${owner.email})`);

        const servicesWithOwner = sampleServices.map(service => ({
            ...service,
            user: owner._id
        }));

        const inserted = await Service.insertMany(servicesWithOwner);

        console.log(`Inserted ${inserted.length} services:`);

        inserted.forEach(s => console.log(` - ${s.name} (${s.category}, ${s.city})`));

        await mongoose.disconnect();

        console.log("Done. Disconnected from MongoDB.");

    }
    catch (error) {

        console.error("Seed failed:", error.message);

        await mongoose.disconnect();

        process.exit(1);

    }

}

seed();
