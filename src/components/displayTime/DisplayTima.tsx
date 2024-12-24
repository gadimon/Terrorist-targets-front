import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./DisplayTime.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface TimeData {
  year: number;
  month: number;
  totalKills: number;
  totalEvents: number;
}

const DisplayTime = () => {
  const [timeData, setTimeData] = useState<TimeData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("specific");
  const [selectedYear, setSelectedYear] = useState<number>(1972);
  const [startYear, setStartYear] = useState<number>(1972);
  const [endYear, setEndYear] = useState<number>(1990);

  useEffect(() => {
    const fetchData = async () => {
      let url =
        "https://terrorist-targets.onrender.com/api/analysis/incident-trends";
      switch (selectedFilter) {
        case "specific":
          url += `?startOfYear=${selectedYear}&endOfYear=${selectedYear}&startOfMonth=1&endOfMonth=12`;
          break;
        case "range":
          url += `?startOfYear=${startYear}&endOfYear=${endYear}&startOfMonth=1&endOfMonth=12`;
          break;
        case "last5":
          const fiveYearsAgo = 1980 - 5;
          url += `?startOfYear=${fiveYearsAgo}&endOfYear=2023&startOfMonth=1&endOfMonth=12`;
          break;
        case "last10":
          const tenYearsAgo = 1980 - 10;
          url += `?startOfYear=${tenYearsAgo}&endOfYear=2023&startOfMonth=1&endOfMonth=12`;
          break;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setTimeData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [selectedFilter, selectedYear, startYear, endYear]);

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
      },
    },
  };

  const data = {
    labels: timeData.map((item) => `${item.year}/${item.month}`),
    datasets: [
      {
        data: timeData.map((item) => item.totalEvents),
        backgroundColor: "rgba(53, 162, 235, 0.8)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <select
          className={styles.select}
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="specific">Specific Year</option>
          <option value="range">Year Range</option>
          <option value="last5">Last 5 Years</option>
          <option value="last10">Last 10 Years</option>
        </select>

        {selectedFilter === "specific" && (
          <input
            className={styles.input}
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            placeholder="Year"
          />
        )}

        {selectedFilter === "range" && (
          <>
            <input
              className={styles.input}
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              placeholder="Start Year"
            />
            <input
              className={styles.input}
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              placeholder="End Year"
            />
          </>
        )}
      </div>
      <div className={styles.chartContainer}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default DisplayTime;
