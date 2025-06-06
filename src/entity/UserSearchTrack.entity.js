// models/propertyImage.js
module.exports = (sequelize, DataTypes) => {
    const UserSearchTrack = sequelize.define('usersearchtrack', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "usersearchtrack_id",
        },
        propertyId: {
            type: DataTypes.INTEGER,
            field: "usersearchtrack_property_id",
            references: {
                model: "property",
                key: "property_id",
            },
        },
        projectId: {
            type: DataTypes.INTEGER,
            field: "usersearchtrack_project_id",
            references: {
                model: "project",
                key: "project_id",
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            field: "usersearchtrack_user_id",
            references: {
                model: "user",
                key: "user_id",
            },
        },
        developerId: {
            type: DataTypes.INTEGER,
            field: "usersearchtrack_developer_id",
            references: {
                model: "developer",
                key: "developer_id",
            },
        },
        isContacted: {
            type: DataTypes.BOOLEAN,
            field: "usersearchtrack_is_contacted",
            defaultValue: false,
        },
    }, {
        tableName: 'usersearchtrack',
        timestamps: true, // When the image was added
    });

    return UserSearchTrack;
};