// models/projectImage.js
module.exports = (sequelize, DataTypes) => {
  const ProjectAttachment = sequelize.define('projectattach', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "projectattach_id",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      field: "projectattach_image_url",
    },
    isPrimary: { // To set one image as the main display image
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "projectattach_is_primary",
    },
    order: { // To set one image as the main display image
      type: DataTypes.INTEGER,
      field: "projectattach_order",
    },
    caption: {
      type: DataTypes.STRING(255),
      field: "projectattach_caption",
    },
    type: {
      type: DataTypes.ENUM('IMAGE', 'VIDEO', 'SHORTS', 'DOCS'),
      field: "projectattach_type",
      defaultValue:null
    },


    projectId: {
      type: DataTypes.INTEGER,
      field: "projectattach_project_id",
      references: {
        model: "project",
        key: "project_id",
      },
    },
   }, {
    tableName: 'projectattach',
    timestamps: true, // When the image was added
  });

  return ProjectAttachment;
};