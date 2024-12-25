import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./DisplayOrganizations.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface OrganizationData {
  _id: string;
  total: number;
}

interface RegionData {
  region: string;
  count: number;
  lat: number;
  long: number;
}

const DisplayOrganizations: React.FC = () => {
  const [orgData, setOrgData] = useState<OrganizationData[]>([]);
  const [regionsData, setRegionsData] = useState<RegionData[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrgData = async (region: string) => {
    try {
      const regionParam = region === "All" ? "" : encodeURIComponent(region);
      const url = `https://terrorist-targets.onrender.com/api/relationships/top-groups/?regionName=${regionParam}&limit=${
        showAll ? 100 : 5
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as OrganizationData[];
      const validData = data.filter(
        (org) => org._id && org.total !== undefined
      );

      setOrgData(validData);
      setError(
        validData.length === 0 ? "No organizations found for this region" : null
      );
    } catch (error) {
      console.error("Error fetching organization data:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setOrgData([]);
    }
  };

  const fetchRegionsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://terrorist-targets.onrender.com/api/analysis/highest-casualty-regions"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as RegionData[];

      const validRegions = data.filter(
        (region) => region.lat != null && region.long != null
      );
      const uniqueRegions = Array.from(
        new Map(validRegions.map((item) => [item.region, item])).values()
      );
      setRegionsData(uniqueRegions);
    } catch (error) {
      console.error("Error fetching regions data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch regions"
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchRegionsData();
      await fetchOrgData(selectedRegion);
    };
    init();
  }, []);

  useEffect(() => {
    fetchOrgData(selectedRegion);
  }, [selectedRegion, showAll]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Top Organizations in ${selectedRegion}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Casualties",
        },
      },
      x: {
        title: {
          display: true,
          text: "Organizations",
        },
      },
    },
  };

  const chartData = {
    labels: orgData.map((org) => org._id),
    datasets: [
      {
        label: "Total Casualties",
        data: orgData.map((org) => org.total),
        backgroundColor: "rgba(53, 162, 235, 0.8)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  const handleMarkerClick = (region: string) => {
    setSelectedRegion(region);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.chartSection}>
        <div className={styles.filters}>
          <select
            className={styles.select}
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="All">All Regions</option>
            {regionsData.map((region) => (
              <option key={region.region} value={region.region}>
                {region.region}
              </option>
            ))}
          </select>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
            />
            Show all organizations
          </label>
        </div>

        {error && <div className="text-red-500 my-2">{error}</div>}

        {orgData.length > 0 ? (
          <div className={styles.chart}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        ) : (
          <div>No data available for the selected region</div>
        )}
      </div>

      {regionsData.length > 0 && (
        <div className={styles.mapSection}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {regionsData.map((region, index) => (
              <Marker
                key={`${region.region}-${index}`}
                position={[region.lat, region.long]}
                icon={icon}
                eventHandlers={{
                  click: () => handleMarkerClick(region.region),
                }}
              >
                <Popup>
                  <div>
                    <h3>{region.region}</h3>
                    <p>Click to see top organizations</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default DisplayOrganizations;
