import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState, useEffect } from "react";
import { Megaphone, X, AlertTriangle, Zap, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BroadcastBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [visible, setVisible] = useState(true);

  const fetchAnnouncement = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/system/announcement`);
      const data = await res.json();
      if (data && data.announcement && data.announcement.active) {
        setAnnouncement({
          text: data.announcement.text,
          mode: data.mode || "standard",
          active: data.announcement.active
        });
      } else {
        setAnnouncement(null);
      }
    } catch (err) {
      console.error("Announcement fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    // Poll for changes every 2 minutes
    const interval = setInterval(fetchAnnouncement, 120000);
    return () => clearInterval(interval);
  }, []);

  if (!announcement || !visible) return null;

  const isEmergency = announcement.mode === "emergency";

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`relative z-[60] overflow-hidden ${
          isEmergency 
          ? "bg-red-600 text-white" 
          : "bg-indigo-600 text-white border-b border-indigo-400/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className={`flex p-2 rounded-lg ${isEmergency ? "bg-red-800" : "bg-indigo-800 shadow-inner"}`}>
                {isEmergency ? (
                  <Radio className="h-4 w-4 text-white animate-pulse" aria-hidden="true" />
                ) : (
                  <Megaphone className="h-4 w-4 text-white" aria-hidden="true" />
                )}
              </span>
              <p className="ml-3 font-black text-sm uppercase tracking-tighter truncate">
                <span className="md:hidden">
                    {isEmergency ? "URGENT:" : "UPDATE:"} {announcement.text}
                </span>
                <span className="hidden md:inline">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${isEmergency ? "bg-white text-red-600" : "bg-indigo-200 text-indigo-800"} mr-3`}>
                    {announcement.mode.toUpperCase()}
                  </span>
                  {announcement.text}
                </span>
              </p>
            </div>
            
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="-mr-1 flex p-2 rounded-md hover:bg-white/10 focus:outline-none transition-colors"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated Background Pulse for Emergency */}
        {isEmergency && (
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/20 pointer-events-none"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BroadcastBanner;
