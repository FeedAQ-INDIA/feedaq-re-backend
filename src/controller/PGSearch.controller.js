const { literal } = require('sequelize');
const db = require("../entity/index.js");

exports.searchPG = async (req, res) => {
    try {
        const { lat, lng, radius, page = 1, limit = 10 } = req.query;

        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lng);
        const parsedRadius = parseFloat(radius) * 1000;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const offset = (parsedPage - 1) * parsedLimit;

        // Spatial where clause using raw SQL inside Sequelize's literal
        const whereGeo = literal(`
            ST_DWithin(
                pg_geoam,
                ST_SetSRID(ST_MakePoint(${parsedLng}, ${parsedLat}), 4326),
                ${parsedRadius}
            )
        `);

        // Fetch paginated project results mapped to Sequelize model
        const result = await db.PG.findAndCountAll({
            where: whereGeo,
            include:[
                {
                    model: db.PGAttachment,
                    as: "attachment",
                },
                {
                    model: db.PGFeature,
                    as: "features",
                },
                {
                    model: db.PGRoom,
                    as: "pgroomdetail",
                },

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
            data: result.rows // Array of Sequelize Project instances
        });

    } catch (err) {
        console.error("Error fetching projects:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
