// models/location.js
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('location', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "location_id",
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "location_addressline_1",
    },
    addressLine2: {
      type: DataTypes.STRING,
      field: "location_addressline_2",
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "location_locality",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "location_city"
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "location_state",
    },
    zipCode: {
      type: DataTypes.STRING,
      field: "location_zipcode",
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'India',
      field: "location_country",
    },
    latitude: { // Keep for easier input/output
      type: DataTypes.DECIMAL(10, 8),
      field: "location_latitude",
    },
    longitude: { // Keep for easier input/output
      type: DataTypes.DECIMAL(11, 8),
      field: "location_longitude",
    },
    // NEW: Geographic point column
    geom: {
      type: DataTypes.GEOMETRY('Point', 4326), // 'Point' type, SRID 4326 (WGS84 - standard lat/lon)
      allowNull: true, // Allow null if not all locations have precise coordinates
      field: "location_geoam",
    }
  }, {
    tableName: 'location',
    timestamps: false,
    indexes: [
      {
        fields: ['location_geoam'],
        using: 'GIST', // GIST index for geospatial queries
      }
    ]
  });

  // Hook to automatically populate 'geom' from latitude/longitude
  Location.beforeSave(async (location, options) => {
    if (location.latitude && location.longitude) {
      location.geom = {
        type: 'Point',
        coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)], // GeoJSON expects [longitude, latitude]
        crs: { type: 'name', properties: { name: 'EPSG:4326' } }
      };
    } else {
      location.geom = null; // Clear geom if coordinates are removed
    }
  });


  return Location;
};