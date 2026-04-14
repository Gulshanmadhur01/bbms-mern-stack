import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState } from "react";
import { Send, MapPin, Building, Phone, Mail, User, Info, Calendar, Clock, Tent, ShieldCheck, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { indiaData } from "../utils/indiaData";

const CampRegistration = () => {
  const [formData, setFormData] = useState({
    orgType: "",
    orgName: "",
    organizerName: "",
    organizerPhone: "",
    organizerEmail: "",
    campName: "",
    "location.address": "",
    "location.city": "",
    "location.district": "",
    "location.state": "",
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    estimatedParticipants: 0,
    remarks: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const orgTypes = ["College", "NGO", "Hospital", "Corporate", "Religious", "Other"];
  const locations = indiaData;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
         ...formData,
         location: {
            address: formData["location.address"],
            city: formData["location.city"],
            district: formData["location.district"],
            state: formData["location.state"]
         },
         enddate: new Date(new Date(formData.date).getTime() + 86400000), 
         capacity: formData.estimatedParticipants || 50
      };

      const response = await fetch(`${API_BASE_URL}/search/register-camp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed. Please check backend connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center py-20 px-4">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 max-w-2xl text-center">
                    <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-200">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 mb-6 uppercase tracking-tighter">Registration Success!</h1>
                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                        Dhanyawad! Aapka **Voluntary Camp** request humein mil gaya hai. 
                        Admin team verification ke baad aapko call karegi.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/camp-schedule" className="bg-red-800 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2">
                             <Calendar className="w-5 h-5" /> VIEW SCHEDULE
                        </Link>
                        <button onClick={() => setSuccess(false)} className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">NEW REQUEST</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
            
            {/* Split Header Section */}
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-bounce">
                        <Tent className="w-3.5 h-3.5" /> ORGANIZE A LIFE-SAVING EVENT
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
                        HOST A <span className="text-red-700">BLOOD CAMP</span>
                    </h1>
                    <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-xl mx-auto lg:mx-0">
                        Empower your community. Fill out our simplified registration form to partner with national health services for a mobile donation unit.
                    </p>
                </div>
                <div className="lg:w-1/2 relative bg-red-50/50 rounded-[4rem] p-10 flex items-center justify-center min-h-[400px]">
                    <img 
                        src="/assets/blood_camp_illustration.png" 
                        alt="3D Donation Illustration" 
                        className="w-full max-w-[400px] drop-shadow-2xl animate-pulse cursor-pointer hover:scale-105 transition-transform" 
                    />
                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-white/40 rounded-full blur-2xl font-bold"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-red-200/20 rounded-full blur-3xl"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="relative">
                <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-slate-100 hidden lg:block pointer-events-none"></div>

                <div className="space-y-16">
                    {/* Part 1: Organization */}
                    <div className="relative pl-0 lg:pl-20 animate-in slide-in-from-bottom-10 duration-700">
                        <div className="absolute left-0 top-0 w-20 h-20 bg-red-800 text-white rounded-3xl hidden lg:flex items-center justify-center shadow-xl shadow-red-100 text-2xl font-black z-10 border-4 border-white transition-all hover:scale-110">
                            01
                        </div>
                        <div className="bg-slate-50/50 rounded-[3rem] p-10 lg:p-14 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                            <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4 uppercase tracking-tighter">
                                <Building className="w-8 h-8 text-red-700" />
                                Organization & Lead Contact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Org Category *</label>
                                    <select 
                                        name="orgType" required
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 focus:ring-0 transition-all outline-none"
                                        value={formData.orgType} onChange={handleInputChange}
                                    >
                                        <option value="">Select Category</option>
                                        {orgTypes.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Official Org Name *</label>
                                    <input name="orgName" required placeholder="Organization Full Name" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all" value={formData.orgName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Organizer Full Name *</label>
                                    <input name="organizerName" required placeholder="Contact Person" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all" value={formData.organizerName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mobile No *</label>
                                    <input name="organizerPhone" required placeholder="+91 XXXX XXXX" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all" value={formData.organizerPhone} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Part 2: Venue */}
                    <div className="relative pl-0 lg:pl-20 animate-in slide-in-from-bottom-10 duration-700 delay-150">
                        <div className="absolute left-0 top-0 w-20 h-20 bg-slate-800 text-white rounded-3xl hidden lg:flex items-center justify-center shadow-xl shadow-slate-100 text-2xl font-black z-10 border-4 border-white hover:scale-110 transition-all">
                            02
                        </div>
                        <div className="bg-slate-50/50 rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                            <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4 uppercase tracking-tighter">
                                <MapPin className="w-8 h-8 text-red-700" />
                                Venue & Geography
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Venue Address *</label>
                                    <input name="location.address" required placeholder="Street, Building, Landmark" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all font-bold" value={formData["location.address"]} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">State *</label>
                                    <select 
                                        name="location.state" required
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all"
                                        value={formData["location.state"]} onChange={handleInputChange}
                                    >
                                        <option value="">Select State</option>
                                        {Object.keys(locations).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">District / City *</label>
                                    <select 
                                        name="location.city" required
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all disabled:opacity-50"
                                        disabled={!formData["location.state"]}
                                        value={formData["location.city"]} onChange={handleInputChange}
                                    >
                                        <option value="">Select District</option>
                                        {formData["location.state"] && locations[formData["location.state"]].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Part 3: Timing */}
                    <div className="relative pl-0 lg:pl-20 animate-in slide-in-from-bottom-10 duration-700 delay-300">
                        <div className="absolute left-0 top-0 w-20 h-20 bg-red-700 text-white rounded-3xl hidden lg:flex items-center justify-center shadow-xl shadow-red-100 text-2xl font-black z-10 border-4 border-white hover:scale-110 transition-all">
                            03
                        </div>
                        <div className="bg-slate-50/50 rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                            <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4 uppercase tracking-tighter">
                                <Clock className="w-8 h-8 text-red-700" />
                                Event Timeline
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Proposed Camp Date *</label>
                                    <input name="date" type="date" required className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all" value={formData.date} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time *</label>
                                    <input name="startTime" type="time" required className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all" value={formData.startTime} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time *</label>
                                    <input name="endTime" type="time" required className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-red-500 transition-all" value={formData.endTime} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Submit Bar (Visible on scroll) */}
                <div className="mt-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        A 15-day notice is mandatory for resource allocation.
                    </div>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full lg:w-[400px] bg-red-800 text-white font-black py-6 rounded-[2.5rem] text-xl shadow-2xl shadow-red-200 hover:bg-red-900 transition-all uppercase tracking-widest flex items-center justify-center gap-4 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        {submitting ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                        SUBMIT REQUEST
                    </button>
                    <p className="text-slate-400 text-xs font-medium">By clicking submit, you agree to comply with medical hosting standards.</p>
                </div>

            </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CampRegistration;
