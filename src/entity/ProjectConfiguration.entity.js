// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
  const ProjectConfiguration = sequelize.define('projectconf', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "projectconf_id",
    },
    configurationKey: {
      type: DataTypes.STRING(50),
      field: "projectconf_key",
    },
    configurationCategory: {
      type: DataTypes.STRING(50),
      field: "projectconf_category",
    },
    configurationName: {
      type: DataTypes.STRING(50),
      field: "projectconf_name",
    },
    configurationValue: {
      type: DataTypes.STRING(50),
      field: "projectconf_value",
    },
    projectId: {
      type: DataTypes.INTEGER,
      field: "projectconf_property_id",
      references: {
        model: "project",
        key: "project_id",
      },
    },
    // propertyId will be added by association
  }, {
    tableName: 'projectconf',
    timestamps: false, // Features are typically part of property creation
  });

  return ProjectConfiguration;
};