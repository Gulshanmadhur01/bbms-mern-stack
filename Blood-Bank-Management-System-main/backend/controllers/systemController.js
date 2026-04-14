import System from "../models/SystemModel.js";
import Donor from "../models/donorModel.js";
import sendEmail from "../utils/sendEmail.js";

// 📢 Get Global Announcement (Public)
export const getAnnouncement = async (req, res) => {
  try {
    let system = await System.findOne().sort({ createdAt: -1 });
    if (!system) {
      // Initialize if not exists
      system = await System.create({
        mode: "standard",
        announcement: { text: "Welcome to the Blood Bank Management System", active: false }
      });
    }
    res.status(200).json({
      success: true,
      announcement: system.announcement,
      mode: system.mode
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🛰️ Update Broadcast (Admin Only)
export const updateBroadcast = async (req, res) => {
  try {
    const { text, active, mode } = req.body;
    let system = await System.findOne().sort({ createdAt: -1 });
    
    if (!system) {
        system = new System();
    }

    // Only broadcast email if it's a new emergency activation
    const isNewEmergency = active === true && mode === "emergency" && (!system.announcement.active || system.mode !== "emergency" || system.announcement.text !== text);

    if (text !== undefined) system.announcement.text = text;
    if (active !== undefined) system.announcement.active = active;
    if (mode !== undefined) system.mode = mode;
    
    system.announcement.updatedBy = req.user.id;
    system.systemHealth.lastAudit = Date.now();

    await system.save();

    // Trigger Email Broadcast as background job
    if (isNewEmergency && system.announcement.text) {
      Donor.find({})
        .select("email fullName")
        .then(donors => {
           console.log(`[Email System] Dispatching emergency alert to ${donors.length} donors...`);
           donors.forEach(donor => {
              if (!donor.email) return;
              
              const htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 2px solid #dc2626; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #fffafaf;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #dc2626; margin: 0; font-size: 24px;">🚨 URGENT BLOOD REQUIREMENT</h2>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Enterprise Blood Bank Management System</p>
                  </div>
                  
                  <p style="color: #374151; font-size: 16px;">Dear <b>${donor.fullName || 'Donor'}</b>,</p>
                  <p style="color: #374151; font-size: 16px;">This is an emergency broadcast from our medical command center.</p>
                  
                  <div style="background-color: #fee2e2; padding: 20px; border-left: 6px solid #dc2626; border-radius: 4px; margin: 25px 0;">
                    <p style="margin: 0; color: #991b1b; font-size: 18px; font-weight: bold;">Message:</p>
                    <p style="margin: 10px 0 0 0; color: #7f1d1d; font-size: 16px;">${system.announcement.text}</p>
                  </div>
                  
                  <p style="color: #374151; font-size: 16px;">If you are eligible and available, please consider donating immediately. Your prompt response could save a life today.</p>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:5173/camp-schedule" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Donation Centers</a>
                  </div>
                </div>
              `;
              
              sendEmail({
                email: donor.email,
                subject: "🚨 URGENT: Blood Bank Emergency Alert",
                message: system.announcement.text,
                html: htmlContent
              }).catch(err => console.error("[Email Error]", donor.email, err.message));
           });
        })
        .catch(err => console.error("Failed to fetch donors for broadcast", err));
    }

    res.status(200).json({
      success: true,
      message: "System broadcast updated successfully",
      system
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
