import { useState } from "react";

export default function ProfileImageUpload({ avatar, onChange, loading }) {
  const [localLoading, setLocalLoading] = useState(false);

  const uploadHandler = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setLocalLoading(true);

    const success = await onChange(file);

    if (!success) {
      console.warn("Upload failed");
    }
  } finally {
    setLocalLoading(false); // 🔥 ALWAYS RESET
  }
};


  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={avatar || "/default-avatar.png"}
        className="w-28 h-28 rounded-full object-cover border shadow"
        alt="profile"
      />
      <label className="cursor-pointer bg-indigo-600 text-white px-4 py-1 rounded text-sm">
        {loading || localLoading ? "Uploading..." : "Upload Photo"}
        <input type="file" hidden onChange={uploadHandler} />
      </label>
    </div>
  );
}
