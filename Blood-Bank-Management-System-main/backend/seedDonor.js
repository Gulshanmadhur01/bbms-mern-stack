import mongoose from "mongoose";
import dotenv from "dotenv";
import Donor from "./models/donorModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding Donor ✅"))
  .catch(err => console.error(err));

const seedDonor = async () => {
  try {
    // Remove existing donor with same email
    await Donor.deleteMany({ email: "rahul@sharma.com" });

    // Create new Donor
    const donor = new Donor({
      fullName: "Rahul Sharma",
      email: "rahul@sharma.com",
      password: "rahul@123",
      phone: "9988776655",
      bloodGroup: "AB+",
      age: 25,
      gender: "Male",
      address: {
        street: "456 Donor Colony",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001"
      },
      weight: 70,
      isActive: true,
      eligibleToDonate: true
    });

    await donor.save();
    console.log("Donor Rahul seeded successfully ✅ Check 'donors' collection in Compass.");
    process.exit();
  } catch (error) {
    console.error("Donor Seeding failed:", error);
    process.exit(1);
  }
};

seedDonor();
