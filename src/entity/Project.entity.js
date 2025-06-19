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

    projectConfiguration:{
      type: DataTypes.JSONB,
      field: "project_configuration",
    },
    projectUnitDetail: {
      type: DataTypes.JSONB,
      field: "project_unit_detail",
    },
    projectAdditionalDetail: { // Store as JSONB if your DB supports it, or a text array/comma-separated string
      type: DataTypes.JSONB, // Example: ['Clubhouse', 'Pool', 'Gym']
      defaultValue: [],
      field: "project_addl_detail",
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
    projectAmenities: { // Store as JSONB if your DB supports it, or a text array/comma-separated string
      type: DataTypes.JSONB, // Example: ['Clubhouse', 'Pool', 'Gym']
      defaultValue: [],
      field: "project_amenities",
    },
    developerId: {
      type: DataTypes.INTEGER,
      field: "project_developer_id",
      references: {
        model: "developer",
        key: "developer_id",
      },
    },

    //ADDRESS ---
    addressLine1: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "project_addressline_1",
    },
    addressLine2: {
      type: Sequelize.STRING,
      field: "project_addressline_2",
    },
    locality: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "project_locality",
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "project_city"
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "project_state",
    },
    zipCode: {
      type: Sequelize.STRING,
      field: "project_zipcode",
    },
    country: {
      type: Sequelize.STRING,
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