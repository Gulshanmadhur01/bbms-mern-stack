import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Clock, Phone, Users, Filter, Database, RefreshCw, ChevronLeft, ChevronRight, Tent, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { indiaData } from "../utils/indiaData";

const CampSchedule = () => {
  const [filters, setFilters] = useState({
    state: "",
    district: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const locations = indiaData;

  const handleSearch = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const queryParams = new URLSearchParams({
        state: filters.state,
        district: filters.district
      }).toString();
      const response = await fetch(`${API_BASE_URL}/search/camps?${queryParams}`);
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error("Camp search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left border-b pb-6 border-slate-200 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-red-800 mb-2">Camp Schedule</h1>
            <p className="text-slate-500 font-medium tracking-tight">Search for organized blood donation camps in your locality</p>
          </div>
          <div className="flex gap-2">
            <Link to="/register-camp" className="bg-red-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-red-200 transition-all flex items-center gap-2">
                <Tent className="w-4 h-4" /> ORGANIZE A CAMP
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-slate-100 flex flex-col md:flex-row gap-6 items-end">
            
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select State</label>
              <select 
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
                value={filters.state}
                onChange={(e) => setFilters({...filters, state: e.target.value, district: ""})}
              >
                <option value="">Select State</option>
                {Object.keys(locations).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select District</label>
              <select 
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 transition-all cursor-pointer disabled:opacity-50"
                disabled={!filters.state}
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
              >
                <option value="">Select District</option>
                {filters.state && locations[filters.state].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="md:w-48">
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                SEARCH
              </button>
            </div>
        </div>

        {/* Informational Alert */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-10 flex items-center gap-4 text-red-800/80">
           <div className="bg-red-100 p-2 rounded-lg">
              <RefreshCw className="w-5 h-5 text-red-600" />
           </div>
           <div>
              <p className="text-xs font-bold uppercase tracking-tight">Stay Notified!</p>
              <p className="text-sm">Get alerts for upcoming camps near you by registering as a donor.</p>
           </div>
           <Link to="/register/donor" className="ml-auto bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-red-700">ENROLL NOW</Link>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 min-h-[400px]">
          
          <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100">
             <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-red-600" />
                <span>Search Results: {results.length} Camps Found</span>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">S.No.</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Camp Details</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5 text-center">Contact</th>
                  <th className="px-6 py-5">Conducted By</th>
                  <th className="px-6 py-5">Organized By</th>
                  <th className="px-6 py-5">Time</th>
                  <th className="px-6 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-xs font-bold text-slate-400">{row.sNo}</td>
                      <td className="px-6 py-5">
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{new Date(row.date).toLocaleDateString()}</span>
                            <span className="text-[10px] text-red-600 font-bold border border-red-100 rounded px-1.5 py-0.5 mt-0.5 w-fit uppercase">Upcoming</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <span className="font-bold text-slate-700">{row.campDetail}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 text-slate-500 font-medium italic">
                           <MapPin className="w-3.5 h-3.5 text-red-400" /> {row.location}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 cursor-help transition-colors" title={row.contact}>
                          <Phone className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-500 uppercase text-[10px]">{row.conductedBy}</td>
                      <td className="px-6 py-5 text-slate-600 font-medium">{row.organizedBy}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock className="w-4 h-4 text-red-400" />
                          <span className="font-bold">{row.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <button className="bg-red-50 text-red-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-700 hover:text-white transition-all">VIEW LOCATION</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 animate-pulse">
                         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                            <Tent className="w-10 h-10 text-slate-300" />
                         </div>
                         <div>
                            <p className="text-xl font-bold text-slate-400">{searched ? "No blood camps scheduled currently" : "Select location to search camps"}</p>
                            <p className="text-sm text-slate-300 tracking-tight">Try changing location filters or check back later</p>
                         </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50/30 px-8 py-6 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
             <div className="flex items-center gap-2 italic">
                <CheckCircle className="w-3.5 h-3.5 text-red-500" />
                Showing Only Verified Upcoming Camps
             </div>
             <div className="flex items-center gap-4">
                <button className="opacity-50 cursor-not-allowed">PREVIOUS</button>
                <div className="bg-red-800 text-white w-6 h-6 flex items-center justify-center rounded">1</div>
                <button className="opacity-50 cursor-not-allowed">NEXT</button>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CampSchedule;
