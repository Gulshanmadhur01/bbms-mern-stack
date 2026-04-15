import React, { useState } from "react";
import {
  ArrowRight,
  Heart,
  Users,
  MapPin,
  Clock,
  Droplets,
  Shield,
  Zap,
  Search,
  Bell,
  Calendar,
  FileText,
  Award,
  CheckCircle,
  Target,
  Activity,
  RefreshCw,
  AlertTriangle,
  Stethoscope,
  Hospital,
  BrainCircuit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Footer from "../components/Footer";
import BroadcastBanner from "../components/BroadcastBanner";

const LandingPage = () => {
  const [activeService, setActiveService] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizResult, setQuizResult] = useState(null);

  const sectionsVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const stats = [
    { icon: Users, label: "Lives Saved", value: "10,000+" },
    { icon: Heart, label: "Blood Units", value: "50,000+" },
    { icon: MapPin, label: "Partner Hospitals", value: "150+" },
    { icon: Clock, label: "Response Time", value: "< 30min" },
  ];

  const features = [
    {
      icon: Users,
      title: "Easy Donor Registration",
      description:
        "Simple and secure donor registration process with medical history tracking and eligibility verification.",
      color: "red",
    },
    {
      icon: Droplets,
      title: "Real-time Inventory Tracking",
      description:
        "Monitor blood inventory levels, expiration dates, and distribution in real-time across all partner facilities.",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Quick Response",
      description:
        "Emergency request system with automated matching and notification to ensure rapid response in critical situations.",
      color: "green",
    },
  ];

  const processSteps = [
    {
      step: "01",
      icon: FileText,
      title: "Register & Screen",
      description: "Complete simple registration and health screening process",
    },
    {
      step: "02",
      icon: Search,
      title: "Find Match",
      description: "Our system matches blood needs with compatible donors",
    },
    {
      step: "03",
      icon: Bell,
      title: "Get Notified",
      description: "Receive instant alerts for urgent needs in your area",
    },
    {
      step: "04",
      title: "Donate & Save Lives",
      description: "Visit approved centers and make your life-saving donation",
    },
  ];

  const bloodTypes = [
    { type: "A+", need: "High", donors: "32%" },
    { type: "A-", need: "Critical", donors: "8%" },
    { type: "B+", need: "Medium", donors: "12%" },
    { type: "B-", need: "High", donors: "3%" },
    { type: "O+", need: "High", donors: "35%" },
    { type: "O-", need: "Critical", donors: "5%" },
    { type: "AB+", need: "Low", donors: "4%" },
    { type: "AB-", need: "Medium", donors: "1%" },
  ];

  const donationFacts = [
    {
      icon: Heart,
      title: "One Donation, Multiple Lives",
      description:
        "A single blood donation can save up to 3 lives. Your one hour can give someone a lifetime.",
      stat: "3 Lives Saved",
    },
    {
      icon: RefreshCw,
      title: "Blood Regeneration",
      description:
        "Your body replaces the blood you donate within 24-48 hours. The red blood cells are completely replaced in 4-6 weeks.",
      stat: "48 Hours",
    },
    {
      icon: Users,
      title: "Constant Need",
      description:
        "Every 2 seconds, someone needs blood. Your regular donation ensures continuous supply for emergencies.",
      stat: "Every 2 Seconds",
    },
    {
      icon: AlertTriangle,
      title: "Short Shelf Life",
      description:
        "Red blood cells last only 42 days, platelets just 5 days. Regular donations are essential to maintain supply.",
      stat: "42 Days Shelf Life",
    },
  ];

  const eligibilityInfo = [
    {
      icon: CheckCircle,
      title: "Who Can Donate",
      items: [
        "Age 17-75 (16 with parental consent)",
        "Weight at least 110 lbs (50 kg)",
        "Good general health",
        "No flu or cold symptoms",
      ],
    },
    {
      icon: Stethoscope,
      title: "Health Benefits",
      items: [
        "Free health screening",
        "Burns 650 calories per donation",
        "Reduces risk of heart disease",
        "Stimulates blood cell production",
      ],
    },
    {
      icon: Shield,
      title: "Safety First",
      items: [
        "Sterile, disposable equipment",
        "Trained medical staff",
        "Comfortable environment",
        "Post-donation care",
      ],
    },
  ];

  const emergencyNeeds = [
    { type: "Accident Victims", units: "Up to 100 units", icon: AlertTriangle },
    { type: "Cancer Patients", units: "8 units weekly", icon: Heart },
    { type: "Surgery Patients", units: "5-10 units", icon: Stethoscope },
    { type: "Burn Victims", units: "20+ units", icon: Activity },
  ];



  const servicesData = [
    {
      id: "Blood Availability",
      title: "Blood Availability Search",
      desc: "Our real-time search engine allows you to check blood stock across various partner blood banks and hospitals instantly. Find the right blood group when every second counts.",
      btnText: "Search Now",
      btnLink: "/availability", 
      icon: Search,
      illustration: "/assets/blood_bag.png",
      anchor: "bloodtypes"
    },
    {
      id: "Blood Center",
      title: "Blood Center Directory",
      desc: "Access a comprehensive directory of all verified blood banks, storage centers, and collection labs in your region. View contact details, location maps, and operating hours.",
      btnText: "View Directory",
      btnLink: "/directory",
      icon: MapPin,
      illustration: "/assets/blood_bag.png",
      anchor: "about"
    },
    {
      id: "Donation Camps",
      title: "Blood Donation Camps",
      desc: "Stay updated on upcoming mobile blood donation camps organized by our partners. Join community events and contribute to the noble cause near your neighborhood.",
      btnText: "Find Camps",
      btnLink: "/camp-schedule",
      icon: Calendar,
      illustration: "/assets/blood_bag.png"
    },
    {
      id: "Donor Login",
      title: "Donor Login",
      desc: "The Donor Login portal allows registered donors to securely access their profiles, view donation history, update personal details, and receive notifications about nearby camps.",
      btnText: "Donor Login",
      btnLink: "/login",
      icon: Users,
      illustration: "/assets/blood_bag.png"
    },
    {
      id: "Register Camps",
      title: "Register Voluntary Camps",
      desc: "Are you an organization looking to host a blood donation camp? Submit your request here to get verified and list your camp on our national directory within minutes.",
      btnText: "Register Camp",
      btnLink: "/register-camp",
      icon: Hospital,
      illustration: "/assets/blood_bag.png"
    }
  ];

  return (
    <div className="min-h-screen pt-18 bg-gradient-to-b from-slate-50 to-red-50">
      <BroadcastBanner />
      <Header />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-900 text-white"
      >
        <div className="absolute inset-0 opacity-20"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <Heart className="w-4 h-4" />
              Saving Lives Every Day
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Connect{" "}
              <span className="bg-gradient-to-r from-red-200 to-red-300 bg-clip-text text-transparent">
                Blood Donors
              </span>{" "}
              with Those in Need
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-red-100 mb-8 max-w-2xl mx-auto"
            >
              Our advanced blood bank management system ensures efficient
              donation, storage, and distribution of blood products to save
              lives when every second counts.
            </motion.p>
          <div className="scroll-smooth"></div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register/donor">
                <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-xl bg-white text-red-700 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <button
               onClick={() => {
             const section = document.getElementById("about");
              section?.scrollIntoView({ behavior: "smooth" });
              }}
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-xl border-2 border-white text-white hover:bg-white/10 transition-all duration-300">
              
  Learn More
</button>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16"
            viewBox="0 0 1200 150"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V150H0V90.83C36.67,85.19,76.33,76,112,69.33C160.67,59.67,224.67,47.33,321.39,56.44Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </motion.section>


      {/* Stats Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-200 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-700" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-red-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-red-700 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>



      {/* Blood Need Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-20 bg-slate-50" id="bloodtypes"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Current Blood Needs
            </h2>
            <p className="text-lg text-slate-600">
              Real-time blood type requirements across our network. Your
              donation matters now more than ever.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {bloodTypes.map((blood, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`text-2xl font-bold mb-2 ${
                    blood.need === "Critical"
                      ? "text-red-600"
                      : blood.need === "High"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {blood.type}
                </div>
                <div
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    blood.need === "Critical"
                      ? "bg-red-100 text-red-700"
                      : blood.need === "High"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {blood.need} Need
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {blood.donors} Donors
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Donate Blood Section - NEW */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
              Why Your Blood Donation Matters
            </h2>
            <p className="text-lg text-slate-600">
              Every donation creates a ripple effect of hope and healing in our
              community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {donationFacts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-red-500"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-800">
                    {fact.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {fact.description}
                  </p>
                  <div className="text-red-600 font-bold text-lg">
                    {fact.stat}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>


      {/* Emergency Needs Section - NEW */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter">
              Who Needs Your Blood?
            </h2>
            <p className="text-lg text-red-100">
              Your donation directly impacts patients in critical situations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {emergencyNeeds.map((need, index) => {
              const Icon = need.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {need.type}
                  </h3>
                  <p className="text-red-100 text-sm">{need.units}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <div className="bg-white/10 rounded-2xl p-6 max-w-2xl mx-auto backdrop-blur-sm border border-white/10">
              <p className="text-lg text-white mb-4 italic">
                <strong>47% of the population</strong> is eligible to donate
                blood, but only <strong>5%</strong> actually do.
              </p>
              <p className="text-red-100 font-bold">
                Your single donation can make all the difference.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-24 bg-slate-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Simple steps to become a life-saver. Join thousands of donors
              making a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white rounded-[2rem] shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-red-500 group-hover:transform group-hover:-translate-y-2">
                    <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-xl">
                      {step.step}
                    </div>
                    {Icon && (
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-slate-800">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Interactive Services Section - MOVED LOWER */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Our Core Services</h2>
            <div className="w-24 h-2 bg-red-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 mt-6 max-w-2xl mx-auto font-medium">Empowering donors and hospitals with state-of-the-art digital tools for life-saving efficiency.</p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 max-w-6xl mx-auto">
            {servicesData.map((s) => {
              const Icon = s.icon;
              const isActive = activeService === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveService(s.id)}
                  className={`flex flex-col items-center justify-center p-8 rounded-[2rem] transition-all duration-500 group shadow-lg ${
                    isActive 
                      ? "bg-red-700 text-white scale-105 shadow-2xl ring-8 ring-red-50" 
                      : "bg-slate-50 text-slate-600 hover:bg-white hover:shadow-xl border border-slate-100"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    isActive ? "bg-white/20" : "bg-white group-hover:bg-red-50 shadow-sm"
                  }`}>
                    <Icon className={`w-7 h-7 ${isActive ? "text-white" : "text-slate-400 group-hover:text-red-600"}`} />
                  </div>
                  <span className="text-[12px] md:text-[14px] font-black uppercase tracking-widest text-center leading-tight">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details Content Area */}
          <div className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] p-10 md:p-20 shadow-2xl overflow-hidden relative" id="services-details">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full"></div>
            <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
              <div className="flex-1 text-center md:text-left">
                {(activeService ? servicesData.filter(s => s.id === activeService) : [servicesData[0]]).map((s) => (
                  <div key={s.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-red-500/30">
                       Digital Solution
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight">{s.title}</h3>
                    <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-xl">
                      {s.desc}
                    </p>
                    {s.btnLink.startsWith("/") ? (
                       <Link to={s.btnLink}>
                       <button className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all hover:-translate-y-1 uppercase tracking-widest">
                         {s.btnText}
                       </button>
                     </Link>
                    ) : (
                      <button 
                        onClick={() => {
                          const element = document.getElementById(s.anchor);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all hover:-translate-y-1 uppercase tracking-widest"
                      >
                        {s.btnText}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden md:block relative group">
                <div className="absolute -inset-10 bg-red-600/20 rounded-full blur-[80px] opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <img 
                  src="/assets/blood_bag.png" 
                  alt="Blood Service Illustration" 
                  className="w-[350px] h-auto drop-shadow-[0_35px_35px_rgba(255,0,0,0.3)] relative z-10 transform -rotate-6 group-hover:rotate-0 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Eligibility & Benefits Section - Interactive Update */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
               Are You Eligible?
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Skip the long forms. Take our 30-second interactive eligibility check to see if you can be a life-saver today.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {!showQuiz ? (
              <div className="bg-red-50 rounded-[3rem] p-12 text-center border-2 border-red-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <Stethoscope className="w-16 h-16 text-red-600 mx-auto mb-6 group-hover:rotate-12 transition-transform" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Eligibility AI-Check</h3>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto italic text-sm">Our automated system will analyze your age, weight, and general health metrics based on current medical standards.</p>
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-red-700 transition-all hover:-translate-y-1 block mx-auto"
                >
                  Launch Quiz
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl min-h-[400px] flex flex-col justify-between border-4 border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                    Step {quizStep + 1} of 4
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {quizResult ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10"
                    >
                      {quizResult.eligible ? (
                        <>
                          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-green-500/50">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                          </div>
                          <h4 className="text-3xl font-black mb-4">You're a Match! 🎉</h4>
                          <p className="text-slate-400 text-lg mb-10">{quizResult.message}</p>
                          <Link to="/register/donor">
                            <button className="px-10 py-5 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-500/20">
                                Register as Donor Now
                            </button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-red-500/50">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                          </div>
                          <h4 className="text-3xl font-black mb-4">Not Right Now 🛑</h4>
                          <p className="text-slate-400 text-lg mb-10">{quizResult.message}</p>
                          <button 
                            onClick={() => { setShowQuiz(false); setQuizStep(0); setQuizResult(null); }}
                            className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
                          >
                            Back to Home
                          </button>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={quizStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                      {[
                        { q: "Is your age between 18 and 65 years?", img: "🎂" },
                        { q: "Is your weight at least 50 kg (110 lbs)?", img: "⚖️" },
                        { q: "Are you in good general health (no flu/cold)?", img: "🌡️" },
                        { q: "Have you donated blood in the last 3 months?", img: "💉" }
                      ].filter((_, idx) => idx === quizStep).map((q, i) => (
                        <div key={i}>
                          <div className="text-6xl mb-6">{q.img}</div>
                          <h4 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">{q.q}</h4>
                        </div>
                      ))}

                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            if (quizStep === 0 || quizStep === 1 || quizStep === 2) {
                              // Yes answers for these lead to next step
                              setQuizStep(prev => prev + 1);
                            } else if (quizStep === 3) {
                              // Yes for last question (donated recently) means NOT eligible now
                              setQuizResult({ eligible: false, message: "Thank you! But you must wait at least 3 months between donations." });
                            }
                          }}
                          className="flex-1 py-6 bg-red-600 rounded-[2rem] text-xl font-black hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 active:scale-95"
                        >
                          YES
                        </button>
                        <button 
                          onClick={() => {
                            if (quizStep === 3) {
                              // No for last question means YOU ARE eligible
                              setQuizResult({ eligible: true, message: "Our AI brain thinks you're ready! Start your journey to save lives." });
                            } else {
                              // No for others means NOT eligible
                              setQuizResult({ eligible: false, message: "According to medical guidelines, you might not meet the criteria right now." });
                            }
                          }}
                          className="flex-1 py-6 bg-slate-800 border-2 border-slate-700 rounded-[2rem] text-xl font-black hover:bg-slate-700 transition-all active:scale-95"
                        >
                          NO
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.section>


      {/* About Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        id="about" className="py-20 bg-slate-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
              Why Choose Our Blood Bank System?
            </h2>
            <p className="text-lg text-slate-600">
              We provide a comprehensive platform that connects donors,
              hospitals, and blood banks to ensure efficient blood collection
              and distribution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-red-500"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>


      {/* Security Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase tracking-tighter">
                Secure & Compliant
              </h2>
              <p className="text-slate-600 mb-6 text-lg">
                Our system meets all healthcare data security standards with
                end-to-end encryption and strict compliance with medical
                regulations to protect donor and patient information.
              </p>
              <ul className="space-y-4">
                {[
                  "HIPAA compliant data handling",
                  "End-to-end encryption",
                  "Regular security audits"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-600 font-medium">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-red-50 rounded-[2.5rem] p-12 border border-red-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-200/20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="aspect-video bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl">
                <div className="text-center p-4">
                  <Shield className="w-20 h-20 text-white mx-auto mb-4 opacity-20" />
                  <p className="text-white font-black uppercase tracking-widest text-sm">
                    Strategic Shield Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>


      {/* Mission Section - NEW */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        id="mission" className="py-24 bg-white border-t border-slate-100"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-6">
                <Target className="w-4 h-4" />
                Our Purpose
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight uppercase tracking-tighter">
                Our Mission to <span className="text-red-600">Blood-Sync</span> the World
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium">
                We believe that no one should suffer due to the unavailability of blood. Our platform is engineered to bridge the gap between voluntary donors and patients in real-time, creating a life-saving synchronization across the healthcare ecosystem.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { t: "100% Transparency", d: "Track Every Unit" },
                   { t: "Real-time Alerts", d: "Smart Notifications" },
                   { t: "Verified Network", d: "Certified Labs Only" },
                   { t: "Global Standard", d: "Industry Protocols" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                     <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-lg shadow-red-500/20">
                       <CheckCircle className="w-4 h-4" />
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-900">{item.t}</h4>
                       <p className="text-sm text-slate-500">{item.d}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="aspect-square bg-gradient-to-br from-red-600 to-red-800 rounded-[4rem] rotate-3 absolute inset-0 opacity-10"></div>
               <div className="aspect-square bg-slate-950 rounded-[4rem] relative z-10 flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl">
                  <div className="text-center p-12 relative z-10">
                     <Heart className="w-40 h-40 text-red-600 mx-auto mb-8 animate-pulse" />
                     <p className="text-white text-3xl font-black italic tracking-tighter leading-tight">"EVERY DROP COUNTS,<br />EVERY DONOR MATTERS."</p>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
               </div>
            </div>
          </div>
        </div>
      </motion.section>


      {/* Success Stories Section - NEW */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        id="stories" className="py-24 bg-slate-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Impact Stories</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Real people, real impacts. Discover how the Blood Bank Management System is changing lives every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {[
               { name: "Rahul Sharma", role: "Cancer Survivor", text: "In my darkest hour, the quick response from this platform saved me. I received O- blood within 20 minutes.", img: "👤" },
               { name: "Delhi General Hospital", role: "Partner Facility", text: "Managing inventory used to be a nightmare. Now, it's synchronized and transparent. We've reduced waste by 40%.", img: "🏥" },
               { name: "Ananya Iyer", role: "Regular Donor", text: "The app makes it so easy to find camps. I've donated 15 times now, and the feeling of saving lives is addictive.", img: "👩" }
             ].map((story, i) => (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -10 }}
                 className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100"
               >
                  <div className="text-4xl mb-6">{story.img}</div>
                  <p className="text-slate-600 italic mb-8">"{story.text}"</p>
                  <div>
                    <h4 className="font-bold text-slate-900">{story.name}</h4>
                    <p className="text-sm text-red-600 font-bold uppercase tracking-widest">{story.role}</p>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>
      </motion.section>


      {/* News & Updates - NEW */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        id="news" className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Latest Intelligence</h2>
              <p className="text-slate-500 font-medium">Stay informed about the latest developments in transfusion medicine and community blood drives.</p>
            </div>
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg">
               View All Updates <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { 
                 t: "New Lab Partnership in Mumbai", 
                 d: "Expansion", 
                 date: "Jan 15, 2026",
                 img: "/images/lab_partnership.png" 
               },
               { 
                 t: "Emerging Trends in Blood Storage", 
                 d: "Medical", 
                 date: "Feb 28, 2026",
                 img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format&fit=crop" 
               },
               { 
                 t: "World Blood Donor Day 2026 Highlights", 
                 d: "Community", 
                 date: "Mar 22, 2026",
                 img: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=800&auto=format&fit=crop" 
               }
             ].map((n, i) => (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -5 }}
                 className="group cursor-pointer"
               >
                  <div className="aspect-video bg-slate-100 rounded-3xl mb-6 overflow-hidden relative shadow-md">
                    <img 
                      src={n.img} 
                      alt={n.t}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-full">#{n.d}</span>
                    <span className="text-xs text-slate-400 font-bold">{n.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                    {n.t}
                  </h3>
               </motion.div>
             ))}
          </div>
        </div>
      </motion.section>


      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionsVariant}
        className="py-24 bg-gradient-to-br from-red-700 to-red-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter"
          >
            Ready to Save Lives?
          </motion.h2>
          <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
            Join our community of donors and healthcare professionals working
            together to ensure blood is available when and where it's needed
            most.
          </p>
          <Link to="/register/donor">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-black uppercase tracking-widest rounded-2xl bg-white text-red-700 hover:bg-red-50 transition-all duration-300 shadow-2xl hover:shadow-red-500/20"
            >
              Join the Network <ArrowRight className="w-5 h-5 ml-3" />
            </motion.button>
          </Link>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage;