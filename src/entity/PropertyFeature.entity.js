// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
  const PropertyFeature = sequelize.define('propertyfeature', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "propertyfeature_id",
    },
    featureKey: {
      type: DataTypes.STRING(50),
      field: "propertyfeature_key",
    },
    featureName: {
      type: DataTypes.STRING(50),
      field: "propertyfeature_name",
    },
    featureValue: {
      type: DataTypes.STRING(50),
      field: "propertyfeature_value",
    },
    propertyId: {
      type: DataTypes.INTEGER,
      field: "propertyfeature_property_id",
      references: {
        model: "property",
        key: "property_id",
      },
    },
    // propertyId will be added by association
  }, {
    tableName: 'propertyfeature',
    timestamps: false, // Features are typically part of property creation
  });

  return PropertyFeature;
};