import API_BASE_URL from "../utils/apiConfig.js";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customFacilityIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customDonorIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically change map view when center updates
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapComponent = ({ centerData, radius = 50, bloodGroup = "" }) => {
  const [facilities, setFacilities] = useState([]);
  const [donors, setDonors] = useState([]);

  // Fallback center: New Delhi
  const defaultCenter = [28.6139, 77.2090];
  const mapCenter = centerData || defaultCenter;

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/search/location`, {
        params: {
          lat: mapCenter[0],
          lng: mapCenter[1],
          radius,
          bloodGroup
        }
      });
      
      if (res.data.success) {
        setFacilities(res.data.data.facilities);
        setDonors(res.data.data.donors);
      }
    } catch (error) {
      console.error("Error fetching locations on map", error);
    }
  };

  useEffect(() => {
    if (mapCenter) {
      fetchLocations();
    }
  }, [mapCenter, radius, bloodGroup]);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <MapContainer 
        center={mapCenter} 
        zoom={12} 
        style={{ height: "400px", width: "100%" }}
        className="z-0"
      >
        <ChangeView center={mapCenter} zoom={12} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Facility Markers */}
        {facilities.map((fac) => {
          if (!fac.location?.coordinates) return null;
          // Coordinates in GeoJSON are [lng, lat], Leaflet expects [lat, lng]
          const position = [fac.location.coordinates[1], fac.location.coordinates[0]];
          
          return (
            <Marker key={fac._id} position={position} icon={customFacilityIcon}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-lg text-blue-700">{fac.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{fac.facilityType}</p>
                  <p className="text-sm mt-1">📞 {fac.phone}</p>
                  <p className="text-xs text-gray-500 mt-2">{fac.address?.city}, {fac.address?.state}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Donor Markers */}
        {donors.map((donor) => {
          if (!donor.location?.coordinates) return null;
          const position = [donor.location.coordinates[1], donor.location.coordinates[0]];
          
          return (
            <Marker key={donor._id} position={position} icon={customDonorIcon}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-lg text-red-600">Donor</h3>
                  <div className="inline-block px-2 py-1 bg-red-100 text-red-700 font-bold rounded mt-1">
                    🩸 {donor.bloodGroup}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{donor.address?.city}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
