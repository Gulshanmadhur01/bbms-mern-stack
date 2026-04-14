import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { Info, Shield, CheckCircle, FileText, Heart, Users, Award, AlertTriangle } from 'lucide-react';

const Information = () => {
    const location = useLocation();
    const path = location.pathname.substring(1);
    const title = path.charAt(0).toUpperCase() + path.slice(1);

    const getContent = () => {
        switch(path) {
            case 'eligibility':
                return {
                    icon: <CheckCircle className="w-16 h-16 text-green-500" />,
                    text: "Ensuring donor safety and blood quality is our top priority. Most people can donate blood if they are in good health. We conduct a thorough screening before each donation to ensure the process is safe for both you and the recipient.",
                    items: [
                        "Age: 17-65 years (up to 70 for regular donors)",
                        "Weight: Minimum 50kg (110 lbs)",
                        "Pulse: 60-100 beats per minute",
                        "Hemoglobin: Minimum 12.5 g/dl",
                        "Health: No active infections or flu symptoms",
                        "Last Donation: At least 56 days ago (for whole blood)"
                    ]
                };
            case 'mission':
                return {
                    icon: <Heart className="w-16 h-16 text-red-500" />,
                    text: "Our mission is to build a world where no life is lost due to the unavailability of blood. We leverage state-of-the-art technology to synchronize the global blood supply chain, connecting voluntary donors with healthcare facilities in real-time.",
                    items: [
                        "Zero-Wait Access: Real-time matching for emergencies",
                        "Digital Transformation: paperless and efficient processing",
                        "Community Trust: Building a verified network of donors",
                        "Educational Outreach: Raising awareness about donation"
                    ]
                };
            case 'stories':
                return {
                    icon: <Users className="w-16 h-16 text-purple-500" />,
                    text: "Every drop tells a story of survival and hope. Our platform has facilitated thousands of life-saving interventions, bringing together strangers in a shared commitment to humanity.",
                    items: [
                        "10,000+ Successful Transfusions",
                        "500+ Emergency Rare Group Matches",
                        "Testimonials from Survivors",
                        "Donor Recognition Programs"
                    ]
                };
            case 'process':
                return {
                    icon: <FileText className="w-16 h-16 text-blue-500" />,
                    text: "Donating blood is a safe and simple four-step process. Our medical teams guide you through every stage to ensure your comfort and well-being.",
                    items: [
                        "1. Registration: Simple digital check-in",
                        "2. Screening: Basic health check and medical history",
                        "3. Donation: Takes only 8-10 minutes",
                        "4. Recovery: Refreshments and rest for 15 minutes"
                    ]
                };
            case 'benefits':
                return {
                    icon: <Award className="w-16 h-16 text-orange-500" />,
                    text: "Donating blood doesn't just save others; it has significant health benefits for the donor as well. Regular donation helps maintain a healthy iron balance and stimulates the production of new blood cells.",
                    items: [
                        "Free Mini-Physical & Health Screening",
                        "Reduces Risk of Heart Disease",
                        "Burns up to 650 calories per donation",
                        "Improves psychological well-being",
                        "Community recognition and rewards"
                    ]
                };
            case 'emergency':
                return {
                    icon: <AlertTriangle className="w-16 h-16 text-red-600" />,
                    text: "In critical situations, every second counts. Our Emergency Protocol ensures prioritized matching and rapid notification to the nearest eligible donors and facilities.",
                    items: [
                        "Immediate Smart matching",
                        "Priority Notification System",
                        "Direct Communication with Hospitals",
                        "Real-time Inventory Reservations"
                    ]
                };
            case 'privacy':
                return {
                    icon: <Shield className="w-16 h-16 text-indigo-600" />,
                    text: "We take your data privacy seriously. Our systems are built on security-first principles, ensuring that your personal and medical information is encrypted and protected at all times.",
                    items: [
                        "End-to-End Encryption",
                        "Strict Access Control Protocols",
                        "HIPAA Compliant Data Handling",
                        "Regular Third-party Security Audits"
                    ]
                };
            case 'terms':
                return {
                    icon: <FileText className="w-16 h-16 text-gray-700" />,
                    text: "By using our platform, you agree to our commitment to safe and ethical blood management practices. We ensure transparency in all our operations and expect honesty from our donor community.",
                    items: [
                        "Accurate Health Reporting",
                        "Responsible Use of Requests",
                        "Ethical Data Management",
                        "Compliance with Local Laws"
                    ]
                };
            case 'cookies':
                return {
                    icon: <CheckCircle className="w-16 h-16 text-blue-400" />,
                    text: "We use cookies to improve your experience and ensure the security of your account. These files help us remember your preferences and provide personalized dashboard insights.",
                    items: [
                        "Session Management",
                        "Security & Authentication",
                        "Performance Analytics",
                        "User Preferences"
                    ]
                };
            default:
                return {
                    icon: <Info className="w-16 h-16 text-slate-500" />,
                    text: `This is the ${title} page for the Blood Bank Management System. We are dedicated to providing comprehensive resources for our community.`,
                    items: [
                        "Professional Healthcare Support",
                        "Educational Resources",
                        "Verified Information Hub"
                    ]
                };
        }
    };

    const content = getContent();

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white text-center">
                        <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            {content.icon}
                        </div>
                        <h1 className="text-4xl font-bold">{title}</h1>
                    </div>
                    <div className="p-10">
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            {content.text}
                        </p>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wider">Key Details:</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-12 text-center">
                            <button 
                                onClick={() => window.history.back()}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Information;
