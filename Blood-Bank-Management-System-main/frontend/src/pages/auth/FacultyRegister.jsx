import API_BASE_URL from "../../utils/apiConfig.js";
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { indiaData } from "../../utils/indiaData";

// Constants for better maintainability
const FACILITY_TYPES = ["Hospital", "Blood Lab"];
const FACILITY_CATEGORIES = [
  "Government",
  "Private",
  "Trust",
  "Charity",
  "Other",
];

const STATES = indiaData;

const WORKING_DAYS = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
];

// Validation functions
const validators = {
  name: (value) => (!value.trim() ? "Facility name is required" : ""),
  email: (value) => {
    if (!value.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(value)) return "Please enter a valid email address";
    return "";
  },
  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  },
  phone: (value) => {
    if (!value) return "Phone number is required";
    if (value.length !== 10) return "Phone number must be exactly 10 digits";
    if (!/^[6-9][0-9]{9}$/.test(value)) return "Phone number must start with 6-9";
    return "";
  },
  emergencyContact: (value) => {
    if (!value) return "Emergency contact is required";
    if (value.length !== 10) return "Emergency contact must be exactly 10 digits";
    if (!/^[6-9][0-9]{9}$/.test(value)) return "Emergency contact must start with 6-9";
    return "";
  },
  registrationNumber: (value) => (!value.trim() ? "Registration number is required" : ""),
  "address.street": (value) => (!value.trim() ? "Street address is required" : ""),
  "address.city": (value) => (!value.trim() ? "City is required" : ""),
  "address.state": (value) => (!value.trim() ? "State is required" : ""),
  "address.pincode": (value) => {
    if (!value) return "Pincode is required";
    if (!/^[1-9][0-9]{5}$/.test(value)) return "Pincode must be 6 digits";
    return "";
  },
  "documents.registrationProof.url": (value) => (!value.trim() ? "Document URL is required" : ""),
  "operatingHours.workingDays": (value) => (!value || value.length === 0 ? "Please select at least one working day" : ""),
};

