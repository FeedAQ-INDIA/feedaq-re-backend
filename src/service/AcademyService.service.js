const {Op, fn, col, QueryTypes} = require("sequelize");
const db = require("../entity/index.js");
const lodash = require("lodash");
const logger = require("../config/winston.config.js");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {toJSON} = require("lodash/seq");


const saveUserDetail = async (
    userId,
    firstName,
    lastName,
    number,
    profilePic,
) => {
    const userData = await db.User.findByPk(userId);

    if (!userData) throw new Error("User not found"); // Handle case where user is not found

    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.number = number;
    userData.profilePic = profilePic;

    await userData.save();
    return {message: 'User saved successfully'};
};

const saveUserSearchTrack = async (
    userId,
    propertyId = null,
    projectId = null,
    developerId = null,
    isContacted = false
) => {
    const t = await db.sequelize.transaction();

    try {
        const whereClause = {
            userId,
            ...(propertyId && {propertyId}), ...(developerId && {developerId}),
            ...(projectId && {projectId}),
        };

        const existingTrack = await db.UserSearchTrack.findOne({
            where: whereClause,
            lock: t.LOCK.UPDATE, // Lock the row
            transaction: t,
        });

        if (existingTrack) {
            existingTrack.count += 1;
            existingTrack.createdAt = new Date();
            existingTrack.isContacted = isContacted;
            await existingTrack.save({ transaction: t });
        } else {
            await db.UserSearchTrack.create(
                {
                    userId,
                    propertyId,
                    projectId,
                    developerId,
                    isContacted,
                    count: 1,
                },
                { transaction: t }
            );
        }

        await t.commit();
        return { message: existingTrack ? "Updated" : "Inserted" };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};




const saveUserFav = async (
    userId,
    propertyId,
    projectId,
    developerId,
 ) => {
    const userData = await db.User.findByPk(userId);

    if (!userData) throw new Error("User not found"); // Handle case where user is not found

    const [res, created] = await db.UserFav.findOrCreate({
        where:{
            propertyId,
            userId,
         },
        defaults:{
            propertyId,
            projectId,
            userId,
            developerId,
        }
    })

    return {message: 'User Fav saved successfully', data: res};
};


const deleteUserFav = async (
    userId,
    favId
) => {
    const userData = await db.User.findByPk(userId);

    if (!userData) throw new Error("User not found"); // Handle case where user is not found

    await db.UserFav.destroy({
        where:{
            id: favId,
        }
    })

    return {message: 'User Fav deleted successfully'};
};



const getInitials = (name) => {
    const trimmedName = name.trim();

    if (!trimmedName.includes(" ")) {
        return trimmedName.slice(0, 2).toUpperCase();
    }

    const words = trimmedName.split(" ").filter(word => word.length > 0);
    const initials = words.map(word => word.charAt(0).toUpperCase()).join("");

    return initials.slice(0, 2);
};

const registerAgent = async (
    userId,
    avatar,
    agentBio,
    agentPhoneNumber,
    agentEmail,
    agentLicenseNumber,
    agentExperience,
    agentAgencyName,
    agentWebsite,
    agentOfficeAddress,
    agentCity,
    agentState,
    agentCountry,
    agentAreasServed,
    agentSpecializations,
    agentLanguagesSpoken,
    latitude,
    longitude
) => {


    const [res, created] = await db.Agent.findOrCreate({
        where:{
            userId,
        },
        defaults:{
            userId,
            avatar,
            agentBio,
            agentPhoneNumber,
            agentEmail,
            agentLicenseNumber,
            agentExperience,
            agentAgencyName,
            agentWebsite,
            agentOfficeAddress,
            agentCity,
            agentState,
            agentCountry,
            agentAreasServed,
            agentSpecializations,
            agentLanguagesSpoken,
            latitude,
            longitude,
            agentNameInitial: getInitials(agentAgencyName)
        }
    })

    if(created){
        const userRes = await db.User.findByPk(userId);
        if(userRes){
            userRes.agentId = res.agentId;
            userRes.isAgent = true;
            await userRes.save();
        }
    }

    return {message: 'Agent registered successfully', data: res};
};



const getUser = async (userId) => {
    const userData = await db.User.findByPk(userId);

    if (!userData) throw new Error("User not found"); // Handle case where user is not found

    return userData.toJSON();
};




const searchRecord = async (req, res) => {
    try {
        const {limit, offset, getThisData} = req.body;

        // Prepare query options
        const queryOptions = {
            limit: limit || 10,
            offset: offset || 0,
            include: parseIncludes(getThisData)?.include,
            where: buildWhereClause(getThisData.where || {}),
            order: getThisData.order || [], ...(!lodash.isEmpty(getThisData.attributes) && {
                attributes: getThisData.attributes,
            }),
        };

        if (!lodash.isEmpty(getThisData.attributes)) {
            let a = [];
            getThisData.attributes.forEach((attr) => {
                // Check if attr is an array indicating a function
                if (Array.isArray(attr) && attr.length === 2 && attr[0] === "DISTINCT") {
                    a.push([fn("DISTINCT", col(attr[1])), attr[1]]); // Handle the DISTINCT case
                }
            });
            console.log(a.length);
            if (a && !lodash.isEmpty(a)) {
                queryOptions.attributes = a;
                console.log("if", JSON.stringify(queryOptions));
            } else {
                console.log("elsse");
            }
        }

        console.log(JSON.stringify(queryOptions));

        // Fetch the data from the database
        const {count, rows} = await lodash
            .get(db, getThisData.datasource)
            .findAndCountAll({...queryOptions, distinct: true});
        console.log(rows);
        return {
            results: rows, totalCount: count, limit, offset,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

const buildWhereClause = (conditions) => {
    const where = {};

    for (const [key, value] of Object.entries(conditions)) {
        // Handle $and and $or at the top level
        if (key === "$and" || key === "$or") {
            where[Op[key.slice(1)]] = value.map((subCondition) => buildWhereClause(subCondition));
        }
        // Handle regular conditions
        else if (value && typeof value === "object" && !Array.isArray(value)) {
            // Define operator mapping
            const operatorMapping = {
                $eq: Op.eq,
                $ne: Op.ne,
                $gt: Op.gt,
                $lt: Op.lt,
                $gte: Op.gte,
                $lte: Op.lte,
                $between: Op.between,
                $like: Op.like,
                $notLike: Op.notLike,
                $in: Op.in,
                $notIn: Op.notIn,
                $is: Op.is,
            };

            // Apply operator mapping for individual field conditions
            where[key] = Object.entries(value).reduce((acc, [op, val]) => {
                if (operatorMapping[op] !== undefined) {
                    acc[operatorMapping[op]] = val;
                }
                return acc;
            }, {});
        } else {
            // Handle null and simple values for non-object types
            where[key] = value !== null ? value : {[Op.is]: null};
        }
    }

    return where;
};

const parseIncludes = (data) => {
    console.log(data);
    const {datasource, as, where, order, include, required, attributes} = data;
    console.log("key :: ", lodash.get(db, datasource), "::  req", required);

    let parsedInclude = {
        model: lodash.get(db, datasource),
        as: as,
        where: buildWhereClause(where || {}),
        order: order || [],
        required: required || false, ...(!lodash.isEmpty(attributes) && {attributes: attributes}),
    };

    if (!lodash.isEmpty(attributes)) {
        let a = [];
        attributes.forEach((attr) => {
            // Check if attr is an array indicating a function
            if (Array.isArray(attr) && attr.length === 2 && attr[0] === "DISTINCT") {
                a.push([fn("DISTINCT", col(attr[1])), attr[1]]); // Handle the DISTINCT case
            }
        });
        console.log(a.length);
        if (a && !lodash.isEmpty(a)) {
            parsedInclude.attributes = a;
        }
    }

    if (include && include.length) {
        parsedInclude.include = include.map((subInclude) => parseIncludes(subInclude));
    }

    return parsedInclude;
};


module.exports = {
    getUser,
    searchRecord,
    deleteUserFav,
    saveUserFav,
    saveUserDetail,
    saveUserSearchTrack,
    registerAgent
};

