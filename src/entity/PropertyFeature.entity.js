// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
  const PropertyFeature = sequelize.define('propertyfeature', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "propertyfeature_id",
    },
    // Assuming boolean flags for common features
    hasParking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_parking",
    },
    hasLift: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_lift",
    },
    hasPowerBackup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_power_backup",
    },
    hasSecurity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_security",
    },
    hasWaterSupply: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_water_supply",
    },
    hasGym: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_gym",
    },
    hasSwimmingPool: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_swim_pool",
    },
    hasPlayArea: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_play_area",
    },
    hasClubhouse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_club_house",
    },
    hasServantRoom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_servant_room",
    },
    hasPoojaRoom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_pooja_room",
    },
    hasStudyRoom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_study_room",
    },
    hasPrivateTerraceGarden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyfeature_has_private_terrace_garden",
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