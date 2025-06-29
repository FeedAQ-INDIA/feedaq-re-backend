// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
  const PGFeature = sequelize.define('pgfeature', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "pgfeature_id",
    },
    featureKey: {
      type: DataTypes.STRING(50),
      field: "pgfeature_key",
    },
    featureCategory: {
      type: DataTypes.STRING(50),
      field: "pgfeature_category",
    },
    featureName: {
      type: DataTypes.STRING(50),
      field: "pgfeature_name",
    },
    featureValue: {
      type: DataTypes.STRING(50),
      field: "pgfeature_value",
    },
    pgId: {
      type: DataTypes.INTEGER,
      field: "pgfeature_pg_id",
      references: {
        model: "pg",
        key: "pg_id",
      },
    },
    pgRoomId: {
      type: DataTypes.INTEGER,
      field: "pgfeature_pgroom_id",
      references: {
        model: "pgroom",
        key: "pgroom_id",
      },
    },
    // propertyId will be added by association
  }, {
    tableName: 'pgfeature',
    timestamps: false, // Features are typically part of property creation
  });

  return PGFeature;
};