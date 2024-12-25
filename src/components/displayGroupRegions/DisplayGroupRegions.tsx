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
  lat?: number;
  long?: number;
}

const DisplayGroupRegions: React.FC = () => {
  const [groupName, setGroupName] = useState<string>("");
  const [regionsData, setRegionsData] = useState<RegionData[]>([]);

  const fetchGroupRegions = async () => {
    if (!groupName.trim()) return;

    try {
      const url = `https://terrorist-targets.onrender.com/api/relationships/deadliest-regions?groupName=${groupName}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRegionsData(data);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", margin: "20px" }}>
        <input
          type="text"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ flexGrow: 1, marginRight: "10px", padding: "10px" }}
        />
        <button onClick={fetchGroupRegions} style={{ padding: "10px" }}>
          Search
        </button>
      </div>

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
