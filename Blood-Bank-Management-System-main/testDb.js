import mongoose from 'mongoose';
import Donor from './backend/models/donorModel.js';

mongoose.connect("mongodb://localhost:27017/bloodbank").then(async () => {
    console.log("Connected");
    const donors = await Donor.find({});
    console.log("Total Donors:", donors.length);
    if (donors.length > 0) {
        donors.forEach(d => console.log(d.fullName, d.bloodGroup, d.isEligible));
    }
    process.exit(0);
});
