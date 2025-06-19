// models/propertyFeature.js
module.exports = (sequelize, DataTypes) => {
    const Feature = sequelize.define('feature', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "feature_id",
        },
        name: {
            type: DataTypes.STRING(30),
            defaultValue: false,
            field: "feature_name",
        },
        dataType: {
            type: DataTypes.ENUM('boolean', 'number', 'text'),
            allowNull: false,
            defaultValue: 'boolean',
            field: 'feature_data_type',
        },
    }, {
        tableName: 'feature',
        timestamps: false, // Features are typically part of property creation
    });

    return Feature;
};