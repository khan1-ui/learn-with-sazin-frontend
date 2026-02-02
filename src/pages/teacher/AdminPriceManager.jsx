import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";

export default function AdminPriceManager() {
  const [classLevel, setClassLevel] = useState(6);
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH ALL PRICES
  ========================== */
  const fetchPrices = async () => {
    try {
      const { data } = await API.get("/prices/all");
      setPrices(data);
    } catch {
      toast.error("Failed to load prices");
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  /* =========================
     SAVE PRICE
  ========================== */
  const handleSave = async () => {
    if (!subject || !price) {
      toast.error("Subject and price required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/prices", {
        classLevel,
        subject,
        price: Number(price),
      });

      toast.success("✅ Price saved");
      setSubject("");
      setPrice("");
      fetchPrices();
    } catch {
      toast.error("Failed to save price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        💰 Price Management
      </h1>

      {/* ===== FORM ===== */}
      <div className="bg-white rounded shadow p-6 mb-8 grid md:grid-cols-4 gap-4">
        <select
          value={classLevel}
          onChange={(e) => setClassLevel(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[6, 7, 8, 9, 10].map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject name"
          className="border p-2 rounded"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (৳)"
          className="border p-2 rounded"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {loading ? "Saving..." : "Save / Update"}
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">Class {p.classLevel}</td>
                <td className="p-3">{p.subject}</td>
                <td className="p-3">৳{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {prices.length === 0 && (
          <p className="text-center p-6 text-gray-500">
            No price configured yet
          </p>
        )}
      </div>
    </div>
  );
}
