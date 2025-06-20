// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
  const ProjectFeature = sequelize.define('projectfeature', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "projectfeature_id",
    },
    featureKey: {
      type: DataTypes.STRING(50),
      field: "projectfeature_key",
    },
    featureName: {
      type: DataTypes.STRING(50),
      field: "projectfeature_name",
    },
    featureValue: {
      type: DataTypes.STRING(50),
      field: "projectfeature_value",
    },
    projectId: {
      type: DataTypes.INTEGER,
      field: "projectfeature_project_id",
      references: {
        model: "project",
        key: "project_id",
      },
    },
    // propertyId will be added by association
  }, {
    tableName: 'projectfeature',
    timestamps: false, // Features are typically part of property creation
  });

  return ProjectFeature;
};