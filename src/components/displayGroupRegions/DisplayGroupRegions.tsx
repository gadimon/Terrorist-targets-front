import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface RegionData {
  total: number;
  region: string;
  country: string;
}

const DisplayGroupRegions: React.FC = () => {
  const [regionsData, setRegionsData] = useState<RegionData[]>([]);

  const fetchGroupRegions = async (groupName: string) => {
    try {
      const response = await fetch(
        `https://terrorist-targets.onrender.com/api/relationships/deadliest-regions/?name_group=${groupName}`
      );
      const data = await response.json();
      setRegionsData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter Group Name"
        onChange={(e) => fetchGroupRegions(e.target.value)}
        style={{ marginBottom: "20px", width: "100%", padding: "10px" }}
      />

      <div style={{ width: "800px", height: "600px", margin: "20px auto" }}>
        <MapContainer
          center={[31.5, 34.75]}
          zoom={2}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {regionsData.map((region, index) => (
            <Marker key={index} position={[0, 0]} icon={icon}>
              <Popup>
                <div>
                  <h3>{region.region}</h3>
                  <p>Country: {region.country}</p>
                  <p>Total Casualties: {region.total}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default DisplayGroupRegions;
