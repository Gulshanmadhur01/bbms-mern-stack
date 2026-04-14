import cron from 'node-cron';
import { runPredictions } from './aiPredictor.js';
import Donor from '../models/donorModel.js';
import BloodCamp from '../models/bloodCampModel.js';
import Facility from '../models/facilityModel.js';
import sendEmail from './sendEmail.js';

export const runAIEmergencyProtocol = async () => {
    console.log("🤖 [AI Engine] Background scan/protocol initiated...");
    
    try {
        const predictions = await runPredictions();
        
        // Only act autonomously on "critical" statuses
        const criticalAlerts = predictions.filter(p => p.status === "critical");
        
        if (criticalAlerts.length > 0) {
            console.log(`🤖 [AI Engine] Found ${criticalAlerts.length} critical shortages. Triggering automated blasts and auto-camps.`);
            
            // Find a system default facility for hosting virtual drives. Pick the first one.
            const defaultFacility = await Facility.findOne({ approved: true });

            let alertsProcessed = [];

            for (const alert of criticalAlerts) {
                const { bloodGroup } = alert;
                
                let generateCampDetails = null;

                // Create a virtual camp if we have a facility to tie it to
                if (defaultFacility) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    const newCamp = new BloodCamp({
                        hospital: defaultFacility._id,
                        title: `🚨 AI SOS: Urgent ${bloodGroup} Blood Drive`,
                        description: `Our AI Predictor engine has determined that reserves for ${bloodGroup} will completely run out. We urgently need donors to step forward.`,
                        date: tomorrow,
                        time: { start: "08:00 AM", end: "08:00 PM" },
                        location: {
                            venue: "Virtual Central Collection Hub",
                            city: defaultFacility.address?.city || "Central City",
                            state: defaultFacility.address?.state || "State",
                            pincode: defaultFacility.address?.pincode || "100000"
                        },
                        expectedDonors: 100,
                        status: "Upcoming"
                    });
                    
                    await newCamp.save();
                    generateCampDetails = newCamp;
                    console.log(`🤖 [AI Engine] Automatically spawned Virtual Camp for ${bloodGroup}.`);
                }

                const rawDonors = await Donor.find({ bloodGroup });
                const targetedDonors = rawDonors.filter(donor => donor.isEligible !== false);

                if (targetedDonors.length > 0) {
                    const emailPromises = targetedDonors.map(donor => {
                        return sendEmail({
                            email: donor.email,
                            subject: `🚨 URGENT: Autonomous AI Alert - ${bloodGroup} Shortage!`,
                            message: `Hello ${donor.fullName || 'Donor'},\n\nOur AI Predictor Engine detects a severe deficiency of ${bloodGroup} blood.\n\nImmediate donations are requested to prevent loss of life.`,
                            html: `
                              <div style="font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; padding: 30px; border: 2px solid #dc2626; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #fffafaf;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                  <h2 style="color: #dc2626; margin: 0; font-size: 24px;">🤖 AI CRITICAL HEALTH ALERT</h2>
                                  <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Enterprise Blood Bank Management System</p>
                                </div>
                                <p style="color: #374151; font-size: 16px;">Dear <b>${donor.fullName || 'Hero'}</b>,</p>
                                <p style="color: #374151; font-size: 16px;">Our Predictive Intelligence Engine has flagged a <b>critical outage</b> of the <strong>${bloodGroup}</strong> blood group. Lives are at immediate risk in your region.</p>
                                
                                ${generateCampDetails ? `
                                <div style="background-color: #fee2e2; padding: 20px; border-left: 6px solid #dc2626; border-radius: 4px; margin: 25px 0;">
                                  <h3 style="margin: 0 0 10px 0; color: #991b1b; font-size: 18px;">🏕️ SOS Auto-Camp Scheduled</h3>
                                  <p style="margin: 5px 0; color: #7f1d1d;"><strong>Title:</strong> ${generateCampDetails.title}</p>
                                  <p style="margin: 5px 0; color: #7f1d1d;"><strong>Date:</strong> ${generateCampDetails.date.toDateString()}</p>
                                  <p style="margin: 5px 0; color: #7f1d1d;"><strong>Venue:</strong> ${generateCampDetails.location.venue}, ${generateCampDetails.location.city}</p>
                                </div>
                                ` : ''}

                                <p style="color: #374151; font-size: 16px;">Please log into your portal and register for the latest camp to save lives today.</p>
                                
                                <div style="text-align: center; margin-top: 30px;">
                                  <a href="http://localhost:5173/camp-schedule" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Urgent Camps</a>
                                </div>
                              </div>
                            `
                        }).catch(err => console.error(`[AI Engine] Failed to mail ${donor.email}`, err.message));
                    });
                    
                    await Promise.allSettled(emailPromises);
                    console.log(`🤖 [AI Engine] Blasted ${targetedDonors.length} donors of group ${bloodGroup}.`);
                    
                    alertsProcessed.push({ group: bloodGroup, donors: targetedDonors.length, campCreated: !!generateCampDetails });
                }
            }
            return { success: true, alerts: alertsProcessed };
        } else {
            console.log("🤖 [AI Engine] Storage levels stable. No autonomous action required.");
            return { success: true, message: "Storage levels stable. No autonomous action required.", alerts: [] };
        }
    } catch (error) {
        console.error("🤖 [AI Engine] Failed to execute routine:", error);
        return { success: false, error: error.message };
    }
};

export const startAIEngine = () => {
    // Schedule background AI check every day at 09:00 AM
    // For a college demo, this proves you understand Autonomous Background Processing (CRON Jobs)
    cron.schedule('0 9 * * *', async () => {
        await runAIEmergencyProtocol();
    });

    console.log("⚙️  Autonomous AI Engine initialized: Scheduled for 09:00 AM daily scans.");
};
