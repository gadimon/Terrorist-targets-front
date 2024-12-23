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
import styles from "./DisplayAttack.module.css";
import { AttackData } from "../../interfaces/ITerrorEvent";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const AttacksChart = () => {
  const [attackData, setAttackData] = useState<AttackData[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/analysis/deadliest-attack-types"
        );
        const data = await response.json();
        const sortedData = [...data].sort(
          (a, b) => b.totalCasualties - a.totalCasualties
        );
        setAttackData(sortedData);
        setSelectedTypes(sortedData.map((attack) => attack._id));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const filteredData = attackData.filter((attack) =>
    selectedTypes.includes(attack._id)
  );

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
    labels: filteredData.map((attack) => attack._id),
    datasets: [
      {
        data: filteredData.map((attack) => attack.totalCasualties),
        backgroundColor: "rgba(53, 162, 235, 0.8)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Attack Types by Casualties</h2>
        <div className={styles.filtersContainer}>
          {attackData.map((attack) => (
            <label key={attack._id} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(attack._id)}
                onChange={() => handleTypeChange(attack._id)}
              />
              <span className={styles.filterLabel}>{attack._id}</span>
            </label>
          ))}
        </div>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default AttacksChart;
