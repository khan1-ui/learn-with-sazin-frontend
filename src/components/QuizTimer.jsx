import { useEffect, useState } from "react";

export default function QuizTimer({ seconds, onTimeUp }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time === 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const min = Math.floor(time / 60);
  const sec = time % 60;

  return (
    <div className="bg-red-100 text-red-700 px-4 py-1 rounded font-semibold">
      ⏱ {min}:{sec.toString().padStart(2, "0")}
    </div>
  );
}
