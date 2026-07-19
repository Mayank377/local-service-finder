let services = [];

// =========================
// Add Service
// =========================
const addService = (req, res) => {
    const { name, category, city, price } = req.body;

    if (!name || !category || !city || !price) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const newService = {
        id: services.length + 1,
        name,
        category,
        city,
        price,
        userId: req.user.id
    };

    services.push(newService);

    res.status(201).json({
        success: true,
        message: "Service added successfully",
        service: newService
    });
};

// =========================
// Get All Services
// =========================
const getServices = (req, res) => {
    let filteredServices = [...services];

    const {
        city,
        category,
        minPrice,
        maxPrice,
        search,
        page = 1,
        limit = 5
    } = req.query;

    // Search by Name
    if (search) {
        filteredServices = filteredServices.filter(service =>
            service.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Filter by City
    if (city) {
        filteredServices = filteredServices.filter(service =>
            service.city.toLowerCase() === city.toLowerCase()
        );
    }

    // Filter by Category
    if (category) {
        filteredServices = filteredServices.filter(service =>
            service.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Filter by Minimum Price
    if (minPrice) {
        filteredServices = filteredServices.filter(service =>
            service.price >= Number(minPrice)
        );
    }

    // Filter by Maximum Price
    if (maxPrice) {
        filteredServices = filteredServices.filter(service =>
            service.price <= Number(maxPrice)
        );
    }

    // Sort by Price (Low to High)
    filteredServices.sort((a, b) => a.price - b.price);

    // Pagination
    const currentPage = Number(page);
    const itemsPerPage = Number(limit);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        totalServices: filteredServices.length,
        currentPage,
        totalPages: Math.ceil(filteredServices.length / itemsPerPage),
        services: paginatedServices
    });
};

// =========================
// Get Service By ID
// =========================
const getServiceById = (req, res) => {
    const id = parseInt(req.params.id);

    const service = services.find(service => service.id === id);

    if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service not found"
        });
    }

    res.status(200).json({
        success: true,
        service
    });
};

// =========================
// Update Service
// =========================
const updateService = (req, res) => {
    const service = services.find(s => s.id == req.params.id);

    if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service not found"
        });
    }

    // Authorization Check
    if (service.userId !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to update this service"
        });
    }

    service.name = req.body.name || service.name;
    service.category = req.body.category || service.category;
    service.city = req.body.city || service.city;
    service.price = req.body.price || service.price;

    res.status(200).json({
        success: true,
        message: "Service updated successfully",
        service
    });
};

// =========================
// Delete Service
// =========================
const deleteService = (req, res) => {
    const serviceIndex = services.findIndex(
        service => service.id == req.params.id
    );

    if (serviceIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Service not found"
        });
    }

    // Authorization Check
    if (services[serviceIndex].userId !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this service"
        });
    }

    services.splice(serviceIndex, 1);

    res.status(200).json({
        success: true,
        message: "Service deleted successfully"
    });
};

// =========================
// Export All Controllers
// =========================
module.exports = {
    addService,
    getServices,
    getServiceById,
    updateService,
    deleteService
};