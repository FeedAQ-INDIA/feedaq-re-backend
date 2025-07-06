// models/developer.js
module.exports = (sequelize, DataTypes) => {
  const Developer = sequelize.define('developer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "developer_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "developer_user_id",
      references: {
        model: "user",
        key: "user_id",
      },
    },
    avatar: {
      type: DataTypes.STRING,
      field: "developer_avatar",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "developer_name",
    },
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
      field: "developer_website",
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      field: "developer_email",
    },
    contactNumber: {
      type: DataTypes.STRING,
      field: "developer_contact_no",
    },
    description: {
      type: DataTypes.TEXT,
      field: "developer_description",
    },
  }, {
    tableName: 'developer',
    timestamps: true,
  });

  return Developer;
};