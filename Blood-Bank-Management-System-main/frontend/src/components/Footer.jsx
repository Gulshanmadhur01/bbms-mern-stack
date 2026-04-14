import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, 
  ArrowUp, Send, CheckCircle, ExternalLink, Shield, Droplets, Info, FileText, Users, Award, AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          setIsSubscribed(true);
          setEmail("");
          setTimeout(() => setIsSubscribed(false), 5000);
        } else {
          alert(data.message || "Subscription failed. Please try again.");
        }
      } catch (error) {
        console.error("Newsletter error:", error);
        alert("Server error. Please try again later.");
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Our Mission", path: "/mission" },
        { name: "Success Stories", path: "/stories" },
        { name: "News & Updates", path: "/news" },
        { name: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "For Donors",
      links: [
        { name: "Become a Donor", path: "/register/donor" },
        { name: "Eligibility Criteria", path: "/eligibility" },
        { name: "Donation Process", path: "/process" },
        { name: "Donor Benefits", path: "/benefits" },
        { name: "Find Camps", path: "/camp-schedule" },
      ],
    },
    {
      title: "For Facilities",
      links: [
        { name: "Partner with Us", path: "/register/facility" },
        { name: "Blood Request", path: "/hospital/blood-request-create" },
        { name: "Inventory Access", path: "/availability" },
        { name: "Emergency Protocol", path: "/emergency" },
        { name: "Lab Directory", path: "/directory" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "#" },
    { icon: Twitter, name: "Twitter", url: "#" },
    { icon: Instagram, name: "Instagram", url: "#" },
    { icon: Linkedin, name: "LinkedIn", url: "#" },
  ];

  return (
    <footer className="bg-slate-900 text-white relative">
      {/* Newsletter Section */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-slate-400">
                Join our newsletter to receive the latest updates on blood needs and community impact stories.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-lg">
              <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                  {!isSubscribed ? (
                    <motion.div 
                      key="input"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex w-full"
                    >
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        className="w-full bg-slate-800 border border-slate-700 rounded-l-xl px-6 py-4 focus:outline-none focus:border-red-500 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button 
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-r-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
                      >
                        Subscribe <Send className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full bg-green-500/10 border border-green-500/50 rounded-xl px-6 py-4 text-green-400 flex items-center justify-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Awesome! You've been subscribed.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl">
                <Droplets className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Blood Bank</h2>
                <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase mt-1">Management System</p>
              </div>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 font-light">
              We leverage cutting-edge technology to synchronize the global blood supply chain, ensuring life-saving interventions are just a heartbeat away.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-all shadow-lg"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                  <div className="w-1 h-3 bg-red-600 rounded-full"></div>
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        to={link.path}
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-0 h-px bg-red-600 transition-all group-hover:w-3"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Action & Contact Strip */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap gap-8 justify-between items-center bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
                 <Phone className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Emergency Hotline</p>
                 <p className="text-white font-bold">1-800-BLOOD-NOW</p>
               </div>
             </div>
             <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-8">
               <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                 <Mail className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Support Email</p>
                 <p className="text-white font-bold">support@bbms-system.org</p>
               </div>
             </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-2xl bg-slate-700 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-slate-950 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>© {currentYear} Blood Bank Management System Intelligence. All rights reserved.</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies Page</Link>
          </div>
        </div>
      </div>
      
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
    </footer>
  );
};

export default Footer;


