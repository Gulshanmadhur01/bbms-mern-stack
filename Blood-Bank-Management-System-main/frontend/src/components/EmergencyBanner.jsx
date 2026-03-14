import React, { useState } from "react";

export default function EmergencyBanner() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-sm animate-pulse">
        
        <div>
          <span className="font-bold">🚨 URGENT:</span>
          <span className="ml-2">
            O- Blood Required in Patna District
          </span>
        </div>

        <button
          onClick={() => setShow(false)}
          className="text-white hover:scale-110 transition"
        >
          ✕
        </button>

      </div>
    </div>
  );
}