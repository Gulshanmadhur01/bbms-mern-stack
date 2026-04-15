import API_BASE_URL from "../../utils/apiConfig.js";
import { useState, useEffect } from "react";
import { 
  Users, 
  Hospital, 
  Droplet, 
  Calendar, 
  Heart, 
  TrendingUp,
  Activity,
  Shield,
  Beaker,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Radio,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Megaphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useOutletContext, useNavigate } from "react-router-dom";
import ActivityTrendChart from "../../components/charts/ActivityTrendChart";
import MapComponent from "../../components/MapComponent";
import AIPredictionWidget from "../../components/AIPredictionWidget";
import IoTTrackerWidget from "../../components/IoTTrackerWidget";
import InventoryIntelHub from "../../components/InventoryIntelHub";

const AdminDashboard = () => {
  const { userData } = useOutletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ text: "", active: false, mode: "standard" });
  const [updatingBroadcast, setUpdatingBroadcast] = useState(false);
  const [triggeringAI, setTriggeringAI] = useState(false);

  const fetchStats = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();
      setStats(data);
      setBroadcastData({
          text: data.announcement?.text || "",
          active: data.announcement?.active || false,
          mode: data.systemMode || "standard"
      });
      
      if (showToast) toast.success("Intelligence data synced!");
    } catch (err) {
      console.error("Dashboard error:", err);
      toast.error("Failed to load admin intelligence");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateBroadcast = async (e) => {
    e.preventDefault();
    setUpdatingBroadcast(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/system/broadcast`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(broadcastData)
      });
      if (res.ok) {
        if (broadcastData.mode === 'emergency') {
            toast.success("🚨 Emergency Broadcast Live! Alert emails are being dispatched.");
        } else {
            toast.success("Broadcast updated across the platform!");
        }
      } else {
        throw new Error("Failed to update broadcast");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
        setUpdatingBroadcast(false);
    }
  };

  const handleForceAI = async () => {
    try {
      setTriggeringAI(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/trigger-ai`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
          if (data.data?.length > 0) {
              const campsCreated = data.data.filter(a => a.campCreated).length;
              toast.success(`🤖 AI Engine finished! Created ${campsCreated} Virtual Camps and notified ${data.data.reduce((a,b)=>a+b.donors,0)} donors.`);
          } else {
              toast.success("🤖 AI Scan complete. Storage is stable. No action taken.");
          }
          fetchStats(true); // Fetch updated stats from DB
      } else {
          toast.error("AI Engine failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Failed to connect to AI sub-system.");
    } finally {
      setTriggeringAI(false);
    }
  };

  const handleExportPDF = () => {
    try {
      toast.success("Downloading Audit Data...");
      
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Header
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(220, 38, 38); // Red
      pdf.text("Blood Bank Management System", 105, 20, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("System Audit Report", 105, 30, { align: "center" });
      
      // Metadata
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generation Date: ${new Date().toLocaleString()}`, 20, 50);
      pdf.text(`Target Environment: Production`, 20, 60);
      pdf.text(`System Health: ${stats.systemHealth}`, 20, 70);

      // Core Stats
      pdf.setFont("helvetica", "bold");
      pdf.text("Core Intelligence Overview", 20, 90);
      pdf.line(20, 92, 190, 92);
      
      pdf.setFont("helvetica", "normal");
      pdf.text(`Total Verified Donors: ${stats.totalDonors}`, 30, 105);
      pdf.text(`Partner Facilities: ${stats.totalFacilities}`, 30, 115);
      pdf.text(`Total Donations Tracked: ${stats.totalDonations}`, 30, 125);
      pdf.text(`Active / Pending Requests: ${stats.pendingRequests}`, 30, 135);
      
      // Inventory Depth
      pdf.setFont("helvetica", "bold");
      pdf.text("Aggregate Inventory Depth", 20, 155);
      pdf.line(20, 157, 190, 157);
      
      pdf.setFont("helvetica", "normal");
      let y = 170;
      let i = 0;
      Object.entries(stats.inventoryDepth || {}).forEach(([bg, count]) => {
          // Create 2 columns
          const x = i % 2 === 0 ? 30 : 120;
          pdf.text(`Blood Group ${bg}: ${count} Units`, x, y);
          if (i % 2 !== 0) y += 10;
          i++;
      });
      
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Officially generated from BBMS Admin Command Center.", 105, 280, { align: "center" });

      // Direct silent download
      pdf.save(`BBMS-Audit-Data-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.", { id: "pdf-toast" });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="relative">
         <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
         <Shield className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="text-center text-red-600 font-bold">Failed to load dashboard data. Please try refreshing.</div>
    </div>
  );

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const maxInventory = Math.max(...Object.values(stats.inventoryDepth || { "A+": 10 }), 10);

  return (
    <div id="admin-dashboard-container" className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 bg-slate-50">
      
      {/* 🚀 Intelligence Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
        >
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-600 rounded-2xl shadow-lg shadow-red-200">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Hub</h1>
            </div>
            <p className="text-slate-500 font-medium">Welcome back, {userData?.name?.split(' ')[0] || "Admin"}. System status: <span className="text-green-600 font-bold ml-1">● {stats.systemHealth}</span></p>
        </motion.div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
            <button 
                onClick={() => fetchStats(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm group"
            >
                <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors ${refreshing ? 'animate-spin' : ''}`} />
                Sync Data
            </button>
            <button 
                onClick={handleExportPDF}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 border border-indigo-500 rounded-2xl text-white font-bold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-indigo-500/30"
            >
                <Download className="w-4 h-4" />
                Export Audit Report
            </button>
            <div className="w-px h-10 bg-slate-200 hidden lg:block mx-2"></div>
            <div className="flex-1 lg:flex-none flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-2xl border border-slate-200">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
      </div>

      {/* 📊 Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: "Donors", val: stats.totalDonors, icon: Users, color: "red" },
            { label: "Facilities", val: stats.totalFacilities, icon: Hospital, color: "blue" },
            { label: "Donations", val: stats.totalDonations, icon: Heart, color: "pink" },
            { label: "Requests", val: stats.pendingRequests, icon: Activity, color: "orange" }
        ].map((item, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-3xl bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-300`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{item.val}</h3>
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">LIVE FEED</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
            </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 🧠 AI Prediction Engine */}
        <div className="xl:col-span-2 mb-2 relative group">
            <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={handleForceAI}
                  disabled={triggeringAI}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-sm border border-red-100"
                >
                  {triggeringAI ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Zap className="w-3 h-3"/>}
                  {triggeringAI ? "Processing..." : "Force Simulation"}
                </button>
            </div>
            <AIPredictionWidget predictions={stats.aiPredictions} />
        </div>

        {/* 🌡️ IoT Tracker Simulation */}
        <div className="xl:col-span-1 mb-2">
            <IoTTrackerWidget />
        </div>

        {/* 🩸 Inventory Intelligence (Unified Hub) */}
        <div className="xl:col-span-2">
            <InventoryIntelHub inventoryDepth={stats.inventoryDepth} />
        </div>

        {/* 📢 Command Center */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black flex items-center gap-3">
                        <Radio className="w-6 h-6 text-red-500" />
                        Command Center
                    </h2>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${broadcastData.mode === 'emergency' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}>
                        {broadcastData.mode} MODE
                    </div>
                </div>

                <form onSubmit={handleUpdateBroadcast} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Message</label>
                        <textarea 
                            value={broadcastData.text}
                            onChange={(e) => setBroadcastData({...broadcastData, text: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-500 transition-all min-h-[100px]"
                            placeholder="Type urgent requirement or news..."
                        />
                    </div>

                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">Visibility</span>
                            <span className="text-[10px] text-slate-500">Live on landing page</span>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setBroadcastData({...broadcastData, active: !broadcastData.active})}
                            className={`w-12 h-6 rounded-full transition-all relative ${broadcastData.active ? 'bg-red-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${broadcastData.active ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {['standard', 'emergency'].map(m => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setBroadcastData({...broadcastData, mode: m})}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                    broadcastData.mode === m 
                                    ? 'bg-white text-slate-900 shadow-xl' 
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <button 
                        disabled={updatingBroadcast}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-900/40 flex items-center justify-center gap-2"
                    >
                        {updatingBroadcast ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                        Broadcast Now
                    </button>
                </form>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="text-xs text-slate-400 leading-relaxed italic">
                            Updating the broadcast instantly notifies all active visitors.
                            {broadcastData.mode === 'emergency' && (
                                <span className="text-red-400 font-bold block mt-1">
                                    ⚠️ Includes automatic mass email dispatch to all registered donors.
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* 🕒 Real Activity Feed & Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Activity className="w-5 h-5 text-red-600" />
              Live System Activity
          </h2>
          <div className="flex flex-col gap-4">
              {stats.recentActivity && stats.recentActivity.slice(0, 5).map((activity, i) => (
                  <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i} 
                      onClick={() => {
                          if (activity.description.includes('pending') || activity.description.includes('approved')) {
                             navigate('/admin/verification'); // redirect to pending facilities if needed, or /admin/facilities
                          } else if (activity.description.includes('Facility')) {
                             navigate('/admin/facilities');
                          } else {
                             navigate('/admin/donors');
                          }
                      }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 group cursor-pointer"
                  >
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              {activity.description.includes('Facility') ? <Hospital className="w-4 h-4 text-blue-500" /> : <Users className="w-4 h-4 text-red-500" />}
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-700 leading-none">{activity.description}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                                  {new Date(activity.timestamp).toLocaleDateString()}
                              </p>
                          </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition-colors" />
                  </motion.div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Activity Trends
          </h2>
          <ActivityTrendChart recentActivity={stats.recentActivity} />
        </div>
      </div>

      {/* 🗺️ Live Map Intelligence */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              Live Map Intelligence
          </h2>
          <div className="h-[400px]">
              <MapComponent radius={500} />
          </div>
      </div>

    </div>
  );
};

export default AdminDashboard;