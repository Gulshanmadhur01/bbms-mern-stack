import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import LandingPage from "./pages/Landing";
import FacilityForm from "./pages/auth/FacultyRegister";
import DonorRegister from "./pages/auth/DonorRegister";
import DonorDashboard from "./pages/donor/DonorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";
import DonorProfile from "./pages/donor/DonorProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFacilities from "./pages/admin/AdminFacilities";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import BloodCamps from "./pages/bloodlab/BloodCamps";
import BloodlabDashboard from "./pages/bloodlab/BloodlabDashboard";
import BloodStock from "./pages/bloodlab/BloodStock";
import LabProfile from "./pages/bloodlab/LabProfile";
import GetAllFacilities from "./pages/admin/GetAllFacilities";
import GetAllDonors from "./pages/admin/GetAllDonors";
import DonorCampsList from "./pages/donor/DonorCampsList";
import LabManageRequests from "./pages/bloodlab/LabManageRequests";
import HospitalRequestBlood from "./pages/hospital/HospitalRequestBlood";
import HospitalRequestHistory from "./pages/hospital/HospitalRequestHistory";
import HospitalBloodStock from "./pages/hospital/HospitalBloodStock";
import BloodLabDonor from "./pages/bloodlab/BloodLabDonor";
import DonorDirectory from "./pages/hospital/DonorDirectory";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import DonorDonationHistory from "./pages/donor/DonorDonationHistory";
import Information from "./pages/Information";
import BloodAvailability from "./pages/BloodAvailability";
import BloodCenterDirectory from "./pages/BloodCenterDirectory";
import CampSchedule from "./pages/CampSchedule";
import CampRegistration from "./pages/CampRegistration";
import ScrollToTop from "./components/ScrollToTop";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/availability" element={<BloodAvailability />} />
        <Route path="/directory" element={<BloodCenterDirectory />} />
        <Route path="/camp-schedule" element={<CampSchedule />} />
        <Route path="/register-camp" element={<CampRegistration />} />
        <Route path="/register/donor" element={<DonorRegister />} />
        <Route path="/register/facility" element={<FacilityForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Info & Placeholder Routes */}
        <Route path="/mission" element={<Information />} />
        <Route path="/eligibility" element={<Information />} />
        <Route path="/process" element={<Information />} />
        <Route path="/benefits" element={<Information />} />
        <Route path="/stories" element={<Information />} />
        <Route path="/news" element={<Information />} />
        <Route path="/emergency" element={<Information />} />
        <Route path="/privacy" element={<Information />} />
        <Route path="/terms" element={<Information />} />
        <Route path="/cookies" element={<Information />} />

        <Route path="/donor" element={<ProtectedRoute><DashboardLayout userRole="donor" /></ProtectedRoute>}>
          <Route index element={<DonorDashboard />} />
          <Route path="profile" element={<DonorProfile />} />
          <Route path="camps" element={<DonorCampsList />} />
          <Route path="history" element={<DonorDonationHistory />} />
        </Route>
      
        <Route path="/hospital" element={<ProtectedRoute><DashboardLayout userRole="hospital" /></ProtectedRoute>}>
          <Route index element={<HospitalDashboard />} />
          <Route path="blood-request-create" element={<HospitalRequestBlood />} />
          <Route path="blood-request-history" element={<HospitalRequestHistory />} />
          <Route path="inventory" element={<HospitalBloodStock />} />
          <Route path="donors" element={<DonorDirectory />} />
       </Route>
      
        <Route path="/lab" element={<ProtectedRoute><DashboardLayout userRole="blood-lab" /></ProtectedRoute>}>
          <Route index element={<BloodlabDashboard />} />
          <Route path="inventory" element={<BloodStock />} />
          <Route path="camps" element={<BloodCamps />} />
          <Route path="profile" element={<LabProfile />} />
          <Route path="requests" element={<LabManageRequests />} />
          <Route path="donor" element={<BloodLabDonor />} />
        </Route>
        
        <Route path="/admin" element={<ProtectedRoute><DashboardLayout userRole="admin" /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="verification" element={<AdminFacilities />} />
          <Route path="donors" element={<GetAllDonors />} />
          <Route path="facilities" element={<GetAllFacilities />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