export default function FacilityRegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    emergencyContact: "",
    address: { street: "", city: "", state: "", pincode: "" },
    registrationNumber: "",
    facilityType: "Hospital",
    facilityCategory: "Private",
    documents: { registrationProof: { url: "", filename: "" } },
    operatingHours: {
      open: "09:00",
      close: "18:00",
      workingDays: [],
    },
    is24x7: false,
    emergencyServices: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
      // Handle nested objects
      if (name.startsWith("address.")) {
        const field = name.split(".")[1];
        return {
          ...prev,
          address: { ...prev.address, [field]: value },
        };
      } else if (name.startsWith("documents.registrationProof.")) {
        const field = name.split(".")[2];
        return {
          ...prev,
          documents: {
            registrationProof: {
              ...prev.documents.registrationProof,
              [field]: value,
            },
          },
        };
      } else if (name.startsWith("operatingHours.")) {
        const field = name.split(".")[1];
        return {
          ...prev,
          operatingHours: { ...prev.operatingHours, [field]: value },
        };
      }
      
      // Handle regular fields
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Helper to toggle working days (using chips instead of multi-select)
  const toggleWorkingDay = (dayValue) => {
    setFormData(prev => {
      const currentDays = prev.operatingHours.workingDays || [];
      const newDays = currentDays.includes(dayValue)
        ? currentDays.filter(d => d !== dayValue)
        : [...currentDays, dayValue];
      
      return {
        ...prev,
        operatingHours: { ...prev.operatingHours, workingDays: newDays }
      };
    });
    
    // Mark as touched
    setTouched(prev => ({ ...prev, "operatingHours.workingDays": true }));
  };

  // Handle blur events for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate single field
    validateField(name);
  };

  // Validate single field
  const validateField = (fieldName) => {
    let value;
    
    if (fieldName.includes(".")) {
      const [parent, child] = fieldName.split(".");
      if (parent === "address") {
        value = formData.address[child];
      } else if (fieldName.startsWith("documents.")) {
        value = formData.documents.registrationProof.url;
      } else if (fieldName.startsWith("operatingHours.")) {
        value = formData.operatingHours.workingDays;
      }
    } else {
      value = formData[fieldName];
    }
    
    const error = validators[fieldName]?.(value);
    
    setErrors(prev => {
      if (error) {
        return { ...prev, [fieldName]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
    });
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    const allFields = [
      "name", "email", "password", "facilityType", 
      "phone", "emergencyContact", "registrationNumber", 
      "address.street", "address.city", "address.state", "address.pincode", 
      "documents.registrationProof.url", "operatingHours.workingDays"
    ];

    allFields.forEach(field => {
      let value;
      
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        if (parent === "address") {
          value = formData.address[child];
        } else if (field.startsWith("documents.")) {
          value = formData.documents.registrationProof.url;
        } else if (field.startsWith("operatingHours.")) {
          value = formData.operatingHours.workingDays;
        }
      } else {
        value = formData[field];
      }
      
      const error = validators[field]?.(value);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    const newTouched = { ...touched };
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      setTimeout(() => {
          const firstErrorField = Object.keys(newErrors)[0];
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
      }, 100);
      return false;
    }

    return true;
  };


  // Fixes were already here, but check again for clarity:
  const handleSubmit = async (e) => {
    // If 'e' is provided (from form onSubmit or button click), prevent default
    // In this setup, it's safer to check for a method that may exist.
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Ensure validation runs before proceeding to API call
    if (!validateForm()) {
        toast.error("Please fill all required fields correctly.");
        return; 
    }
    
    setIsSubmitting(true);

   // 1. Get the raw facilityType string (e.g., "Blood Lab")
  const rawFacilityType = formData.facilityType;

  // 2. Create the required role slug (e.g., "blood lab" -> "blood-lab")
  const roleSlug = rawFacilityType.toLowerCase().replace(' ', '-');

  // 3. Construct the submission payload
  const submissionPayload = {
    ...formData,
    
    // IMPORTANT: Keep the facilityType field as the original capitalized value.
    facilityType: roleSlug, 
    
    // Set the role field to the required slug format.
    role: roleSlug, 
  };
    
    // **YOUR TARGET URL**
    const API_URL = `${API_BASE_URL}/auth/register`; 
    
   console.log("Submitting Data to Backend:", submissionPayload); // Use the new payload

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ⭐️ Use the constructed payload here
      body: JSON.stringify(submissionPayload), 
    });
      
      // Check if the response status is 2xx (Success)
      if (response.ok) {
        const result = await response.json();
        console.log("Facility Data Registered Successfully:", result);
        toast("✅ Facility Registered Successfully!");
        // You might want to clear the form or redirect here
        navigate('/');
      } else {
        // Handle server-side errors (400, 500 status codes)
        const errorData = await response.json();
        console.error("Registration failed:", response.status, errorData);
        alert(`❌ Registration failed. Status: ${response.status}. Message: ${errorData.message || 'Check server logs.'}`);
      }

    } catch (error) {
      // Handle network errors (e.g., server unreachable)
      console.error("Network or fetch error:", error);
      alert("❌ Registration failed due to a network error. Ensure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to check if field should show error
  const shouldShowError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };


  return (
    <div className="min-h-screen mt-28 bg-red-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-red-700 text-white p-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            Blood Facility Registration
          </h1>
          <p className="text-center opacity-90">
            Register your facility to join the healthcare network.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

          {/* Section 1: Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-red-700 border-b pb-2">1. Basic Information</h2>
              <div>
                <label htmlFor="name" className="block font-medium mb-2">
                  Facility Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    shouldShowError("name") ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter facility name"
                />
                {shouldShowError("name") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    shouldShowError("email") ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
                {shouldShowError("email") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.email}
                  </p>
                )}
              </div>
            </div>

          {/* Section 2: Account Information */}
            <div className="space-y-6 pt-4">
              <h2 className="text-lg font-bold text-red-700 border-b pb-2">2. Account Credentials</h2>
              <div>
                <label htmlFor="password" className="block font-medium mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                      shouldShowError("password") ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter password (min 6 characters)"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {shouldShowError("password") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.password}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="facilityType" className="block font-medium mb-2">
                    Facility Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="facilityType"
                    name="facilityType"
                    value={formData.facilityType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  >
                    {FACILITY_TYPES.map(ft => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="facilityCategory" className="block font-medium mb-2">
                    Facility Category
                  </label>
                  <select
                    id="facilityCategory"
                    name="facilityCategory"
                    value={formData.facilityCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  >
                    {FACILITY_CATEGORIES.map(fc => (
                      <option key={fc} value={fc}>{fc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          {/* Section 3: Facility Details */}
            <div className="space-y-6 pt-4">
              <h2 className="text-lg font-bold text-red-700 border-b pb-2">3. Facility Details & Operations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block font-medium mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                      shouldShowError("phone") ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10-digit phone number"
                    maxLength="10"
                  />
                  {shouldShowError("phone") && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span> {errors.phone}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="emergencyContact" className="block font-medium mb-2">
                    Emergency Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emergencyContact"
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                      shouldShowError("emergencyContact") ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10-digit emergency contact"
                    maxLength="10"
                  />
                  {shouldShowError("emergencyContact") && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span> {errors.emergencyContact}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <label className="block font-medium mb-2">Address <span className="text-red-500">*</span></label>
                
                <input
                  type="text"
                  name="address.street"
                  placeholder="Street Address"
                  value={formData.address.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    shouldShowError("address.street") ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {shouldShowError("address.street") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors["address.street"]}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <select
                      name="address.state"
                      value={formData.address.state}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, city: "" },
                        }));
                      }}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        shouldShowError("address.state") ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select State</option>
                      {Object.keys(STATES).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {shouldShowError("address.state") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span> {errors["address.state"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        shouldShowError("address.city") ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={!formData.address.state}
                    >
                      <option value="">Select City</option>
                      {formData.address.state &&
                        STATES[formData.address.state].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    {shouldShowError("address.city") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span> {errors["address.city"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="address.pincode"
                      placeholder="Pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        shouldShowError("address.pincode") ? "border-red-500" : "border-gray-300"
                      }`}
                      maxLength="6"
                    />
                    {shouldShowError("address.pincode") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span> {errors["address.pincode"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="registrationNumber" className="block font-medium mb-2">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="registrationNumber"
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    shouldShowError("registrationNumber") ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter registration number"
                />
                {shouldShowError("registrationNumber") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.registrationNumber}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="documentUrl" className="block font-medium mb-2">
                  Registration Proof URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="documentUrl"
                  type="url"
                  name="documents.registrationProof.url"
                  value={formData.documents.registrationProof.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                    shouldShowError("documents.registrationProof.url") ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/document.pdf"
                />
                {shouldShowError("documents.registrationProof.url") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors["documents.registrationProof.url"]}
                  </p>
                )}
              </div>

              {/* Operating Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="openTime" className="block font-medium mb-2">
                    Opening Time
                  </label>
                  <input
                    id="openTime"
                    type="time"
                    name="operatingHours.open"
                    value={formData.operatingHours.open}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="closeTime" className="block font-medium mb-2">
                    Closing Time
                  </label>
                  <input
                    id="closeTime"
                    type="time"
                    name="operatingHours.close"
                    value={formData.operatingHours.close}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-3">
                  Working Days <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {WORKING_DAYS.map((day) => {
                    const isSelected = formData.operatingHours.workingDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleWorkingDay(day.value)}
                        className={`py-2 px-1 text-sm font-semibold rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? "bg-red-600 text-white border-red-600 shadow-md"
                            : "bg-white text-gray-600 border-gray-300 hover:border-red-400 hover:bg-red-50"
                        } ${shouldShowError("operatingHours.workingDays") ? "border-red-500" : ""}`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
                {shouldShowError("operatingHours.workingDays") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors["operatingHours.workingDays"]}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Click to select the days your facility is operational.
                </p>
              </div>

              {/* Service Options */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is24x7"
                    checked={formData.is24x7}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="font-medium">24x7 Service</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emergencyServices"
                    checked={formData.emergencyServices}
                    onChange={handleChange}
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="font-medium">Emergency Services</span>
                </label>
              </div>
            </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end pt-6 border-t font-semibold">
               <button
                type="button" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex justify-center items-center font-bold text-lg"
              >
                {isSubmitting ? "Registering Facility..." : "Complete Registration"}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}