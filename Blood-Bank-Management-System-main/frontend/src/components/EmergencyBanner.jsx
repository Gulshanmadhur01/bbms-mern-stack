import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState, useEffect } from "react";

export default function EmergencyBanner() {
  const [show, setShow] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/system/announcement`);
        const data = await res.json();
        if (data.success && data.announcement.active) {
          setAnnouncement(data.announcement.text);
          setIsEmergency(data.mode === "emergency");
          setShow(true);
        } else {
          setShow(false);
        }
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      }
    };

    fetchAnnouncement();
    // Poll every 1 minute for updates
    const interval = setInterval(fetchAnnouncement, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed top-0 left-0 w-full z-[60] text-white shadow-md transition-colors ${
      isEmergency ? "bg-gradient-to-r from-red-600 to-red-800" : "bg-gradient-to-r from-blue-600 to-blue-800"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-sm">
        
        <div className="flex items-center gap-2">
          <span className="font-bold animate-pulse">
            {isEmergency ? "🚨 URGENT:" : "📢 INFO:"}
          </span>
          <span className="ml-2">
            {announcement}
          </span>
        </div>

        <button
          onClick={() => setShow(false)}
          className="text-white hover:scale-110 transition bg-white/10 p-1 rounded-full"
        >
          ✕
        </button>

      </div>
    </div>
  );
}