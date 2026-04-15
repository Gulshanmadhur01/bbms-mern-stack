import mongoose from "mongoose";
import dotenv from "dotenv";
import Blood from "./models/bloodModel.js";

dotenv.config();

const realisticData = [
  { group: "A+", qty: 42, status: "Healthy" },
  { group: "A-", qty: 8, status: "Critical" },
  { group: "B+", qty: 35, status: "Stable" },
  { group: "B-", qty: 4, status: "Critical" },
  { group: "O+", qty: 55, status: "Surplus" },
  { group: "O-", qty: 7, status: "Critical" },
  { group: "AB+", qty: 15, status: "Low" },
  { group: "AB-", qty: 2, status: "Extremely Critical" }
];

const seedInventory = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");

    // Use the verified Facility ID
    const facilityId = "69c962c29b3e759d6c4e35e4";

    // Clear existing data for this facility to avoid mess (Optional, but cleaner for demo)
    await Blood.deleteMany({ bloodLab: facilityId });

    const bloodEntries = realisticData.map(item => ({
      bloodGroup: item.group,
      quantity: item.qty,
      componentType: "Whole Blood",
      expiryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random expiry in next 30 days
      bloodLab: facilityId
    }));

    await Blood.insertMany(bloodEntries);
    console.log("✅ Realistic Inventory Seeding Complete!");
    
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedInventory();
