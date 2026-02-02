import { useEffect, useState } from "react";
import API from "../api/axios";

export default function TeacherAnalytics({ teacher }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!teacher) return;

    const fetchAnalytics = async () => {
      const { data } = await API.get("/teachers/analytics", {
        headers: {
          Authorization: `Bearer ${teacher.token}`,
        },
      });
      setStats(data);
    };

    fetchAnalytics();
  }, [teacher]);

  if (!stats) return null;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
      <StatCard title="📘 Total Quizzes" value={stats.totalQuizzes} />
      <StatCard title="🧪 Total Attempts" value={stats.totalAttempts} />
      <StatCard title="📊 Avg Score" value={`${stats.averageScore}%`} />
      <StatCard title="✅ Pass Rate" value={`${stats.passRate}%`} />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
