import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Droplet, Filter, Database, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { indiaData } from "../utils/indiaData";

const BloodAvailability = () => {
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    bloodGroup: "All",
    componentType: "All",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const locations = indiaData;

  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const components = ["All", "Whole Blood", "Packed Red Blood Cells", "Plasma", "Platelets"];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/search/availability?${queryParams}`);
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left border-b pb-6 border-slate-200">
          <h1 className="text-3xl md:text-5xl font-bold text-red-800 mb-2">Blood Availability</h1>
          <p className="text-slate-500 font-medium">Search for real-time blood stock across our national network</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-slate-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end">
            
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Group</label>
              <select 
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
                value={filters.bloodGroup}
                onChange={(e) => setFilters({...filters, bloodGroup: e.target.value})}
              >
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Component</label>
              <select 
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
                value={filters.componentType}
                onChange={(e) => setFilters({...filters, componentType: e.target.value})}
              >
                {components.map(c => <option key={c} value={c}>{c}</option>)}
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

          {/* Selected Badges */}
          {(filters.bloodGroup !== 'All' || filters.componentType !== 'All') && (
            <div className="flex gap-2 mt-6 animate-in fade-in slide-in-from-top-1">
               <span className="text-xs font-bold text-slate-400 self-center mr-2">SELECTED FIELDS:</span>
               {filters.bloodGroup !== 'All' && (
                 <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">{filters.bloodGroup}</span>
               )}
               {filters.componentType !== 'All' && (
                 <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{filters.componentType}</span>
               )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 min-h-[400px]">
          
          <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
             <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>Found {results.length} results</span>
             </div>
             <div className="flex gap-4">
                <Link to="/register/donor" className="text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold hover:bg-red-200 transition-colors">QUICK DONATE</Link>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">S.No.</th>
                  <th className="px-6 py-5">Blood Center</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Availability</th>
                  <th className="px-6 py-5">Last Updated</th>
                  <th className="px-6 py-5">Type / Component</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-slate-400">{row.sNo}</td>
                      <td className="px-6 py-5 font-bold text-slate-800">
                        <div className="flex flex-col">
                           <span>{row.bloodCenter}</span>
                           <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 uppercase tracking-tighter">
                             <MapPin className="w-2.5 h-2.5" /> {row.location}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                           {row.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                           <span className={`text-lg font-black ${row.availability > 10 ? "text-green-600" : "text-amber-500"}`}>
                             {row.availability}
                           </span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase">Units</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        {new Date(row.lastUpdated).toLocaleDateString()} at {new Date(row.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-red-600 fill-red-100" />
                          <span className="text-sm font-bold text-slate-700">{row.type}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 animate-pulse">
                         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                            <Database className="w-10 h-10 text-slate-300" />
                         </div>
                         <div>
                            <p className="text-xl font-bold text-slate-400">{searched ? "No matching data found" : "Select filters to browse stock"}</p>
                            <p className="text-sm text-slate-300">Try changing location or blood group requirements</p>
                         </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="bg-slate-50/30 px-8 py-6 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
             <div>Showing {results.length} of {results.length} Entries</div>
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

export default BloodAvailability;
