// models/property.js
module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    transactionType: { // Buy or Rent
      type: DataTypes.ENUM('buy', 'rent'),
      allowNull: false,
    },
    propertyType: { // Apartment, Independent House, Builder Floor, Plot, etc.
      type: DataTypes.ENUM(
          'apartment', 'independent_house', 'villa', 'builder_floor',
          'residential_plot', 'farmhouse', 'penthouse', 'studio_apartment',
          'duplex', 'triplex', 'row_house', 'room', 'serviced_apartment', 'pg_coliving'
      ),
      allowNull: false,
    },
    price: { // For Buy
      type: DataTypes.DECIMAL(15, 2),
    },
    rent: { // For Rent
      type: DataTypes.DECIMAL(12, 2),
    },
    bhkType: { // 1 RK, 1 BHK, 2 BHK, etc.
      type: DataTypes.ENUM('1_rk', '1_bhk', '2_bhk', '3_bhk', '4_bhk', '5_bhk', '5_plus_bhk'),
    },
    bedrooms: {
      type: DataTypes.INTEGER,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
    },
    balconies: {
      type: DataTypes.INTEGER,
    },
    carpetArea: {
      type: DataTypes.DECIMAL(10, 2),
    },
    builtupArea: {
      type: DataTypes.DECIMAL(10, 2),
    },
    superBuiltupArea: {
      type: DataTypes.DECIMAL(10, 2),
    },
    areaUnit: {
      type: DataTypes.ENUM('sq_ft', 'sq_yd', 'sq_m', 'acre', 'bigha'), // Add common units for India
      defaultValue: 'sq_ft',
    },
    furnishingStatus: {
      type: DataTypes.ENUM('furnished', 'semi_furnished', 'unfurnished'),
    },
    constructionStatus: { // Ready to Move, Under Construction (for resale)
      type: DataTypes.ENUM('ready_to_move', 'under_construction'),
    },
    possessionDate: {
      type: DataTypes.DATEONLY,
    },
    ageOfProperty: { // New, 1-5 years, etc.
      type: DataTypes.ENUM('new', '1_5_years', '5_10_years', '10_20_years', '20_plus_years'),
    },
    floorNumber: {
      type: DataTypes.INTEGER,
    },
    totalFloors: {
      type: DataTypes.INTEGER,
    },
    facing: { // North, East, etc.
      type: DataTypes.ENUM('north', 'east', 'west', 'south', 'north_east', 'north_west', 'south_east', 'south_west'),
    },
    ownershipType: { // Freehold, Leasehold
      type: DataTypes.ENUM('freehold', 'leasehold'),
    },
    preferredTenants: { // For rent: Family, Bachelors etc.
      type: DataTypes.JSONB, // e.g., ['family', 'bachelors_male']
    },
    availabilityDate: { // For rent
      type: DataTypes.DATEONLY,
    },
    securityDeposit: { // For rent
      type: DataTypes.DECIMAL(12, 2),
    },
    maintenanceCharges: { // For rent
      type: DataTypes.DECIMAL(10, 2),
    },
    isVerified: { // By platform
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasVirtualTour: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // userId, projectId, locationId will be added by associations
  }, {
    tableName: 'properties',
    timestamps: true,
  });

  return Property;
};