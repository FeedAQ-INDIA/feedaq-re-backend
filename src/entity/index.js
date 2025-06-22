const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false, // logging: false,
    port: dbConfig.port,
    dialectOptions: dbConfig.dialectOptions,
    logging: true,
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
db.PropertyConfiguration = require('./PropertyConfiguration.entity.js')(sequelize, Sequelize);
db.PropertyAttachment = require('./PropertyAttachment.entity.js')(sequelize, Sequelize);
db.ProjectAttachment = require('./ProjectAttachment.entity.js')(sequelize, Sequelize);
db.Project = require('./Project.entity.js')(sequelize, Sequelize);
db.ProjectConfiguration = require('./ProjectConfiguration.entity.js')(sequelize, Sequelize);
db.ProjectFeature = require('./ProjectFeature.entity.js')(sequelize, Sequelize);
db.Developer = require('./Developer.entity.js')(sequelize, Sequelize);
// db.Location = require('./Location.entity.js')(sequelize, Sequelize); // For standardizing locations
db.UserSearchTrack = require('./UserSearchTrack.entity.js')(sequelize, Sequelize);
db.UserFav = require('./UserFav.entity.js')(sequelize, Sequelize);
db.Agent = require('./Agent.entity.js')(sequelize, Sequelize);

db.Agent.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'user',
});


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
db.User.hasOne(db.Agent, {
    foreignKey: 'agentId',
    as: 'agent',
});


db.Property.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'lister',
});
db.Property.hasMany(db.PropertyFeature, {
    foreignKey: 'propertyId',
    as: 'features',
    onDelete: 'CASCADE', // If property is deleted, delete its features
});
db.Property.hasMany(db.PropertyConfiguration, {
    foreignKey: 'propertyId',
    as: 'configurations',
    onDelete: 'CASCADE', // If property is deleted, delete its features
});
db.Property.hasMany(db.PropertyAttachment, {
    foreignKey: 'propertyId',
    as: 'attachment',
    onDelete: 'CASCADE',
});
db.Property.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'project',
    allowNull: true, // A property doesn't *have* to belong to a project
});
db.Property.hasOne(db.UserFav, {
    foreignKey: 'propertyId',
    as: 'fav',
});


db.PropertyFeature.belongsTo(db.Property, {
    foreignKey: 'propertyId',
    as: 'propertyDetails',
});


db.PropertyConfiguration.belongsTo(db.Property, {
    foreignKey: 'propertyId',
    as: 'propertyDetails',
});


db.ProjectFeature.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'projectDetails',
});


db.ProjectConfiguration.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'projectDetails',
});


db.PropertyAttachment.belongsTo(db.Property, {
    foreignKey: 'propertyId',
    as: 'property',
});
db.ProjectAttachment.belongsTo(db.Project, {
    foreignKey: 'projectId',
    as: 'project',
});


db.Project.hasMany(db.ProjectAttachment, {
    foreignKey: 'projectId',
    as: 'attachment',
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
db.Project.hasMany(db.ProjectFeature, {
    foreignKey: 'projectId',
    as: 'features',
    onDelete: 'CASCADE', // If property is deleted, delete its features
});
db.Project.hasMany(db.ProjectConfiguration, {
    foreignKey: 'projectId',
    as: 'configurations',
    onDelete: 'CASCADE', // If property is deleted, delete its features
});


db.Developer.hasMany(db.Project, {
    foreignKey: 'developerId',
    as: 'developedProjects',
});

module.exports = db;
