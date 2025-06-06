// models/property.js
module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('property', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "property_id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "property_title",
    },
    description: {
      type: DataTypes.TEXT,
      field: "property_description",
    },
    transactionType: { // Buy or Rent
      type: DataTypes.ENUM('buy', 'rent'),
      allowNull: false,
      field: "property_transaction_type",
    },
    propertyType: { // Apartment, Independent House, Builder Floor, Plot, etc.
      type: DataTypes.ENUM(
          'apartment', 'independent_house', 'villa', 'builder_floor',
          'residential_plot', 'farmhouse', 'penthouse', 'studio_apartment',
          'duplex', 'triplex', 'row_house', 'room', 'serviced_apartment', 'pg_coliving'
      ),
      allowNull: false,
      field: "property_type",
    },
    price: { // For Buy
      type: DataTypes.DECIMAL(15, 2),
      field: "property_price",
    },
    rent: { // For Rent
      type: DataTypes.DECIMAL(12, 2),
      field: "property_rent",
    },
    bhkType: { // 1 RK, 1 BHK, 2 BHK, etc.
      type: DataTypes.ENUM('1_rk', '1_bhk', '2_bhk', '3_bhk', '4_bhk', '5_bhk', '5_plus_bhk'),
      field: "property_bhk_type",
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      field: "property_bedroom",
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      field: "property_bathroom",
    },
    balconies: {
      field: "property_balconies",
      type: DataTypes.INTEGER,
    },
    carpetArea: {
      type: DataTypes.DECIMAL(10, 2),
      field: "property_carpet_area",
    },
    builtupArea: {
      type: DataTypes.DECIMAL(10, 2),
      field: "property_builtup_area",
    },
    superBuiltupArea: {
      type: DataTypes.DECIMAL(10, 2),
      field: "property_super_builtup_area",
    },
    areaUnit: {
      type: DataTypes.ENUM('sq_ft', 'sq_yd', 'sq_m', 'acre', 'bigha'), // Add common units for India
      defaultValue: 'sq_ft',
      field: "property_area_unit",
    },
    furnishingStatus: {
      type: DataTypes.ENUM('furnished', 'semi_furnished', 'unfurnished'),
      field: "property_furnishing_status",
    },
    constructionStatus: { // Ready to Move, Under Construction (for resale)
      type: DataTypes.ENUM('ready_to_move', 'under_construction'),
      field: "property_construction_status",
    },
    possessionDate: {
      type: DataTypes.DATEONLY,
      field: "property_possession_date",
    },
    ageOfProperty: { // New, 1-5 years, etc.
      type: DataTypes.ENUM('new', '1_5_years', '5_10_years', '10_20_years', '20_plus_years'),
      field: "property_age_of_property",
    },
    floorNumber: {
      type: DataTypes.INTEGER,
      field: "property_floor_no",
    },
    totalFloors: {
      type: DataTypes.INTEGER,
      field: "property_tot_floor",
    },
    facing: { // North, East, etc.
      type: DataTypes.ENUM('north', 'east', 'west', 'south', 'north_east', 'north_west', 'south_east', 'south_west'),
      field: "property_facing",
    },
    ownershipType: { // Freehold, Leasehold
      type: DataTypes.ENUM('freehold', 'leasehold'),
      field: "property_ownership_type",
    },
    preferredTenants: { // For rent: Family, Bachelors etc.
      type: DataTypes.JSONB, // e.g., ['family', 'bachelors_male']
      field: "property_preferred_tenant",
    },
    availabilityDate: { // For rent
      type: DataTypes.DATEONLY,
      field: "property_availability_date",
    },
    securityDeposit: { // For rent
      type: DataTypes.DECIMAL(12, 2),
      field: "property_security_deposit",
    },
    maintenanceCharges: { // For rent
      type: DataTypes.DECIMAL(10, 2),
      field: "property_maintenance_charges",
    },
    isVerified: { // By platform
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "property_is_verified",
    },
    hasVirtualTour: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "property_has_virtual_tour",
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "property_user_id",
      references: {
        model: "user",
        key: "user_id",
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      field: "property_project_id",
      references: {
        model: "project",
        key: "project_id",
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      field: "property_location_id",
      references: {
        model: "location",
        key: "location_id",
      },
    },
    // userId, projectId, locationId will be added by associations
  }, {
    tableName: 'property',
    timestamps: true,
  });

  return Property;
};