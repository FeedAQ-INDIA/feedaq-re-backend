// models/projectImage.js
module.exports = (sequelize, DataTypes) => {
  const PGAttachment = sequelize.define('pgattach', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "pgattach_id",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      field: "pgattach_url",
    },
    isPrimary: { // To set one image as the main display image
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "pgattach_is_primary",
    },
    order: { // To set one image as the main display image
      type: DataTypes.INTEGER,
      field: "pgattach_order",
    },
    caption: {
      type: DataTypes.STRING(255),
      field: "pgattach_caption",
    },
    type: {
      type: DataTypes.ENUM('IMAGE', 'VIDEO', 'SHORTS', 'DOCS'),
      field: "pgattach_type",
      defaultValue:null
    },


    pgId: {
      type: DataTypes.INTEGER,
      field: "pgattach_pg_id",
      references: {
        model: "pg",
        key: "pg_id",
      },
    },
    pgRoomId: {
      type: DataTypes.INTEGER,
      field: "pgattach_pgroom_id",
      references: {
        model: "pgroom",
        key: "pgroom_id",
      },
    },
  }, {
    tableName: 'pgattach',
    timestamps: true, // When the image was added
  });

  return PGAttachment;
};