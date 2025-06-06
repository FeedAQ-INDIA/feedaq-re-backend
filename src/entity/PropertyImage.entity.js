// models/propertyImage.js
module.exports = (sequelize, DataTypes) => {
  const PropertyImage = sequelize.define('propertyimage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "propertyimage_id",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      field: "propertyimage_image_url",
    },
    isPrimary: { // To set one image as the main display image
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyimage_is_primary",
    },
    caption: {
      type: DataTypes.STRING(255),
      field: "propertyimage_caption",
    },
    propertyId: {
      type: DataTypes.INTEGER,
      field: "propertyimage_property_id",
      references: {
        model: "property",
        key: "property_id",
      },
    },

    projectId: {
      type: DataTypes.INTEGER,
      field: "propertyimage_project_id",
      references: {
        model: "project",
        key: "project_id",
      },
    },
    // propertyId will be added by association
  }, {
    tableName: 'propertyimage',
    timestamps: true, // When the image was added
  });

  return PropertyImage;
};