// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
  const PropertyFeature = sequelize.define('PropertyFeature', {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    // Assuming boolean flags for common features
    hasParking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasLift: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasPowerBackup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasSecurity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasWaterSupply: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasGym: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasSwimmingPool: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasPlayArea: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasClubhouse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasServantRoom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasPoojaRoom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasStudyRoom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasPrivateTerraceGarden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // propertyId will be added by association
  }, {
    tableName: 'property_features',
    timestamps: false, // Features are typically part of property creation
  });

  return PropertyFeature;
};