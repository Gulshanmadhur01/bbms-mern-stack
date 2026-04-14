import Blood from "../models/bloodModel.js";
import BloodRequest from "../models/bloodRequestModel.js";
import System from "../models/SystemModel.js";
import Donor from "../models/donorModel.js";
import Facility from "../models/facilityModel.js";
import sendEmail from "../utils/sendEmail.js";
import { runPredictions } from "../utils/aiPredictor.js";
import { runAIEmergencyProtocol } from "../utils/automationJob.js";

// 🧩 Get Dashboard Overview Stats (Aggregated Intelligence)
export const getDashboardStats = async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const totalFacilities = await Facility.countDocuments();
    const pendingFacilities = await Facility.countDocuments({ status: "pending" });
    const approvedFacilities = await Facility.countDocuments({ status: "approved" });

    // 🩸 Blood Inventory Intelligence
    const inventory = await Blood.aggregate([
      { $group: { _id: "$bloodGroup", total: { $sum: "$quantity" } } }
    ]);
    
    // Map to a more readable object
    const inventoryDepth = inventory.reduce((acc, curr) => {
      acc[curr._id] = curr.total;
      return acc;
    }, {});

    // Count total donations across all donors
    const donors = await Donor.find({}, "donationHistory");
    const totalDonations = donors.reduce(
      (sum, donor) => sum + (donor.donationHistory?.length || 0),
      0
    );

    const activeDonors = await Donor.countDocuments({ isEligible: true });

    // 🛰️ System & Requests
    const pendingRequests = await BloodRequest.countDocuments({ status: "pending" });
    const system = await System.findOne().sort({ createdAt: -1 });

    // 🕒 Real Recent Activity
    const recentFacilities = await Facility.find().sort({ updatedAt: -1 }).limit(3);
    const recentDonors = await Donor.find().sort({ createdAt: -1 }).limit(2);
    
    const recentActivity = [
      ...recentFacilities.map(f => ({ 
        description: `Facility ${f.name} updated (${f.status})`, 
        timestamp: f.updatedAt 
      })),
      ...recentDonors.map(d => ({ 
        description: `New Donor ${d.name} registered`, 
        timestamp: d.createdAt 
      }))
    ].sort((a, b) => b.timestamp - a.timestamp);

    const aiPredictions = await runPredictions();

    res.status(200).json({
      totalDonors,
      totalFacilities,
      approvedFacilities,
      pendingFacilities,
      totalDonations,
      activeDonors,
      pendingRequests,
      inventoryDepth,
      recentActivity,
      systemMode: system?.mode || "standard",
      announcement: system?.announcement || { text: "", active: false },
      systemHealth: system?.systemHealth?.status || "Optimal",
      upcomingCamps: 3, // Logic could be added to fetch from BloodCampModel
      aiPredictions,
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// 🧍 Get All Donors
export const getAllDonors = async (req, res) => {
  try {
    // Note: This function was present in your code block but not used in the router
    const donors = await Donor.find().select("-password");
    res.status(200).json({ donors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching donors" });
  }
};

// 🏥 Get All Facilities (Pending + Approved)
export const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json({ facilities });
  } catch (err) {
    res.status(500).json({ message: "Error fetching facilities" });
  }
};

// ✅ Approve a Facility
export const approveFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: "Facility not found" });

    facility.status = "approved";

    // HISTORY LOGIC DELETED

    await facility.save();

    try {
      await sendEmail({
        email: facility.email,
        subject: 'Facility Approved - Blood Bank Management System',
        message: `Hello ${facility.name},\n\nYour facility registration has been approved. You can now log in to your dashboard.\n\nThank you,\nBlood Bank System Admin`
      });
    } catch (emailError) {
      console.error('Approval email could not be sent:', emailError);
    }

    res.status(200).json({ message: "Facility approved", facility });
  } catch (err) {
    console.error("Facility Approval Error:", err);
    res.status(500).json({ message: "Error approving facility" });
  }
};

// ❌ Reject / Update Facility Status to Rejected
export const rejectFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: "Facility not found" });

    const { rejectionReason } = req.body;
    if (!rejectionReason) return res.status(400).json({ message: "Rejection reason is required." });

    facility.status = "rejected";
    facility.rejectionReason = rejectionReason;

    // HISTORY LOGIC DELETED

    await facility.save();

    try {
      await sendEmail({
        email: facility.email,
        subject: 'Facility Registration Update - Blood Bank Management System',
        message: `Hello ${facility.name},\n\nUnfortunately, your facility registration has been rejected.\nReason: ${rejectionReason}\n\nPlease contact support for further details.\n\nThank you,\nBlood Bank System Admin`
      });
    } catch (emailError) {
      console.error('Rejection email could not be sent:', emailError);
    }

    res.status(200).json({ message: "Facility rejected and status updated", facility });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting facility" });
  }
};

// 🚀 Trigger Emergency Email Blast via AI
export const triggerEmergencyBlast = async (req, res) => {
  try {
    const { bloodGroup, message } = req.body;
    if (!bloodGroup) return res.status(400).json({ message: "Blood group is required." });

    // Find all donors for this blood group, then filter in JS
    const rawDonors = await Donor.find({ bloodGroup });

    // Mongoose virtual properties cannot be queried directly in .find()
    const targetedDonors = rawDonors.filter(donor => donor.isEligible !== false);

    if (targetedDonors.length === 0) {
        return res.status(200).json({ 
            message: `Simulation Complete: 0 donors found for ${bloodGroup} in the database. Add actual donors to see emails flow.`,
            recipientCount: 0 
        });
    }

    // Blast emails
    const emailPromises = targetedDonors.map(donor => {
        return sendEmail({
            email: donor.email,
            subject: 'URGENT: AI Predicted Blood Shortage Alert',
            message: `Hello ${donor.name},\n\nOur system predicts an imminent critical shortage of ${bloodGroup} blood.\n\nMessage from Admin: ${message || 'Please consider donating as soon as possible. Your donation will be crucial in the coming days.'}\n\nThank you,\nBlood Bank Management System`
        }).catch(err => console.error(`Failed to email ${donor.email}`, err));
    });

    await Promise.allSettled(emailPromises);

    res.status(200).json({ 
        message: `Emergency blast successfully triggered for ${targetedDonors.length} donors.`,
        recipientCount: targetedDonors.length
    });
  } catch (err) {
      console.error("Emergency Blast Error:", err);
      res.status(500).json({ message: "Failed to trigger automation blast." });
  }
};

// 🤖 Force Run Autonomous AI Engine
export const triggerAIEngine = async (req, res) => {
    try {
        const result = await runAIEmergencyProtocol();
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message || "AI Engine scan complete.",
                data: result.alerts || []
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "AI Engine encountered an error.",
                error: result.error
            });
        }
    } catch (error) {
        console.error("AI trigger route error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};