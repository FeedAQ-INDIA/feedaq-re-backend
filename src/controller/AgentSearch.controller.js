const { Op, fn, col, literal } = require('sequelize');
const db = require("../entity/index.js");

exports.searchAgents = async (req, res) => {
    try {
        const { lat, lng, radius, page = 1, limit = 10 } = req.query;

        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lng);
        const parsedRadius = parseFloat(radius) * 1000;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const offset = (parsedPage - 1) * parsedLimit;

        // Geospatial filter using literal SQL inside Sequelize where clause
        const whereGeo = literal(`
            ST_DWithin(
                agent_geoam,
                ST_SetSRID(ST_MakePoint(${parsedLng}, ${parsedLat}), 4326),
                ${parsedRadius}
            )
        `);

        // Sequelize handles mapping and pagination
        const result = await db.Agent.findAndCountAll({
            where: whereGeo,
            include:[
                {
                    model: db.User,
                    as: "user"
                }
            ],
            limit: parsedLimit,
            offset,
        });

        const total = result.count;
        const totalPages = Math.ceil(total / parsedLimit);

        res.json({
            total,
            currentPage: parsedPage,
            totalPages,
            data: result.rows, // These are Sequelize model instances (mapped objects)
        });

    } catch (err) {
        console.error("Error fetching agents:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
