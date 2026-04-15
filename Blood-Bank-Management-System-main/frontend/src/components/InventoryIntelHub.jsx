import { motion } from "framer-motion";
import { 
  Droplet, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck, 
  Zap,
  Info
} from "lucide-react";
import BloodInventoryChart from "./charts/BloodInventoryChart";

const InventoryIntelHub = ({ inventoryDepth = {} }) => {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // Intelligence Logic
  const totalUnits = Object.values(inventoryDepth).reduce((a, b) => a + b, 0);
  const universalDonorUnits = inventoryDepth["O-"] || 0;
  const versatilityIndex = totalUnits > 0 ? ((universalDonorUnits / totalUnits) * 100).toFixed(1) : 0;
  
  const getStatus = (count) => {
    if (count < 10) return { label: "CRITICAL", color: "red", icon: AlertCircle };
    if (count < 25) return { label: "LOW STOCK", color: "amber", icon: Info };
    return { label: "STABLE", color: "emerald", icon: ShieldCheck };
  };

  const criticalGroups = bloodGroups.filter(bg => (inventoryDepth[bg] || 0) < 10);

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 overflow-hidden relative">
      {/* 🔮 Background Intelligence Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 blur-[80px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-200">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              Inventory Intelligence
            </h2>
            <p className="text-slate-400 font-medium mt-1">Cross-facility aggregate intelligence & forecasting</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Volume</p>
              <p className="text-lg font-black text-slate-900">{totalUnits} <span className="text-xs text-slate-400 font-bold ml-0.5">Units</span></p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Versatility (O-)</p>
              <p className="text-lg font-black text-red-600">{versatilityIndex}%</p>
            </div>
          </div>
        </div>

        {/* 📊 Main Intelligence Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodGroups.map((bg, i) => {
            const count = inventoryDepth[bg] || 0;
            const status = getStatus(count);
            const StatusIcon = status.icon;

            return (
              <motion.div 
                key={bg}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`p-5 rounded-[2rem] border transition-all hover:shadow-xl hover:shadow-slate-200/50 group ${
                  status.color === 'red' ? 'bg-red-50/30 border-red-100' : 
                  status.color === 'amber' ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50/50 border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                    status.color === 'red' ? 'bg-red-600 text-white' : 
                    status.color === 'amber' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    {bg}
                  </div>
                  <div className={`text-${status.color}-600 bg-white p-1.5 rounded-lg shadow-sm`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-black text-slate-900">{count} <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Units</span></p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-widest text-${status.color}-600`}>{status.label}</span>
                    <TrendingDown className={`w-3 h-3 text-${status.color}-400 opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="mt-4 h-1.5 bg-white rounded-full overflow-hidden border border-slate-100 ring-2 ring-transparent group-hover:ring-slate-100 transition-all">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((count / 50) * 100, 100)}%` }}
                    className={`h-full rounded-full ${
                      status.color === 'red' ? 'bg-red-600' : 
                      status.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* 📈 Integrated Analytics Bar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-center bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
           
           <div className="xl:col-span-1 space-y-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full w-fit">
                <Zap className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Tactical Insight</span>
              </div>
              
              <h3 className="text-lg font-black text-slate-800 leading-tight">
                {criticalGroups.length > 0 
                  ? `Critical shortage detected in ${criticalGroups.join(', ')} groups.`
                  : "Inventory health is currently within optimal range."}
              </h3>
              
              <p className="text-sm text-slate-500 font-medium">
                {criticalGroups.length > 0
                  ? `AI recommends immediate donor outreach for ${criticalGroups[0]}. Expected depletion in < 48 hours.`
                  : "No immediate intervention required. Seasonal trends suggest stable inflow for the next 7 days."}
              </p>

              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-red-200">
                  Launch Drive
                </button>
                <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                  Full Report
                </button>
              </div>
           </div>

           <div className="xl:col-span-2 h-[200px] bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Depth Chart</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-600"></div>
                   <span className="text-[10px] font-bold text-slate-600">Real-time Data</span>
                </div>
             </div>
             <BloodInventoryChart inventoryDepth={inventoryDepth} />
           </div>

        </div>

      </div>
    </div>
  );
};

export default InventoryIntelHub;
