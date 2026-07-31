const Service = require("../models/Service");

// =========================
// Add Service
// =========================
const addService = async (req, res) => {
    try {
        const { name, category, city, price, description } = req.body;

        const service = await Service.create({
            name,
            category,
            city,
            price,
            description,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Service Added Successfully",
            service
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// =========================
// Get All Services
// =========================
const getServices = async (req, res) => {
    try {

        const {
            search,
            city,
            category,
            page = 1,
            limit = 5
        } = req.query;

        let query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (city) {
            query.city = city;
        }

        if (category) {
            query.category = category;
        }

        const services = await Service.find(query)
            .populate("user", "name email phone")
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Service.countDocuments(query);

        res.json({
            success: true,
            total,
            page: Number(page),
            services
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// =========================
// Get Single Service
// =========================
const getServiceById = async (req, res) => {

    try {

        const service = await Service.findById(req.params.id)
            .populate("user", "name email phone");

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.json({
            success: true,
            service
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// =========================
// Update Service
// =========================
const updateService = async (req, res) => {

    try {

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        if (service.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        Object.assign(service, req.body);

        await service.save();

        res.json({
            success: true,
            message: "Service Updated",
            service
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// =========================
// Delete Service
// =========================
const deleteService = async (req, res) => {

    try {

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        if (service.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await service.deleteOne();

        res.json({
            success: true,
            message: "Service Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = {
    addService,
    getServices,
    getServiceById,
    updateService,
    deleteService
};