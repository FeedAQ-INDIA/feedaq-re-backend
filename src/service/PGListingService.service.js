const {Op, fn, col, QueryTypes} = require("sequelize");
const db = require("../entity/index.js");
const lodash = require("lodash");
const logger = require("../config/winston.config.js");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {toJSON} = require("lodash/seq");



async function savePG(req) {
    const data = req.body;

    try {
        const {
            id,
             title,
            description,
            rules,
             gender,
             operatingSince,
            suitedFor,
            isMealAvailable,
            mealDetail,
            brandName,
            pgContact,
            pgEmail,
            pgName,
            mapReferenceId,
            mapReferenceAddress,
            addressLine1,
            addressLine2,
            locality,
            city,
            state,
             country,
            latitude,
            longitude
        } = data;



        const pgPayload = {
             userId: req.user?.userId,
            title,
            description,
            rules,
            gender,
             operatingSince,
            suitedFor,
            isMealAvailable,
            mealDetail,
            brandName,
            pgContact,
            pgEmail,
            pgName,
            mapReferenceId,
            mapReferenceAddress,
            addressLine1,
            addressLine2,
            locality,
            city,
            state,
             country,
            latitude,
            longitude,
         };

        let result;

        if (id) {
            // UPDATE
            const [updatedCount] = await db.PG.update(pgPayload, {
                where: { id: id },
            });

            if (updatedCount === 0) {
                throw new Error('PG not found or no changes made.');
            }

            result = await db.PG.findByPk(id); // Fetch the updated record
        } else {
            // CREATE
            result = await db.PG.create(pgPayload);
        }

        return {
            success: true,
            message: id ? 'PG updated successfully' : 'PG created successfully',
            data: result,
        };
    } catch (error) {
        console.error('Error in saveOrEditPG:', error);
        return {
            success: false,
            message: error.message || 'Failed to save PG',
        };
    }
}



async function savePGAttachment(req) {
    const data = req.body;

    try {
        const {
            id, // pgattach_id
            url,
            isPrimary,
            caption,
            type,
            pgId,
            pgRoomId
        } = data;

        const attachmentPayload = {
            url,
            isPrimary,
            caption,
            type,
            pgId,
            pgRoomId,
        };

        let result;

        if (id) {
            // UPDATE existing record
            const [updatedCount] = await db.PGAttachment.update(attachmentPayload, {
                where: { id },
            });

            if (updatedCount === 0) {
                throw new Error('Attachment not found or no changes made.');
            }

            result = await db.PGAttachment.findByPk(id); // Return updated data
        } else {
            // CREATE new record
            result = await db.PGAttachment.create(attachmentPayload);
        }

        return {
            success: true,
            message: id ? 'Attachment updated successfully' : 'Attachment created successfully',
            data: result,
        };
    } catch (error) {
        console.error('Error in saveOrEditPGAttachment:', error);
        return {
            success: false,
            message: error.message || 'Failed to save attachment',
        };
    }
}

async function savePGFeature(req) {
    const data = req.body;

    try {
        const {
            id, // pgfeature_id
            featureKey,
            featureCategory,
            featureName,
            featureValue,
            pgId,
            pgRoomId
        } = data;

        const featurePayload = {
            featureKey,
            featureCategory,
            featureName,
            featureValue,
            pgId,
            pgRoomId
        };

        let result;

        if (id) {
            // UPDATE
            const [updatedCount] = await db.PGFeature.update(featurePayload, {
                where: { id },
            });

            if (updatedCount === 0) {
                throw new Error('Feature not found or no changes made.');
            }

            result = await db.PGFeature.findByPk(id);
        } else {
            // CREATE
            result = await db.PGFeature.create(featurePayload);
        }

        return {
            success: true,
            message: id ? 'Feature updated successfully' : 'Feature created successfully',
            data: result,
        };
    } catch (error) {
        console.error('Error in saveOrEditPGFeature:', error);
        return {
            success: false,
            message: error.message || 'Failed to save feature',
        };
    }
}

async function savePGRoom(req) {
    const rooms = req.body; // Expecting an array of room objects

    if (!Array.isArray(rooms)) {
        return {
            success: false,
            message: 'Invalid input: expected an array of room objects',
        };
    }

    const results = [];

    for (const roomData of rooms) {
        try {
            const {
                id,
                pgId,
                additionalPrice,
                availableFrom,
                isAirConditioned,
                furnishingStatus,
                occupancyLimit,
                price,
                area,
                areaUnit,
                roomType,
                title,
                description
            } = roomData;

            const roomPayload = {
                pgId,
                additionalPrice,
                availableFrom,
                isAirConditioned,
                furnishingStatus,
                occupancyLimit,
                price,
                area,
                areaUnit,
                roomType,
                title,
                description
            };

            let result;

            if (id) {
                // UPDATE
                const [updatedCount] = await db.PGRoom.update(roomPayload, {
                    where: { id }
                });

                if (updatedCount === 0) {
                    throw new Error('Room not found or no changes made.');
                }

                result = await db.PGRoom.findByPk(id);
            } else {
                // CREATE
                result = await db.PGRoom.create(roomPayload);
            }

            results.push({
                success: true,
                message: id ? 'Room updated successfully' : 'Room created successfully',
                data: result,
            });

        } catch (error) {
            console.error('Error saving room:', error);
            results.push({
                success: false,
                message: error.message || 'Failed to save room',
                data: roomData,
            });
        }
    }

    return {
        success: true,
        message: 'Room save operation completed',
        results,
    };
}




module.exports = {
    savePGFeature, savePGRoom, savePGAttachment, savePG

};

