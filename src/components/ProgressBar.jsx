import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressBar({ progress = 0 }) {
  // Ensure progress is between 0-100
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div style={{ width: `${progress}%` }}>
      <CircularProgressbar
        value={safeProgress}
        text={`${safeProgress}%`}
        strokeWidth={8}
        styles={buildStyles({
          pathColor: "#6366F1", // indigo-500
          textColor: "#374151", // gray-700
          trailColor: "#E5E7EB", // gray-200
          textSize: "28px",
        })}
      />
    </div>
  );
}
