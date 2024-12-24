import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./DisplayGroupsByYear.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface GroupData {
  _id: string;
  total: number;
}

const DisplayGroupsByYear = () => {
  const [groupData, setGroupData] = useState<GroupData[]>([]);

  const fetchGroupsByYear = async (year: string) => {
    try {
      const response = await fetch(
        `https://terrorist-targets.onrender.com/api/relationships/groups-by-year?year=${year}`
      );
      const data = await response.json();
      const sortedData = [...data].sort((a, b) => b.total - a.total);
      setGroupData(sortedData);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const options = {
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
        },
      },
    },
  };

  const data = {
    labels: groupData.map((group) => group._id),
    datasets: [
      {
        data: groupData.map((group) => group.total),
        backgroundColor: "rgba(53, 162, 235, 0.8)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartContainer}>
        <input
          type="text"
          placeholder="Enter Year"
          onChange={(e) => fetchGroupsByYear(e.target.value)}
        />

        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default DisplayGroupsByYear;
