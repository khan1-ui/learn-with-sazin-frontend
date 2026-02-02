import { useEffect, useState } from "react";
import axios from "../api/axios"; // তোমার axios instance

const Leaderboard = ({ quizId }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`/results/leaderboard/${quizId}`);
        setLeaders(res.data.data || []);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchLeaderboard();
  }, [quizId]);

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        🏆 Leaderboard (Top 10)
      </h2>

      {leaders.length === 0 ? (
        <p className="text-center text-gray-500">
          No results yet
        </p>
      ) : (
        <ul className="space-y-2">
          {leaders.map((item, index) => (
            <li
              key={item._id}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold w-6">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `${index + 1}.`}
                </span>

                <div>
                  <p className="font-semibold">
                    {item.student?.name || "Student"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Roll: {item.student?.roll || "N/A"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-600">
                  {item.score} Marks
                </p>
                <p className="text-sm text-gray-500">
                  {item.percentage}% • {Math.floor(item.timeTaken / 60)} min
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
