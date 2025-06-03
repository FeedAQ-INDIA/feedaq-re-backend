// models/propertyImage.js
module.exports = (sequelize, DataTypes) => {
  const PropertyImage = sequelize.define('PropertyImage', {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    isPrimary: { // To set one image as the main display image
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    caption: {
      type: DataTypes.STRING(255),
    },
    // propertyId will be added by association
  }, {
    tableName: 'property_images',
    timestamps: true, // When the image was added
  });

  return PropertyImage;
};