import API_BASE_URL from "../../utils/apiConfig.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Droplet,
  Calendar,
  Users,
  Activity,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Award,
  Heart,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Download,
  Share2,
  Filter,
  Search,
  Bell
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = `${API_BASE_URL}/donor`;

const DonorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [donor, setDonor] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const [profileRes, historyRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: {} })),
      ]);

      const donorData = profileRes.data.donor || profileRes.data;
      setDonor(donorData);

      let historyData = [];
      if (historyRes.data.history) {
        historyData = historyRes.data.history;
      } else if (historyRes.data.donations) {
        historyData = historyRes.data.donations;
      } else if (Array.isArray(historyRes.data)) {
        historyData = historyRes.data;
      }
      setHistory(historyData);

      // 🏆 5-Tier Advanced Ranking System
      const totalDonations = historyData.length;
      const livesImpacted = totalDonations * 3;
      
      let achievementLevel = "Bronze Life Saver";
      let badge = "🥉";
      let nextMilestone = 2;

      if (totalDonations >= 21) {
        achievementLevel = "Blood Banking Legend";
        badge = "💎";
        nextMilestone = totalDonations;
      } else if (totalDonations >= 11) {
        achievementLevel = "Guardian Angel";
        badge = "🛡️";
        nextMilestone = 21;
      } else if (totalDonations >= 6) {
        achievementLevel = "Super Hero";
        badge = "👑";
        nextMilestone = 11;
      } else if (totalDonations >= 2) {
        achievementLevel = "Safe Haven Hero";
        badge = "🥈";
        nextMilestone = 6;
      }

      const completionRate = Math.min(100, (totalDonations / nextMilestone) * 100);

      setDashboard({
        stats: {
          totalDonations,
          livesImpacted,
          achievementLevel,
          nextMilestone,
          completionRate,
          badge,
          ...statsRes.data
        },
        recentActivity: historyData.slice(0, 5)
      });

    } catch (error) {
      console.error("🚨 Donor Dashboard Error:", error);
      toast.error("Failed to load donor dashboard data");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success("Dashboard updated");
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDashboardData();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <Heart className="w-12 h-12 text-red-500 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const isEligible = donor?.eligibleToDonate || false;
  const lastDonation = donor?.lastDonationDate ? new Date(donor.lastDonationDate) : null;
  const nextEligibleDate = lastDonation ? new Date(lastDonation.getTime() + 90 * 24 * 60 * 60 * 1000) : null;
  const daysUntilEligible = nextEligibleDate ? Math.ceil((nextEligibleDate - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  const handleDownloadCertificate = () => {
    const printWindow = window.open('', '_blank');
    const rank = dashboard?.stats?.achievementLevel || "Bronze Life Saver";
    const badge = dashboard?.stats?.badge || "🥉";
    const donorName = donor?.fullName || 'Valued Donor';

    printWindow.document.write(`
      <html>
        <head>
          <title>Award of Valor - ${donorName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Great+Vibes&family=Montserrat:wght@400;700&display=swap');
            body { margin: 0; padding: 0; background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif; }
            .cert { width: 850px; height: 600px; padding: 40px; border: 15px solid #8b0000; text-align: center; position: relative; box-sizing: border-box; }
            .header { font-family: 'Cinzel', serif; color: #8b0000; font-size: 40px; text-transform: uppercase; letter-spacing: 5px; }
            .name { font-family: 'Great Vibes', cursive; font-size: 60px; margin: 20px 0; border-bottom: 2px solid #ccc; display: inline-block; min-width: 400px; }
            .rank-info { font-size: 24px; font-weight: 700; color: #8b0000; margin-top: 20px; }
            .badge { font-size: 60px; margin: 10px 0; }
            .footer { margin-top: 50px; display: flex; justify-content: space-around; width: 100%; }
            .sign { border-top: 2px solid #333; width: 180px; padding-top: 8px; font-size: 14px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="cert">
            <h1 class="header">Certificate of Appreciation</h1>
            <p style="font-size: 18px; color: #666;">This recognizes the heroic contribution of</p>
            <div class="name">${donorName}</div>
            <p style="font-size: 18px; color: #666;">For achieving the advanced rank of</p>
            <div class="rank-info">${rank}</div>
            <div class="badge">${badge}</div>
            <p style="max-width: 80%; margin: 20px auto; font-style: italic;">"Your selfless blood donation stands as a beacon of hope, proving that one act of kindness can save three lives."</p>
            <div class="footer">
              <div class="sign">Medical Director</div>
              <div style="font-family: monospace; font-size: 10px; align-self: center;">REF: BBMS-${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              <div class="sign">Head of Operations</div>
            </div>
          </div>
          <script>window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 1000); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShareAchievement = () => {
    const shareText = `I am a ${dashboard?.stats?.achievementLevel} on Blood-Sync! I've saved lives through blood donation. 🩸`;
    if (navigator.share) {
      navigator.share({ title: 'My Impact', text: shareText, url: window.location.origin }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Impact message copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
             <Heart className="w-8 h-8 text-red-600" /> Donor Dashboard
          </h1>
          <p className="text-gray-600">Track your heroic journey and lifesaving impact</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-red-100 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Updating..." : "Refresh Data"}
        </button>
      </div>

      {/* Rank & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-red-50 p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
               <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-1">Current Standing</p>
               <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                 {dashboard?.stats?.achievementLevel} {dashboard?.stats?.badge}
               </h2>
            </div>
            <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-tighter ${isEligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
               {isEligible ? "READY TO SAVE LIVES" : `COOLING DOWN: ${daysUntilEligible}D`}
            </div>
          </div>
          
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
             <div 
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000"
               style={{ width: `${dashboard?.stats?.completionRate}%` }}
             ></div>
          </div>
          
          <div className="flex justify-between text-xs font-bold text-gray-400">
             <span>Level Progress</span>
             <span className="text-red-600">{dashboard?.stats?.totalDonations} / {dashboard?.stats?.nextMilestone} Donations</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-red-200 font-bold text-xs uppercase tracking-widest mb-2">Lives Impacted</p>
              <h3 className="text-6xl font-black mb-4">{dashboard?.stats?.livesImpacted || 0}</h3>
              <p className="text-red-100 text-xs italic opacity-80">"Your blood saved up to {dashboard?.stats?.livesImpacted} people from critical conditions. You are a real-world hero."</p>
           </div>
           <Droplet className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={<Droplet />} label="Donations" value={dashboard?.stats?.totalDonations || 0} color="red" />
        <MetricCard icon={<Award />} label="Rank" value={dashboard?.stats?.achievementLevel || "Bronze"} color="purple" />
        <MetricCard icon={<Shield />} label="Eligibility" value={isEligible ? "ACTIVE" : "PENDING"} color="green" />
        <MetricCard icon={<Calendar />} label="Next Goal" value={isEligible ? "NOW" : new Date(nextEligibleDate).toLocaleDateString()} color="blue" />
      </div>

      {/* Lower Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation History */}
        <Section title="Donation History" icon={<Activity className="text-red-600" />}>
           {history.length > 0 ? (
             <div className="space-y-4">
                {history.map((item, idx) => (
                  <DonationHistoryItem key={idx} donation={item} />
                ))}
             </div>
           ) : (
             <EmptyState icon={<Droplet />} message="Your donation journey starts here!" actionText="Register for Camp" onAction={() => window.location.href='/donor/camps'} />
           )}
        </Section>

        {/* Quick Actions */}
        <div className="space-y-6">
           <Section title="Rewards & Actions" icon={<Award className="text-purple-600" />}>
              <div className="grid grid-cols-2 gap-4">
                  <ActionBtn icon={<Download />} title="Certificate" sub="Download achievement" color="blue" onClick={handleDownloadCertificate} />
                  <ActionBtn icon={<Share2 />} title="Share Rank" sub="Tell your impact" color="green" onClick={handleShareAchievement} />
                  <ActionBtn icon={<Calendar />} title="Book Appointment" sub="Schedule next" color="red" onClick={() => window.location.href='/donor/camps'} />
                  <ActionBtn icon={<Users />} title="Invite" sub="Refer a friend" color="purple" onClick={handleShareAchievement} />
              </div>
           </Section>

           {/* Health Stats */}
           <Section title="Medical Profile" icon={<Shield className="text-green-600" />}>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Blood Group</p>
                    <p className="text-xl font-black text-red-600">{donor?.bloodGroup || 'N/A'}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Age / Gender</p>
                    <p className="text-xl font-black text-gray-800">{donor?.age || '?' } • {donor?.gender?.[0] || '?'}</p>
                 </div>
              </div>
           </Section>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const MetricCard = ({ icon, label, value, color, subtitle }) => {
  const colors = {
    red: "bg-red-50 text-red-600 border-red-100",
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };
  return (
    <div className={`bg-white p-6 rounded-3xl border shadow-sm ${colors[color] || colors.red}`}>
      <div className="flex items-center gap-4">
         <div className={`p-3 rounded-2xl bg-white shadow-sm`}>{icon}</div>
         <div>
            <p className="text-gray-500 font-bold text-xs uppercase">{label}</p>
            <p className="text-xl font-black text-gray-800">{value}</p>
            {subtitle && <p className="text-[10px] mt-1 font-bold">{subtitle}</p>}
         </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-red-50 p-6">
    <div className="flex items-center gap-3 mb-6">
       <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>
       <h3 className="font-black text-gray-800 text-lg uppercase tracking-tighter">{title}</h3>
    </div>
    {children}
  </div>
);

const DonationHistoryItem = ({ donation }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50/50 transition-colors group">
    <div className="flex items-center gap-4">
       <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
          <Droplet className="w-6 h-6" />
       </div>
       <div>
          <p className="font-black text-gray-800 text-sm">{donation.facility || "Verified Donation"}</p>
          <p className="text-xs text-gray-500 font-bold">{new Date(donation.donationDate || donation.date).toLocaleDateString()}</p>
       </div>
    </div>
    <div className="text-right">
       <p className="font-black text-red-600 leading-none">{donation.quantity || 1} Unit</p>
       <p className="text-[10px] text-green-600 font-bold mt-1">✓ VERIFIED</p>
    </div>
  </div>
);

const ActionBtn = ({ icon, title, sub, color, onClick }) => {
  const colors = {
     blue: "bg-blue-600 shadow-blue-200",
     green: "bg-green-600 shadow-green-200",
     red: "bg-red-600 shadow-red-200",
     purple: "bg-purple-600 shadow-purple-200"
  };
  return (
    <button onClick={onClick} className={`${colors[color]} p-4 rounded-3xl text-white text-left shadow-lg hover:scale-105 transition-transform`}>
       <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-2">{icon}</div>
       <p className="font-black text-sm">{title}</p>
       <p className="text-[10px] font-bold opacity-70">{sub}</p>
    </button>
  );
};

const EmptyState = ({ icon, message, actionText, onAction }) => (
  <div className="text-center py-12 px-6">
     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
        {React.cloneElement(icon, { size: 32 })}
     </div>
     <p className="text-gray-500 font-bold mb-4">{message}</p>
     {actionText && (
       <button onClick={onAction} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all">
          {actionText}
       </button>
     )}
  </div>
);

export default DonorDashboard;