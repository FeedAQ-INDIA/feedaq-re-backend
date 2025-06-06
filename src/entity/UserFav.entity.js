// models/propertyImage.js
module.exports = (sequelize, DataTypes) => {
    const UserFav = sequelize.define('userfav', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "userfav_id",
        },
        propertyId: {
            type: DataTypes.INTEGER,
            field: "userfav_property_id",
            references: {
                model: "property",
                key: "property_id",
            },
        },
        projectId: {
            type: DataTypes.INTEGER,
            field: "userfav_project_id",
            references: {
                model: "project",
                key: "project_id",
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            field: "userfav_user_id",
            references: {
                model: "user",
                key: "user_id",
            },
        },
        developerId: {
            type: DataTypes.INTEGER,
            field: "userfav_developer_id",
            references: {
                model: "developer",
                key: "developer_id",
            },
        },
    }, {
        tableName: 'userfav',
        timestamps: true, // When the image was added
    });

    return UserFav;
};