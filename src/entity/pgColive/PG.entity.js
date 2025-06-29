module.exports = (sequelize, Sequelize) => {
  const PG = sequelize.define('pg', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "pg_id",
    },
    userId: {
      type: Sequelize.INTEGER,
      field: "pg_user_id",
      allowNull: false,
      references: {
        model: "user",
        key: "user_id",
      },
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "pg_title",
    },
    description: {
      type: Sequelize.TEXT,
      field: "pg_description",
    },
    rules: {
      type: Sequelize.TEXT,
      field: "pg_rules",
    },
    gender: {
      type: Sequelize.ENUM('Men', 'Women', 'Colive'),
      field: "pg_gender",
      allowNull: false,
    },
    operatingSince: {
      type: Sequelize.DATE,
      field: "pg_operating_since",
      allowNull: false,
    },
    suitedFor: {
      type: Sequelize.ENUM('Working', 'Student', 'All'),
      field: "pg_suited_for",
      allowNull: false,
    },
    isMealAvailable: {
      type: Sequelize.BOOLEAN,   //breafkast;lunch;dinner
      field: "pg_is_meal_available",
      defaultValue: false,
    },
    mealDetail: {
      type: Sequelize.JSONB,  //south, north
      field: "pg_meal_detail",
    },
    brandName: {
      type: Sequelize.ENUM('Zolo', 'Colive', 'Helloworld'),
      field: "pg_brand_name",
    },
    pgContact: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "pg_contact",
    },
    pgEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "pg_email",
    },
    pgName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "pg_name",
    },
    //ADDRESS ---

    mapReferenceId: {
      type: Sequelize.STRING,
      field: "pg_map_ref_id",
      allowNull: false,
    },
    mapReferenceAddress: {
      type: Sequelize.STRING,
      field: "pg_map_ref_aadress",
      allowNull: false,
    },
    addressLine1: {
      type: Sequelize.STRING,
      field: "pg_addressline_1",
    },
    addressLine2: {
      type: Sequelize.STRING,
      field: "pg_addressline_2",
    },
    locality: {
      type: Sequelize.STRING,
      field: "pg_locality",
    },
    city: {
      type: Sequelize.STRING,
      field: "pg_city"
    },
    state: {
      type: Sequelize.STRING,
      field: "pg_state",
    },

    country: {
      type: Sequelize.STRING,
      defaultValue: 'India',
      field: "pg_country",
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      field: "pg_latitude",
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      field: "pg_longitude",
    },
    geom: {
      type: Sequelize.GEOMETRY('Point', 4326), // 'Point' type, SRID 4326 (WGS84 - standard lat/lon)
      allowNull: true, // Allow null if not all locations have precise coordinates
      field: "pg_geoam",
    }
  }, {
    tableName: 'pg',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });


  // Hook to automatically populate 'geom' from latitude/longitude
  PG.beforeSave(async (location, options) => {
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

  return PG;
};
