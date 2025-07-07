const { literal, fn, col, where } = require('sequelize');
const db = require("../entity/index.js");

exports.searchProjects = async (req, res) => {
    try {
        const { lat, lng, radius = "5", page = "1", limit = "10" } = req.query;

        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lng);
        const parsedRadius = parseFloat(radius) * 1000; // meters
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const offset = (parsedPage - 1) * parsedLimit;

        if (isNaN(parsedLat) || isNaN(parsedLng) || isNaN(parsedRadius)) {
            return res.status(400).json({ error: "Invalid latitude, longitude, or radius" });
        }

        const whereGeo = where(
            fn('ST_DWithin',
                col('project_geoam'),
                fn('ST_SetSRID', fn('ST_MakePoint', parsedLng, parsedLat), 4326),
                parsedRadius
            ),
            true
        );

        const result = await db.Project.findAndCountAll({
            where: whereGeo,
            include: [
                { model: db.ProjectAttachment, as: "attachment" },
                { model: db.ProjectFeature, as: "features" },
                { model: db.ProjectConfiguration, as: "configurations" },
            ],
            limit: parsedLimit,
            offset,
            distinct: true, // ✅ fixes the overcount issue

        });

        const total = result.count;
        const totalPages = Math.ceil(total / parsedLimit);

        res.json({
            total,
            currentPage: parsedPage,
            totalPages,
            data: result.rows
        });

    } catch (err) {
        console.error("Error fetching projects:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
