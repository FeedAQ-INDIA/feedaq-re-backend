// models/project.js
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "project_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "project_name",
    },
    description: {
      type: DataTypes.TEXT,
      field: "project_description",
    },
    status: { // Newly Launched, Under Construction, Ready to Move, Possession Soon
      type: DataTypes.ENUM('newly_launched', 'under_construction', 'ready_to_move', 'possession_soon'),
      allowNull: false,
      field: "project_status",
    },
    expectedCompletionDate: {
      type: DataTypes.DATEONLY,
      field: "project_exp_completion_date",
    },
    totalLandArea: {
      type: DataTypes.DECIMAL(10, 2), // e.g., 10.50 acres
      field: "project_tot_land_area",
    },
    landAreaUnit: {
      type: DataTypes.ENUM('sq_ft', 'sq_yd', 'acre', 'hectare'),
      defaultValue: 'acre',
      field: "project_land_unit",
    },
    projectUnitDetail: {
      type: DataTypes.JSONB,
      field: "project_unit_detail",
    },
    numberOfTowers: {
      type: DataTypes.INTEGER,
      field: "project_no_of_towers",
    },
    reraRegistrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      field: "project_rera_no",
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "project_user_id",
      references: {
        model: "user",
        key: "user_id",
      },
    },
    developerId: {
      type: DataTypes.INTEGER,
      field: "project_developer_id",
      references: {
        model: "developer",
        key: "developer_id",
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "project_is_verified",
    },
    minPrice: {
      type: DataTypes.DECIMAL(15, 2),
      field: "project_min_price",
    },
    maxPrice: {
      type: DataTypes.DECIMAL(15, 2),
      field: "project_max_price",
    },
    //ADDRESS ---
    mapReferenceId: {
      type: DataTypes.STRING,
      field: "project_map_ref_id",
    },
    mapReferenceAddress: {
      type: DataTypes.STRING,
      field: "project_map_ref_aadress",
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "project_addressline_1",
    },
    addressLine2: {
      type: DataTypes.STRING,
      field: "project_addressline_2",
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "project_locality",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "project_city"
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "project_state",
    },
    zipCode: {
      type: DataTypes.STRING,
      field: "project_zipcode",
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'India',
      field: "project_country",
    },
    latitude: { // Keep for easier input/output
      type: DataTypes.DECIMAL(10, 8),
      field: "project_latitude",
    },
    longitude: { // Keep for easier input/output
      type: DataTypes.DECIMAL(11, 8),
      field: "project_longitude",
    },
    // NEW: Geographic point column
    geom: {
      type: DataTypes.GEOMETRY('Point', 4326), // 'Point' type, SRID 4326 (WGS84 - standard lat/lon)
      allowNull: true, // Allow null if not all locations have precise coordinates
      field: "project_geoam",
    },
    // developerId will be added by association
  }, {
    tableName: 'project',
    timestamps: true,
    indexes: [
      {
        fields: ['project_geoam'],
        using: 'GIST', // GIST index for geospatial queries
      }
    ]
  });

  // Hook to automatically populate 'geom' from latitude/longitude
  Project.beforeSave(async (location, options) => {
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



  return Project;
};