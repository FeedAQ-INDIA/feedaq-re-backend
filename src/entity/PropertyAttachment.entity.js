// models/propertyImage.js
module.exports = (sequelize, DataTypes) => {
  const PropertyAttachment = sequelize.define('propertyattach', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "propertyattach_id",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      field: "propertyattach_image_url",
    },
    isPrimary: { // To set one image as the main display image
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "propertyattach_is_primary",
    },
    caption: {
      type: DataTypes.STRING(255),
      field: "propertyattach_caption",
    },
    type: {
      type: DataTypes.ENUM('IMAGE', 'VIDEO', 'SHORTS', 'DOCS'),
      field: "propertyattach_type",
      defaultValue:null
    },
    propertyId: {
      type: DataTypes.INTEGER,
      field: "propertyattach_property_id",
      references: {
        model: "property",
        key: "property_id",
      },
    },

    projectId: {
      type: DataTypes.INTEGER,
      field: "propertyattach_project_id",
      references: {
        model: "project",
        key: "project_id",
      },
    },
    // propertyId will be added by association
  }, {
    tableName: 'propertyattach',
    timestamps: true, // When the image was added
  });

  return PropertyAttachment;
};