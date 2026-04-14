import { useState, useEffect } from 'react';
import { Thermometer, ThermometerSnowflake, ThermometerSun, Cpu, Zap, Beaker, Server, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const IoTTrackerWidget = () => {
    // Initial simulated states for 3 major storage hubs
    const [hubs, setHubs] = useState([
        { id: "HUB-01", name: "Central Blood Reserve", temp: 4.2, humidity: 45, status: "Optimal" },
        { id: "HUB-02", name: "Northern Cold Storage", temp: 3.8, humidity: 42, status: "Optimal" },
        { id: "HUB-03", name: "Emergency Mobile Unit", temp: 5.1, humidity: 50, status: "Warning" }
    ]);

    // Fluctuation Simulation Web Worker / Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setHubs(currentHubs => currentHubs.map(hub => {
                // Random fluctuation between -0.3 and +0.3
                const fluctuation = (Math.random() * 0.6 - 0.3);
                let newTemp = fetchTemp(hub.temp + fluctuation);
                
                // Determine status logic based on Red Cell storage protocol (Ideally 2°C - 6°C)
                let newStatus = "Optimal";
                if (newTemp > 5.5 || newTemp < 2.5) newStatus = "Warning";
                if (newTemp > 8.0 || newTemp < 1.0) newStatus = "Critical";

                // Add slight drift towards stabilization if it gets too hot or cold
                if (newTemp > 6.0) newTemp -= 0.4;
                if (newTemp < 2.0) newTemp += 0.4;

                return { ...hub, temp: newTemp, status: newStatus };
            }));
        }, 4000); // Shift every 4 seconds to look native and live

        return () => clearInterval(interval);
    }, []);

    // Float parsing helper
    const fetchTemp = (val) => Number(val.toFixed(1));

    return (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-cyan-500/20">
            {/* Background IoT Glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none rounded-full"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="p-2 bg-slate-800 rounded-xl border border-cyan-500/30">
                                <Server className="w-5 h-5 text-cyan-400" />
                            </div>
                            IoT Hardware Telemetry
                        </h2>
                        <p className="text-slate-400 font-medium text-xs mt-1 ml-12">Live thermal stream from active blood refrigeration nodes</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Nodes Online</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {hubs.map((hub, index) => {
                        const isOptimal = hub.status === "Optimal";
                        const isWarning = hub.status === "Warning";
                        const isCritical = hub.status === "Critical";

                        return (
                            <motion.div 
                                key={hub.id}
                                layout
                                className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex items-center justify-between backdrop-blur-sm hover:bg-slate-800/80 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-700">
                                        <Cpu className="w-4 h-4 text-slate-400 mb-1" />
                                        <span className="text-[9px] font-bold text-slate-500 tracking-wider font-mono">{hub.id}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-200">{hub.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Zap className="w-3 h-3 text-cyan-500" />
                                                <span className="text-xs text-slate-400 font-mono">220V</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-3 h-3 text-emerald-500" />
                                                <span className="text-xs text-slate-400 font-mono">{hub.humidity}% RH</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-2xl font-black font-mono tracking-tighter ${
                                                isOptimal ? "text-emerald-400" :
                                                isWarning ? "text-amber-400" : "text-red-500"
                                            }`}>
                                                {hub.temp.toFixed(1)}°C
                                            </span>
                                            {isOptimal ? <ThermometerSnowflake className="w-5 h-5 text-emerald-400" /> :
                                             isWarning ? <Thermometer className="w-5 h-5 text-amber-400" /> : <ThermometerSun className="w-5 h-5 text-red-500" />}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                                            isOptimal ? "text-emerald-500/80" :
                                            isWarning ? "text-amber-500/80" : "text-red-500/80"
                                        }`}>
                                            STATUS: {hub.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default IoTTrackerWidget;
