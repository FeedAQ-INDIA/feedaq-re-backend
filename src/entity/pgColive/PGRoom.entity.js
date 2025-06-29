module.exports = (sequelize, Sequelize) => {

  const PGRoom = sequelize.define('pgroom', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "pgroom_id",
    },
    pgId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'pg',
        key: 'pg_id'
      },
      field: "pgroom_pg_id",
    },
    additionalPrice: {
      type: Sequelize.JSONB,
      field: "pgroom_additional_price",
    },
    availableFrom: {
      type: Sequelize.DATE,
      field: "pgroom_available_from",
    },
    isAirConditioned: {
      type: Sequelize.BOOLEAN,
      field: "pgroom_is_air_conditioned",
      defaultValue: false,
    },
    furnishingStatus: {
      type: Sequelize.ENUM('furnished', 'semi_furnished', 'unfurnished'),
      field: "pg_furnishing_status",
      allowNull: false,
    },
    occupancyLimit: {
      type: Sequelize.INTEGER,
      field: "pgroom_is_occupancy_limit",
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: "pgroom_is_price",
    },
    area: {
      type: Sequelize.FLOAT,
      field: "pgroom_area",
    },
    areaUnit: {
      type: Sequelize.ENUM('sq_ft', 'sq_yd', 'sq_m', 'acre', 'bigha'), // Add common units for India
      defaultValue: 'sq_ft',
      field: "pgroom_area_unit",
    },
    roomType: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "pgroom_type",
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "pgroom_title",
    },
    description: {
      type: Sequelize.TEXT,
      field: "pgroom_description",
    },
  }, {
    tableName: 'pgroom',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return PGRoom;

}

