import axios from 'axios';

const geocodeAddress = async (street, city, state, pincode) => {
  try {
    const address = `${street}, ${city}, ${state}, ${pincode}, India`;
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: {
        // Needs a valid User-Agent according to Nominatim terms of use
        'User-Agent': 'BloodBankManagementSystem/1.0 (contact@example.com)',
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        type: 'Point',
        coordinates: [parseFloat(lon), parseFloat(lat)] // GeoJSON format requires [longitude, latitude]
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error.message);
    return null;
  }
};

export default geocodeAddress;
