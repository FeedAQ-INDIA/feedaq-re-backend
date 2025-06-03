// models/location.js
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING,
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'India',
    },
    latitude: { // Keep for easier input/output
      type: DataTypes.DECIMAL(10, 8),
    },
    longitude: { // Keep for easier input/output
      type: DataTypes.DECIMAL(11, 8),
    },
    // NEW: Geographic point column
    geom: {
      type: DataTypes.GEOMETRY('Point', 4326), // 'Point' type, SRID 4326 (WGS84 - standard lat/lon)
      allowNull: true, // Allow null if not all locations have precise coordinates
    }
  }, {
    tableName: 'locations',
    timestamps: false,
    indexes: [
      {
        fields: ['geom'],
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