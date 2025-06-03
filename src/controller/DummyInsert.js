// seed.js
require('dotenv').config(); // Load environment variables
const db = require("../entity/index.js");
const bcrypt = require('bcryptjs'); // For hashing user passwords

async function seedDatabase() {
    try {
        // --- 1. Sync Database (Optional but good for ensuring tables are there) ---
        console.log('Syncing database...');
        await db.sequelize.sync({ alter: true }); // Ensure tables and columns are up-to-date
        console.log('Database synced.');

        // --- 2. Clear Existing Data (Optional - useful for fresh seeds) ---
        console.log('Clearing existing data...');
        await db.PropertyImage.destroy({ truncate: true, cascade: true });
        await db.PropertyFeature.destroy({ truncate: true, cascade: true });
        await db.Property.destroy({ truncate: true, cascade: true });
        await db.Project.destroy({ truncate: true, cascade: true });
        await db.Developer.destroy({ truncate: true, cascade: true });
        await db.Location.destroy({ truncate: true, cascade: true });
        await db.User.destroy({ truncate: true, cascade: true });
        console.log('Existing data cleared.');

        // --- 3. Create Users ---
        console.log('Creating users...');
        const hashedPassword1 = await bcrypt.hash('password123', 10);
        const hashedPassword2 = await bcrypt.hash('agentpass', 10);
        const hashedPassword3 = await bcrypt.hash('devpass', 10);

        const user1 = await db.User.create({
            firstName: 'Aman',
            lastName: 'Sharma',
            email: 'aman.sharma@example.com',
            password: hashedPassword1,
            phoneNumber: '9876543210',
            userType: 'individual',
        });

        const user2 = await db.User.create({
            firstName: 'Priya',
            lastName: 'Singh',
            email: 'priya.singh@example.com',
            password: hashedPassword2,
            phoneNumber: '9988776655',
            userType: 'agent',
        });

        const user3 = await db.User.create({
            firstName: 'Rahul',
            lastName: 'Verma',
            email: 'rahul.verma@example.com',
            password: hashedPassword3,
            phoneNumber: '9123456789',
            userType: 'developer', // This user could represent the developer company itself
        });
        console.log('Users created.');

        // --- 4. Create Locations ---
        console.log('Creating locations...');
        // Jamshedpur specific locations
        const locationSakchi = await db.Location.create({
            addressLine1: 'Road No 1',
            locality: 'Sakchi',
            city: 'Jamshedpur',
            state: 'Jharkhand',
            zipCode: '831001',
            latitude: 22.8018, // Example: Sakchi center
            longitude: 86.2029,
        });

        const locationKadma = await db.Location.create({
            addressLine1: 'Bistupur Main Road',
            locality: 'Kadma',
            city: 'Jamshedpur',
            state: 'Jharkhand',
            zipCode: '831005',
            latitude: 22.7937, // Example: Kadma center
            longitude: 86.1772,
        });

        const locationTelco = await db.Location.create({
            addressLine1: 'Telco Colony',
            locality: 'Telco',
            city: 'Jamshedpur',
            state: 'Jharkhand',
            zipCode: '831004',
            latitude: 22.8350, // Example: Telco center
            longitude: 86.1990,
        });

        const locationSonari = await db.Location.create({
            addressLine1: 'Riverside View',
            locality: 'Sonari',
            city: 'Jamshedpur',
            state: 'Jharkhand',
            zipCode: '831011',
            latitude: 22.7845, // Example: Sonari center
            longitude: 86.1601,
        });

        const locationAdityapur = await db.Location.create({
            addressLine1: 'Adityapur Road',
            locality: 'Adityapur',
            city: 'Adityapur', // Different city
            state: 'Jharkhand',
            zipCode: '832108',
            latitude: 22.7750, // Example: Adityapur center
            longitude: 86.1250,
        });
        console.log('Locations created.');

        // --- 5. Create Developers ---
        console.log('Creating developers...');
        const developer1 = await db.Developer.create({
            name: 'Tata Realty',
            website: 'https://tatarealty.in',
            email: 'info@tatarealty.in',
            contactNumber: '011-1234567',
            description: 'Leading real estate developer in India.',
        });

        const developer2 = await db.Developer.create({
            name: 'DLF Limited',
            website: 'https://www.dlf.in',
            email: 'contact@dlf.in',
            contactNumber: '022-9876543',
            description: 'Renowned for luxury residential and commercial properties.',
        });
        console.log('Developers created.');

        // --- 6. Create Projects ---
        console.log('Creating projects...');
        const project1 = await db.Project.create({
            name: 'Riverside Enclave',
            description: 'Modern apartments with river views.',
            status: 'under_construction',
            expectedCompletionDate: '2026-12-31',
            totalLandArea: 15.50,
            landAreaUnit: 'acre',
            numberOfTowers: 5,
            reraRegistrationNumber: 'RERA/JHD/123/2024',
            projectAmenities: ['Clubhouse', 'Swimming Pool', 'Gym', 'Kids Play Area', 'Yoga Deck'],
            developerId: developer1.id,
        });

        const project2 = await db.Project.create({
            name: 'Green City Villas',
            description: 'Spacious villas in a serene green environment.',
            status: 'newly_launched',
            expectedCompletionDate: '2028-06-30',
            totalLandArea: 25.00,
            landAreaUnit: 'acre',
            numberOfTowers: 0, // For villas, can be 0 or small
            reraRegistrationNumber: 'RERA/JHD/456/2025',
            projectAmenities: ['Clubhouse', 'Parks', 'Jogging Track', 'Sports Facilities'],
            developerId: developer2.id,
        });

        const project3 = await db.Project.create({
            name: 'Harmony Towers',
            description: 'Ready to move apartments in prime locality.',
            status: 'ready_to_move',
            expectedCompletionDate: '2024-03-01', // Already passed, implying RTM
            totalLandArea: 8.20,
            landAreaUnit: 'acre',
            numberOfTowers: 3,
            reraRegistrationNumber: 'RERA/JHD/789/2023',
            projectAmenities: ['Lift', 'Power Backup', 'Security', 'Community Hall'],
            developerId: developer1.id,
        });
        console.log('Projects created.');

        // --- 7. Create Properties (Mixing Individual and Project Units) ---
        console.log('Creating properties...');

        // --- Individual Properties ---
        const prop1 = await db.Property.create({
            title: 'Spacious 3 BHK Apartment in Sakchi',
            description: 'Well-maintained apartment near Jubilee Park.',
            transactionType: 'buy',
            propertyType: 'apartment',
            price: 7500000.00, // 75 Lacs
            bhkType: '3_bhk',
            bedrooms: 3,
            bathrooms: 2,
            carpetArea: 1200,
            builtupArea: 1400,
            furnishingStatus: 'semi_furnished',
            constructionStatus: 'ready_to_move',
            ageOfProperty: '5_10_years',
            floorNumber: 4,
            totalFloors: 8,
            facing: 'east',
            ownershipType: 'freehold',
            userId: user1.id,
            locationId: locationSakchi.id,
        });

        const prop2 = await db.Property.create({
            title: 'Independent 4 BHK Villa in Kadma',
            description: 'Luxury villa with private garden, ideal for families.',
            transactionType: 'buy',
            propertyType: 'independent_house',
            price: 18000000.00, // 1.8 Crore
            bhkType: '4_bhk',
            bedrooms: 4,
            bathrooms: 4,
            carpetArea: 2500,
            builtupArea: 3000,
            areaUnit: 'sq_ft',
            furnishingStatus: 'furnished',
            constructionStatus: 'ready_to_move',
            ageOfProperty: '1_5_years',
            facing: 'north_east',
            ownershipType: 'freehold',
            userId: user1.id,
            locationId: locationKadma.id,
        });

        const prop3 = await db.Property.create({
            title: '2 BHK Apartment for Rent in Telco Colony',
            description: 'Cozy apartment, walking distance to market.',
            transactionType: 'rent',
            propertyType: 'apartment',
            rent: 18000.00,
            bhkType: '2_bhk',
            bedrooms: 2,
            bathrooms: 1,
            carpetArea: 800,
            furnishingStatus: 'unfurnished',
            constructionStatus: 'ready_to_move',
            ageOfProperty: '10_20_years',
            floorNumber: 2,
            totalFloors: 5,
            availabilityDate: '2025-07-01',
            preferredTenants: ['family'],
            securityDeposit: 36000.00,
            userId: user2.id, // Listed by an agent
            locationId: locationTelco.id,
        });

        const prop4 = await db.Property.create({
            title: 'Residential Plot in Sonari',
            description: 'Prime plot for building your dream home, near river.',
            transactionType: 'buy',
            propertyType: 'residential_plot',
            price: 5000000.00, // 50 Lacs
            carpetArea: 1500, // Plot area
            areaUnit: 'sq_ft',
            constructionStatus: 'ready_to_move', // Plots are usually RTM
            ageOfProperty: 'new',
            ownershipType: 'freehold',
            userId: user1.id,
            locationId: locationSonari.id,
        });

        const prop5 = await db.Property.create({
            title: 'Studio Apartment for Rent in Adityapur',
            description: 'Compact and modern studio, ideal for bachelors.',
            transactionType: 'rent',
            propertyType: 'studio_apartment',
            rent: 10000.00,
            bhkType: '1_rk',
            bedrooms: 0, // Studio apartments might have 0 or 1 bedroom concept
            bathrooms: 1,
            carpetArea: 350,
            furnishingStatus: 'furnished',
            constructionStatus: 'ready_to_move',
            ageOfProperty: '1_5_years',
            floorNumber: 3,
            totalFloors: 6,
            availabilityDate: '2025-06-15',
            preferredTenants: ['bachelors_male', 'bachelors_female'],
            securityDeposit: 20000.00,
            userId: user2.id,
            locationId: locationAdityapur.id,
        });

        // --- Properties within Projects ---
        const prop6 = await db.Property.create({
            title: '3 BHK in Riverside Enclave',
            description: 'Brand new unit in a premium project by Tata Realty.',
            transactionType: 'buy',
            propertyType: 'apartment',
            price: 9500000.00, // 95 Lacs
            bhkType: '3_bhk',
            bedrooms: 3,
            bathrooms: 3,
            carpetArea: 1350,
            superBuiltupArea: 1700,
            furnishingStatus: 'unfurnished',
            constructionStatus: 'under_construction', // Unit specific status
            possessionDate: '2026-12-31',
            floorNumber: 7,
            totalFloors: 12,
            facing: 'south_east',
            ownershipType: 'freehold',
            userId: user3.id, // Listed by developer user
            locationId: locationSonari.id, // Project location
            projectId: project1.id,
        });

        const prop7 = await db.Property.create({
            title: '4 BHK Villa in Green City Villas',
            description: 'Luxury villa unit in a sprawling township.',
            transactionType: 'buy',
            propertyType: 'villa',
            price: 25000000.00, // 2.5 Crore
            bhkType: '4_bhk',
            bedrooms: 4,
            bathrooms: 5,
            carpetArea: 3000,
            builtupArea: 3800,
            furnishingStatus: 'unfurnished',
            constructionStatus: 'under_construction',
            possessionDate: '2028-06-30',
            facing: 'north',
            ownershipType: 'freehold',
            userId: user3.id,
            locationId: locationKadma.id, // Project location
            projectId: project2.id,
        });

        const prop8 = await db.Property.create({
            title: '2 BHK Ready to Move in Harmony Towers',
            description: 'Excellent RTM flat with all amenities.',
            transactionType: 'buy',
            propertyType: 'apartment',
            price: 6800000.00, // 68 Lacs
            bhkType: '2_bhk',
            bedrooms: 2,
            bathrooms: 2,
            carpetArea: 950,
            superBuiltupArea: 1200,
            furnishingStatus: 'semi_furnished',
            constructionStatus: 'ready_to_move',
            possessionDate: '2024-03-01',
            ageOfProperty: 'new',
            floorNumber: 5,
            totalFloors: 10,
            facing: 'west',
            ownershipType: 'freehold',
            userId: user3.id,
            locationId: locationTelco.id, // Project location
            projectId: project3.id,
        });

        const prop9 = await db.Property.create({
            title: 'Penthouse with Terrace in Harmony Towers',
            description: 'Exclusive top-floor penthouse with panoramic views.',
            transactionType: 'buy',
            propertyType: 'penthouse',
            price: 15000000.00, // 1.5 Crore
            bhkType: '4_bhk',
            bedrooms: 4,
            bathrooms: 4,
            carpetArea: 2000,
            superBuiltupArea: 2500,
            furnishingStatus: 'unfurnished',
            constructionStatus: 'ready_to_move',
            possessionDate: '2024-03-01',
            ageOfProperty: 'new',
            floorNumber: 10,
            totalFloors: 10,
            facing: 'east',
            ownershipType: 'freehold',
            userId: user3.id,
            locationId: locationTelco.id, // Project location
            projectId: project3.id,
        });

        const prop10 = await db.Property.create({
            title: '1 BHK Apartment for Rent in Harmony Towers',
            description: 'Compact apartment in a great society for bachelors.',
            transactionType: 'rent',
            propertyType: 'apartment',
            rent: 15000.00,
            bhkType: '1_bhk',
            bedrooms: 1,
            bathrooms: 1,
            carpetArea: 550,
            furnishingStatus: 'semi_furnished',
            constructionStatus: 'ready_to_move',
            ageOfProperty: 'new',
            floorNumber: 6,
            totalFloors: 10,
            availabilityDate: '2025-06-05',
            preferredTenants: ['bachelors_male', 'bachelors_female'],
            securityDeposit: 30000.00,
            userId: user2.id, // Agent listing a unit in a project
            locationId: locationTelco.id,
            projectId: project3.id,
        });


        console.log('Properties created.');

        // --- 8. Create Property Features ---
        console.log('Creating property features...');
        await db.PropertyFeature.bulkCreate([
            { propertyId: prop1.id, hasParking: true, hasLift: true, hasSecurity: true },
            { propertyId: prop2.id, hasParking: true, hasSecurity: true, hasGym: true, hasSwimmingPool: true, hasPrivateTerraceGarden: true },
            { propertyId: prop3.id, hasParking: true, hasSecurity: true, hasPowerBackup: true },
            { propertyId: prop4.id, hasParking: true }, // Plot, might have general parking access
            { propertyId: prop5.id, hasLift: true, hasSecurity: true },
            { propertyId: prop6.id, hasParking: true, hasLift: true, hasSecurity: true, hasGym: true, hasSwimmingPool: true, hasClubhouse: true },
            { propertyId: prop7.id, hasParking: true, hasSecurity: true, hasGym: true, hasSwimmingPool: true, hasPlayArea: true, hasClubhouse: true },
            { propertyId: prop8.id, hasParking: true, hasLift: true, hasSecurity: true, hasClubhouse: true },
            { propertyId: prop9.id, hasParking: true, hasLift: true, hasSecurity: true, hasClubhouse: true, hasPrivateTerraceGarden: true },
            { propertyId: prop10.id, hasParking: true, hasLift: true, hasSecurity: true, hasClubhouse: true },
        ]);
        console.log('Property features created.');

        // --- 9. Create Property Images ---
        console.log('Creating property images...');
        await db.PropertyImage.bulkCreate([
            { propertyId: prop1.id, imageUrl: 'https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Sakchi_Apt_1', isPrimary: true, caption: 'Living Room' },
            { propertyId: prop1.id, imageUrl: 'https://via.placeholder.com/600x400/C70039/FFFFFF?text=Sakchi_Apt_2', caption: 'Bedroom' },
            { propertyId: prop2.id, imageUrl: 'https://via.placeholder.com/600x400/900C3F/FFFFFF?text=Kadma_Villa_1', isPrimary: true, caption: 'Exterior View' },
            { propertyId: prop2.id, imageUrl: 'https://via.placeholder.com/600x400/581845/FFFFFF?text=Kadma_Villa_2', caption: 'Private Garden' },
            { propertyId: prop3.id, imageUrl: 'https://via.placeholder.com/600x400/28B463/FFFFFF?text=Telco_Rent_1', isPrimary: true, caption: 'Kitchen' },
            { propertyId: prop6.id, imageUrl: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Riverside_Unit_1', isPrimary: true, caption: 'Project Rendering' },
            { propertyId: prop6.id, imageUrl: 'https://via.placeholder.com/600x400/2ECC71/FFFFFF?text=Riverside_Unit_2', caption: 'Floor Plan' },
            { propertyId: prop7.id, imageUrl: 'https://via.placeholder.com/600x400/1ABC9C/FFFFFF?text=GreenCity_Villa_1', isPrimary: true, caption: 'Model Villa' },
            { propertyId: prop8.id, imageUrl: 'https://via.placeholder.com/600x400/3498DB/FFFFFF?text=Harmony_Apt_1', isPrimary: true, caption: 'Facade' },
            { propertyId: prop10.id, imageUrl: 'https://via.placeholder.com/600x400/34495E/FFFFFF?text=Harmony_Rent_1', isPrimary: true, caption: 'Bedroom View' },
        ]);
        console.log('Property images created.');


        console.log('\n--- Dummy data insertion complete! ---');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // --- 10. Close Database Connection ---
        await db.sequelize.close();
        console.log('Database connection closed.');
    }
}

// Execute the seeding function
seedDatabase();