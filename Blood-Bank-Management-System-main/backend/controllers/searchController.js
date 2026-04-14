import Facility from "../models/facilityModel.js";
import Blood from "../models/bloodModel.js";
import Camp from "../models/CampModel.js";

// @desc Search Donors and Facilities by Location and optionally Blood Group
// @route GET /api/search/location
export const searchByLocation = async (req, res) => {
  try {
    const { lat, lng, radius, bloodGroup } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required." });
    }

    const radiusInKm = radius ? parseFloat(radius) : 10; // Default 10km radius
    const radiusInRadians = radiusInKm / 6378.1; // Earth radius is about 6378.1 km

    // Find nearest donors based on GeoJSON 'location' coordinates
    let donorQuery = {
      location: {
        $geoWithin: {
          // MongoDB expects coordinates as [longitude, latitude]
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians],
        },
      },
    };

    if (bloodGroup) donorQuery.bloodGroup = bloodGroup;

    const nearbyDonors = await Donor.find(donorQuery).select("-password -history");

    // Find nearest facilities
    const nearbyFacilities = await Facility.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians],
        },
      },
      status: "approved"
    }).select("-password -history");

    res.status(200).json({
      success: true,
      data: {
        donors: nearbyDonors,
        facilities: nearbyFacilities,
      },
    });
  } catch (error) {
    console.error("Geospatial Search Error:", error);
    res.status(500).json({ success: false, message: "Error performing location search." });
  }
};

// @desc Get Blood Availability with filters
// @route GET /api/search/availability
export const getBloodAvailability = async (req, res) => {
  try {
    const { state, district, bloodGroup, componentType } = req.query;

    const query = {};
    if (bloodGroup && bloodGroup !== 'All') query.bloodGroup = bloodGroup;
    if (componentType && componentType !== 'All') query.componentType = componentType;

    // First find matching blood units
    // We populate the 'bloodLab' or 'hospital' to check their address
    const bloodUnits = await Blood.find(query)
      .populate('bloodLab', 'name address facilityCategory')
      .populate('hospital', 'name address facilityCategory');

    // Filter by location in JS (since it's nested in populated fields)
    const filteredResults = bloodUnits.filter((unit) => {
      const facility = unit.bloodLab || unit.hospital;
      if (!facility) return false;

      const matchesState = state ? facility.address.state.toLowerCase() === state.toLowerCase() : true;
      const matchesDistrict = district ? facility.address.city.toLowerCase() === district.toLowerCase() : true;

      return matchesState && matchesDistrict;
    });

    // Format for frontend table
    const formattedData = filteredResults.map((unit, index) => {
      const facility = unit.bloodLab || unit.hospital;
      return {
        sNo: index + 1,
        bloodCenter: facility.name,
        category: facility.facilityCategory || 'Private',
        availability: unit.quantity,
        lastUpdated: unit.updatedAt,
        type: unit.bloodGroup + " (" + unit.componentType + ")",
        location: `${facility.address.city}, ${facility.address.state}`
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Availability Search Error:", error);
    res.status(500).json({ success: false, message: "Error fetching availability." });
  }
};

// @desc Get Facility Directory (Public)
// @route GET /api/search/directory
export const getFacilityDirectory = async (req, res) => {
  try {
    const { state, district } = req.query;
    const query = { status: "approved" };

    if (state) query["address.state"] = new RegExp(state, "i");
    if (district) query["address.city"] = new RegExp(district, "i");

    const facilities = await Facility.find(query).select("name address phone email facilityCategory facilityType");

    res.status(200).json({
      success: true,
      data: facilities.map((f, i) => ({
        sNo: i + 1,
        name: f.name,
        location: `${f.address.city}, ${f.address.state}`,
        category: f.facilityCategory,
        phone: f.phone,
        email: f.email,
        type: f.facilityType
      }))
    });
  } catch (error) {
    console.error("Directory Search Error:", error);
    res.status(500).json({ success: false, message: "Error fetching directory." });
  }
};

// @desc Get Camp Schedule (Public)
// @route GET /api/search/camps
export const getCampSchedule = async (req, res) => {
  try {
    const { state, district } = req.query;
    const query = { status: { $in: ["upcoming", "pending"] } };

    if (state) query["location.state"] = new RegExp(state, "i");
    if (district) query["location.city"] = new RegExp(district, "i");

    const camps = await Camp.find(query).populate("hospital", "name");

    res.status(200).json({
      success: true,
      data: camps.map((c, i) => ({
        sNo: i + 1,
        date: c.date,
        campDetail: c.name + " (" + (c.location.address || c.location.city) + ")",
        location: `${c.location.city}, ${c.location.state}`,
        contact: c.organizerPhone || "N/A",
        conductedBy: c.hospital?.name || "Verified Center",
        organizedBy: c.orgName || "Voluntary Organization",
        time: `${c.startTime} - ${c.endTime}`
      }))
    });
  } catch (error) {
    console.error("Camp Schedule Search Error:", error);
    res.status(500).json({ success: false, message: "Error fetching camp schedule." });
  }
};

// @desc Public Camp Registration Request
// @route POST /api/search/register-camp
export const registerCampRequest = async (req, res) => {
  try {
    const campData = req.body;
    
    // We create it as 'pending'
    const newCamp = new Camp({
       ...campData,
       status: "pending",
       // We might not have a hospital ID yet if it's a public request
       // so we might need a placeholder or just leave it for admin to assign
    });

    await newCamp.save();

    res.status(201).json({
      success: true,
      message: "Camp registration request submitted successfully! Our team will contact you soon."
    });
  } catch (error) {
    console.error("Camp Registration Error:", error);
    res.status(500).json({ success: false, message: "Error submitting camp request." });
  }
};
