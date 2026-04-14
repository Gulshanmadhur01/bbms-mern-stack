import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Building, Globe, Phone, Mail, Filter, Database, RefreshCw, ChevronLeft, ChevronRight, Activity, Calendar } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { indiaData } from "../utils/indiaData";

const BloodCenterDirectory = () => {
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
      const response = await fetch(`${API_BASE_URL}/search/directory?${queryParams}`);
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error("Directory search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center md:text-left border-b pb-6 border-slate-200 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-red-800 mb-2">Blood Center Directory</h1>
            <p className="text-slate-500 font-medium">Nearest Blood Center(BB)/ Blood Storage Unit(BSU)</p>
          </div>
          <div className="flex gap-2">
            <Link to="/availability" className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> CHECK AVAILABILITY
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-slate-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
            
            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="lg:col-span-1">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                SEARCH
              </button>
            </div>

          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 min-h-[400px]">
          
          <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
             <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                <Building className="w-4 h-4 text-red-600" />
                <span>Verified Blood Centers Found: {results.length}</span>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">S.No.</th>
                  <th className="px-6 py-5">Blood Center</th>
                  <th className="px-6 py-5 text-center">Category</th>
                  <th className="px-6 py-5 text-center">Distance</th>
                  <th className="px-6 py-5">Contact Details</th>
                  <th className="px-6 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-slate-400">{row.sNo}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-800 text-lg group-hover:text-red-700 transition-colors">{row.name}</span>
                           <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                             <MapPin className="w-3 h-3" /> {row.location}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                          row.category === "Government" 
                            ? "bg-blue-50 text-blue-700 border-blue-100" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}>
                           {row.category || "Private"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <div className="flex flex-col items-center">
                           <span className="text-sm font-black text-slate-400 group-hover:text-red-400 transition-colors">
                             --
                           </span>
                           <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">Locating...</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone className="w-3 h-3 text-red-500" /> {row.phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail className="w-3 h-3 text-red-500" /> {row.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                           <Link to="/availability" className="text-[10px] font-bold border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-center hover:bg-emerald-50 transition-all uppercase">Check Stock</Link>
                           <Link to="/camp-schedule" className="text-[10px] font-bold border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-center hover:bg-red-50 transition-all uppercase">View Camps</Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 animate-pulse">
                         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                            <Globe className="w-10 h-10 text-slate-300" />
                         </div>
                         <div>
                            <p className="text-xl font-bold text-slate-400">{searched ? "No blood centers found in this region" : "Search to explore blood banks"}</p>
                            <p className="text-sm text-slate-300">Choose a state and district to find centers near you</p>
                         </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50/30 px-8 py-6 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
             <div>Showing {results.length} of {results.length} Entities</div>
             <div className="flex items-center gap-4">
                <button className="opacity-50 cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Prev</button>
                <div className="bg-red-800 text-white w-6 h-6 flex items-center justify-center rounded">1</div>
                <button className="opacity-50 cursor-not-allowed flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BloodCenterDirectory;
