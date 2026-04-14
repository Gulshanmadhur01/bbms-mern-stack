import API_BASE_URL from "../utils/apiConfig.js";
import { useState } from 'react';
import { BrainCircuit, AlertTriangle, Send, CheckCircle2, Loader2, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AIPredictionWidget = ({ predictions = [] }) => {
  const [loading, setLoading] = useState(false);
  const [sentBlasts, setSentBlasts] = useState({});

  const triggerBlast = async (bloodGroup) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/admin/trigger-shortage-alert`,
        {
          bloodGroup,
          message: "Urgent AI Prediction: Be prepared for a shortage. We need your help immediately to build our reserves.",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || `Automated blast sent to targeted ${bloodGroup} donors!`);
      setSentBlasts((prev) => ({ ...prev, [bloodGroup]: true }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger automation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-indigo-500/20 relative overflow-hidden group">
      {/* 🧠 AI Glow Effect Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            AI Prediction Engine
          </h2>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Live Neural Analytics
            </span>
          </div>
        </div>

        {predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/5 rounded-3xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
            <p className="text-slate-300 font-bold">All systems optimal.</p>
            <p className="text-slate-500 text-sm">No AI anomalies detected in inventory forecasting.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.slice(0, 3).map((pred, i) => {
              const isCritical = pred.status === "critical";
              const isWarning = pred.status === "warning";
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className={`p-5 rounded-3xl border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/5 backdrop-blur-sm ${
                    isCritical
                      ? "border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10"
                      : isWarning
                      ? "border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10"
                      : "border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-500/10"
                  } transition-all`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-3 rounded-2xl ${
                        isCritical
                          ? "bg-red-500/20 text-red-400"
                          : isWarning
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}
                    >
                      {isCritical ? <AlertTriangle className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                            isCritical
                              ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                              : isWarning
                              ? "bg-amber-500 text-white"
                              : "bg-indigo-500 text-white"
                          }`}
                        >
                          {pred.bloodGroup} Shortage
                        </span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                          {pred.suggestedAction}
                        </span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed mt-2">{pred.message}</p>
                    </div>
                  </div>

                  {/* Automation Action Button */}
                  {(isCritical || isWarning) && (
                    <button
                      onClick={() => triggerBlast(pred.bloodGroup)}
                      disabled={loading || sentBlasts[pred.bloodGroup]}
                      className={`w-full md:w-auto px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${
                        sentBlasts[pred.bloodGroup]
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                          : isCritical
                          ? "bg-red-500 hover:bg-red-400 text-white shadow-red-500/20"
                          : "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20"
                      }`}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : sentBlasts[pred.bloodGroup] ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {sentBlasts[pred.bloodGroup] ? "Blast Sent" : "Execute Blast"}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPredictionWidget;
