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
    // developerId will be added by association
  }, {
    tableName: 'project',
    timestamps: true,
  });

  return Project;
};