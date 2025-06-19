// seed.js
require('dotenv').config(); // Load environment variables
const db = require("../entity/index.js");
const bcrypt = require('bcryptjs'); // For hashing user passwords


const sequelize = db.sequelize;

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // WARNING: This will drop and recreate tables

        // --- Create a User ---
        const user = await db.User.create({
            firstName: "John",
            lastName: "Doe",
            nameInitial: "JD",
            email: "john.doe@example.com",
            number: "9876543210",
            profilePic: "https://example.com/profile.jpg",
            isAgent: true,
        });

        // --- Create an Agent for the User ---
        const agent = await db.Agent.create({
            userId: user.userId,
            agentBio: "Experienced real estate professional.",
            agentPhoneNumber: "9876543210",
            agentEmail: "agent.john@example.com",
            agentLicenseNumber: "LIC12345",
            agentExperience: 5,
            agentOperatingSince: "2018",
            agentAgencyName: "Dream Estates",
            agentNameInitial: "JD",
            agentWebsite: "https://johnagent.com",
            agentOfficeAddress: "123 Main Street",
            agentLocality: "Downtown",
            agentCity: "Mumbai",
            agentState: "Maharashtra",
            agentCountry: "India",
            agentAreasServed: ["Andheri", "Bandra"],
            agentSpecializations: ["Residential", "Commercial"],
            agentLanguagesSpoken: ["English", "Hindi"],
            agentIsVerified: true,
            agentPartnerType: "Gold Member",
            addressLine1: "123 Main Street",
            addressLine2: "Suite 100",
            locality: "Downtown",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
            latitude: 19.0760,
            longitude: 72.8777,
        });

        // --- Create a Developer ---
        const developer = await db.Developer.create({
            name: "Skyline Builders",
            website: "https://skylinebuilders.com",
            email: "contact@skyline.com",
            contactNumber: "9123456780",
            description: "Top-notch quality in real estate development.",
        });

        // --- Create a Project ---
        const project = await db.Project.create({
            name: "Skyview Residency",
            description: "Luxury apartments in the heart of the city.",
            status: "ready_to_move",
            expectedCompletionDate: "2024-12-31",
            totalLandArea: 5.5,
            landAreaUnit: "acre",
            projectConfiguration: { "2BHK": 50, "3BHK": 30 },
            projectUnitDetail: { lifts: 4, parking: true },
            projectAdditionalDetail: ["Clubhouse", "Pool"],
            numberOfTowers: 3,
            reraRegistrationNumber: "RERA123456",
            projectAmenities: ["Gym", "Garden", "Children Play Area"],
            developerId: developer.id,
            addressLine1: "NH8, Goregaon East",
            addressLine2: "Near Oberoi Mall",
            locality: "Goregaon",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400063",
            country: "India",
            latitude: 19.1738,
            longitude: 72.8600,
        });

        // --- Create a Property linked to User and Project ---
        const property = await db.Property.create({
            title: "2 BHK at Skyview",
            description: "Spacious and well-lit apartment.",
            transactionType: "buy",
            category: "residential",
            propertyType: "apartment",
            price: 12000000,
            bhkType: "2_bhk",
            bedrooms: 2,
            bathrooms: 2,
            balconies: 1,
            carpetArea: 800,
            builtupArea: 950,
            superBuiltupArea: 1100,
            furnishingStatus: "semi_furnished",
            constructionStatus: "ready_to_move",
            possessionDate: "2024-01-01",
            ageOfProperty: "1_5_years",
            floorNumber: 5,
            totalFloors: 15,
            facing: "east",
            ownershipType: "freehold",
            preferredTenants: ["family"],
            availabilityDate: "2024-07-01",
            isVerified: true,
            hasVirtualTour: true,
            userId: user.userId,
            projectId: project.id,
            addressLine1: "Tower A, Flat 502",
            locality: "Goregaon",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400063",
            country: "India",
            latitude: 19.1738,
            longitude: 72.8600,
        });

        // --- Add Property Feature ---
        await db.PropertyFeature.create({
            featureName: "Swimming Pool",
            featureValue: "Yes",
            propertyId: property.id,
        });

        // --- Add Property Attachment ---
        await db.PropertyAttachment.create({
            url: "https://example.com/property-image.jpg",
            isPrimary: true,
            caption: "Living Room",
            type: "IMAGE",
            propertyId: property.id,
        });

        console.log("✅ Dummy data inserted successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};


module.exports={
    seed
}
