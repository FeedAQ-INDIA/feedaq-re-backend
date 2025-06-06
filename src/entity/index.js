const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false, // logging: false,
    port: dbConfig.port,
    dialectOptions: dbConfig.dialectOptions,
    pool: {
        max: dbConfig.pool.max, min: dbConfig.pool.min, acquire: dbConfig.pool.acquire, idle: dbConfig.pool.idle,
    },
    define: {
        freezeTableName: true, // Applies to all models
        timestamps: true,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Entities
db.User = require("./User.entity.js")(sequelize, Sequelize);
db.Property = require('./Property.entity.js')(sequelize, Sequelize);
db.PropertyFeature = require('./PropertyFeature.entity.js')(sequelize, Sequelize);
db.PropertyImage = require('./PropertyImage.entity.js')(sequelize, Sequelize);
db.Project = require('./Project.entity.js')(sequelize, Sequelize);
db.Developer = require('./Developer.entity.js')(sequelize, Sequelize);
db.Location = require('./Location.entity.js')(sequelize, Sequelize); // For standardizing locations
db.UserSearchTrack = require('./UserSearchTrack.entity.js')(sequelize, Sequelize);
db.UserFav = require('./UserFav.entity.js')(sequelize, Sequelize);

db.UserFav.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'user',
});
db.UserFav.belongsTo(db.Property, {
    foreignKey: 'propertyId',
    as: 'property',
});
db.UserFav.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'project',
});
db.UserFav.belongsTo(db.Developer, {
    foreignKey: 'developerId',
    as: 'developer',
});


db.UserSearchTrack.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'user',
});
db.UserSearchTrack.belongsTo(db.Property, {
    foreignKey: 'propertyId',
    as: 'property',
});
db.UserSearchTrack.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'project',
});
db.UserSearchTrack.belongsTo(db.Developer, {
    foreignKey: 'developerId',
    as: 'developer',
});


db.User.hasMany(db.Property, {
    foreignKey: 'userId',
    as: 'listedProperties',
});



db.Property.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'lister',
});
db.Property.hasOne(db.PropertyFeature, {
    foreignKey: 'propertyId',
    as: 'features',
    onDelete: 'CASCADE', // If property is deleted, delete its features
});
db.Property.hasMany(db.PropertyImage, {
    foreignKey: 'propertyId',
    as: 'images',
    onDelete: 'CASCADE',
});
db.Property.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'project',
    allowNull: true, // A property doesn't *have* to belong to a project
});
db.Property.belongsTo(db.Location, {
    foreignKey: 'locationId',
    as: 'locatedIn',
});
db.Property.hasOne(db.UserFav, {
    foreignKey: 'propertyId',
    as: 'fav',
});



db.PropertyFeature.belongsTo(db.Property, {
    foreignKey: 'propertyId',
    as: 'propertyDetails',
});



db.PropertyImage.belongsTo(db.Property, {
    foreignKey: 'propertyId',
    as: 'property',
});
db.PropertyImage.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'project',
});



db.Project.hasMany(db.PropertyImage, {
    foreignKey: 'projectId',
    as: 'images',
    onDelete: 'CASCADE',
});
db.Project.hasMany(db.Property, {
    foreignKey: 'projectId',
    as: 'units',
});
db.Project.belongsTo(db.Developer, {
    foreignKey: 'developerId',
    as: 'developer',
});


db.Developer.hasMany(db.Project, {
    foreignKey: 'developerId',
    as: 'developedProjects',
});


db.Location.hasMany(db.Property, {
    foreignKey: 'locationId',
    as: 'propertiesInLocation',
});



module.exports = db;
