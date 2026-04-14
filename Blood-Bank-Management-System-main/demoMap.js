import mongoose from 'mongoose';
import Donor from './backend/models/donorModel.js';
import geocodeAddress from './backend/utils/geocoder.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const runDemo = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully!");

        const street = "Connaught Place";
        const city = "New Delhi";
        const state = "Delhi";
        const pincode = "110001";

        console.log(`Geocoding Address: ${street}, ${city}...`);
        
        // Use the same geocoder utility we built for the real app
        const location = await geocodeAddress(street, city, state, pincode);
        
        if (!location) {
             console.log("Geocoding failed, using manual fallback coordinates for Delhi...");
             // Fallback just in case Nominatim API blocks the server request
        }

        const newDonor = new Donor({
            fullName: "Rajesh (Map Demo) Kumar",
            email: "demomap221@example.com",
            password: "password123", // Pre-save hook will hash this
            phone: "9876543210",
            bloodGroup: "O+",
            age: 26,
            gender: "Male",
            weight: 70,
            address: { street, city, state, pincode },
            eligibleToDonate: true,
            location: location || { type: 'Point', coordinates: [77.2090, 28.6139] } // GeoJSON is [LNG, LAT]
        });

        await newDonor.save();
        console.log("✅ Demo Donor Successfully added to Map Intelligence Database!");
        console.log(`Coordinates captured: Latitude: ${newDonor.location.coordinates[1]} | Longitude: ${newDonor.location.coordinates[0]}`);

    } catch (err) {
        console.error("Demo failed:", err);
    } finally {
        mongoose.disconnect();
        process.exit(0);
    }
};

runDemo();
