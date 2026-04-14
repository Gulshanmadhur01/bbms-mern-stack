import mongoose from "mongoose";
import dotenv from "dotenv";
import Facility from "./models/facilityModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding Lab ✅"))
  .catch(err => console.error(err));

const seedLab = async () => {
  try {
    // Remove existing lab with same email
    await Facility.deleteMany({ email: "testlab@bbms.com" });

    // Create new Blood Lab
    const lab = new Facility({
      name: "LifeCare Blood Lab",
      email: "testlab@bbms.com",
      password: "lab@password123",
      phone: "9876543210",
      emergencyContact: "9123456780",
      address: {
        street: "123 Health Ave",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      },
      registrationNumber: "LAB12345678",
      facilityType: "blood-lab",
      role: "blood-lab",
      facilityCategory: "Private",
      documents: {
        registrationProof: {
          url: "https://example.com/doc.pdf",
          filename: "registration.pdf"
        }
      },
      operatingHours: {
        open: "09:00",
        close: "20:00",
        workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"]
      },
      is24x7: false,
      emergencyServices: true,
      status: "approved" // Set to approved so it shows up in dashboards
    });

    await lab.save();
    console.log("Health Lab seeded successfully ✅ Check 'facilities' collection in Compass.");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedLab();
