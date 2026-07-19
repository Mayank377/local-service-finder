const express = require("express");

const router = express.Router();

router.get("/services", (req, res) => {

    const services = [
        {
            id: 1,
            name: "Electrician"
        },
        {
            id: 2,
            name: "Plumber"
        },
        {
            id: 3,
            name: "Carpenter"
        }
    ];

    res.json(services);

});

module.exports = router;