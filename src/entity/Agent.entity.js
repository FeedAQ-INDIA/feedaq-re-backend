module.exports = (sequelize, Sequelize) => {
    const Agent = sequelize.define(
        "agent",
        {
            agentId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "agent_id",
            },
            userId: {
                type: Sequelize.INTEGER,
                field: "agent_user_id",
                references: {
                    model: "user",
                    key: "user_id",
                },
            },
            agentBio: {
                type: Sequelize.TEXT,
                field: "agent_bio",
            },

            agentProfilePic: {
                type: Sequelize.STRING(200),
                field: "agent_profile_pic",
            },

            agentPhoneNumber: {
                type: Sequelize.STRING(20),
                allowNull: false,
                field: "agent_phone_number",
            },
            agentEmail: {
                type: Sequelize.STRING(30),
                allowNull: false,
                field: "agent_email",
            },


            agentLicenseNumber: {
                type: Sequelize.STRING(30),
                field: "agent_license_number",
            },

            agentExperience: {
                type: Sequelize.INTEGER,
                field: "agent_experience",
            },

            agentOperatingSince: {
                type: Sequelize.STRING(4),
                field: "agent_operating_since",
            },

            agentAgencyName: {
                type: Sequelize.STRING(30),
                field: "agent_agency_name",
            },

            agentNameInitial: {
                type: Sequelize.STRING(3),
                field: "agent_name_initial",
            },

            agentWebsite: {
                type: Sequelize.STRING(50),
                field: "agent_website",
            },

            agentOfficeAddress: {
                type: Sequelize.STRING(200),
                field: "agent_office_address",
            },
            agentLocality: {
                type: Sequelize.STRING(100),
                field: "agent_locality",
            },
            agentCity: {
                type: Sequelize.STRING(100),
                field: "agent_city",
            },

            agentState: {
                type: Sequelize.STRING(100),
                field: "agent_state",
            },

            agentCountry: {
                type: Sequelize.STRING(100),
                field: "agent_country",
            },

            agentAreasServed: {
                type: Sequelize.ARRAY(Sequelize.STRING(50)), // Use TEXT or JSON depending on DB
                field: "agent_areas_served",
            },

            agentRating: {
                type: Sequelize.FLOAT,
                defaultValue: 0,
                field: "agent_rating",
            },

            agentReviewCount: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                field: "agent_review_count",
            },

            agentTotalListings: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                field: "agent_total_listings",
            },

            agentSpecializations: {
                type: Sequelize.ARRAY(Sequelize.STRING(50)), // Array-style storage
                field: "agent_specializations",
            },

            agentLanguagesSpoken: {
                type: Sequelize.ARRAY(Sequelize.STRING(50)),
                field: "agent_languages_spoken",
            },

            agentIsVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                field: "agent_is_verified",
            },

            agentPartnerType: {
                type: Sequelize.ENUM('Platinum Partner',  'Gold Member', 'Silver Member', 'Bronze Member'),
                defaultValue: null,
                field: "agent_partner_type",
            },

            latitude: { // Keep for easier input/output
                type: Sequelize.DECIMAL(10, 8),
                field: "agent_latitude",
            },
            longitude: { // Keep for easier input/output
                type: Sequelize.DECIMAL(11, 8),
                field: "agent_longitude",
            },
            // NEW: Geographic point column
            geom: {
                type: Sequelize.GEOMETRY('Point', 4326), // 'Point' type, SRID 4326 (WGS84 - standard lat/lon)
                allowNull: true, // Allow null if not all locations have precise coordinates
                field: "agent_geoam",
            },

            // Virtuals: Formatted Dates
            v_created_date: {
                type: Sequelize.VIRTUAL,
                get() {
                    if (!this.agent_created_at) return null;
                    const date = new Date(this.agent_created_at);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = date.toLocaleString("en-US", { month: "short" });
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                },
            },

            v_created_time: {
                type: Sequelize.VIRTUAL,
                get() {
                    if (!this.agent_created_at) return null;
                    return this.agent_created_at.toTimeString().split(" ")[0];
                },
            },


            v_updated_date: {
                type: Sequelize.VIRTUAL,
                get() {
                    if (!this.agent_updated_at) return null;
                    const date = new Date(this.agent_updated_at);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = date.toLocaleString("en-US", { month: "short" });
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                },
            },

            v_updated_time: {
                type: Sequelize.VIRTUAL,
                get() {
                    if (!this.agent_updated_at) return null;
                    return this.agent_updated_at.toTimeString().split(" ")[0];
                },
            },
        },
        {
            timestamps: true,
            createdAt: "agent_created_at",
            updatedAt: "agent_updated_at",
            indexes: [
                {
                    fields: ['agent_geoam'],
                    using: 'GIST', // GIST index for geospatial queries
                }
            ]
        }
    );
    // Hook to automatically populate 'geom' from latitude/longitude
    Agent.beforeSave(async (location, options) => {
        if (location.latitude && location.longitude) {
            location.geom = {
                type: 'Point',
                coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)], // GeoJSON expects [longitude, latitude]
                crs: { type: 'name', properties: { name: 'EPSG:4326' } }
            };
        } else {
            location.geom = null; // Clear geom if coordinates are removed
        }
    });


    return Agent;
};
