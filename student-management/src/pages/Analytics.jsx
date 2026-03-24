import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {

  const courseData = {
    labels: ["Computer Science", "Mathematics", "Physics", "Commerce"],
    datasets: [
      {
        label: "Students per Course",
        data: [12, 8, 6, 10],
      },
    ],
  };

  const ageData = {
    labels: ["18", "19", "20", "21"],
    datasets: [
      {
        label: "Age Distribution",
        data: [5, 10, 8, 4],
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-2 gap-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl mb-4">Students per Course</h2>
          <Bar data={courseData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl mb-4">Age Distribution</h2>
          <Pie data={ageData} />
        </div>

      </div>
    </div>
  );
}

export default Analytics;