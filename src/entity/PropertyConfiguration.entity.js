// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
  const PropertyConfiguration = sequelize.define('propertyconf', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "propertyconf_id",
    },
    configurationKey: {
      type: DataTypes.STRING(50),
      field: "propertyconf_key",
    },
    configurationName: {
      type: DataTypes.STRING(50),
      field: "propertyconf_name",
    },
    configurationValue: {
      type: DataTypes.STRING(50),
      field: "propertyconf_value",
    },
    propertyId: {
      type: DataTypes.INTEGER,
      field: "propertyconf_property_id",
      references: {
        model: "property",
        key: "property_id",
      },
    },
    // propertyId will be added by association
  }, {
    tableName: 'propertyconf',
    timestamps: false, // Features are typically part of property creation
  });

  return PropertyConfiguration;
};