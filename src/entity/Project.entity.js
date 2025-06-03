// models/project.js
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: { // Newly Launched, Under Construction, Ready to Move, Possession Soon
      type: DataTypes.ENUM('newly_launched', 'under_construction', 'ready_to_move', 'possession_soon'),
      allowNull: false,
    },
    expectedCompletionDate: {
      type: DataTypes.DATEONLY,
    },
    totalLandArea: {
      type: DataTypes.DECIMAL(10, 2), // e.g., 10.50 acres
    },
    landAreaUnit: {
      type: DataTypes.ENUM('sq_ft', 'sq_yd', 'acre', 'hectare'),
      defaultValue: 'acre',
    },
    numberOfTowers: {
      type: DataTypes.INTEGER,
    },
    reraRegistrationNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    projectAmenities: { // Store as JSONB if your DB supports it, or a text array/comma-separated string
      type: DataTypes.JSONB, // Example: ['Clubhouse', 'Pool', 'Gym']
      defaultValue: [],
    },
    // developerId will be added by association
  }, {
    tableName: 'projects',
    timestamps: true,
  });

  return Project;
};