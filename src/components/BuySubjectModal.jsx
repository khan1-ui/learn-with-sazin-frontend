import Card from "./Card";
import API from "../api/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BuySubjectModal({ subject, classLevel, onClose }) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== LOAD PRICE ===== */
  useEffect(() => {
    let mounted = true;

    API.get(`/prices?classLevel=${classLevel}&subject=${subject}`)
      .then((res) => mounted && setPrice(res.data.price))
      .catch(() => {
        toast.error("⚠️ Failed to load price");
        setPrice(100);
      });

    return () => (mounted = false);
  }, [classLevel, subject]);

  /* ===== PAY ===== */
  const handlePay = async () => {
    try {
      setLoading(true);

      const { data } = await API.post("/payments/initiate", {
        subject,
        classLevel,
      });

      if (!data?.gatewayURL) {
        throw new Error("Gateway URL missing");
      }

      window.location.href = data.gatewayURL;
    } catch (err) {
      console.error("Payment init error:", err);
      toast.error("❌ Payment initiation failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3">✕</button>

        <h2 className="text-xl font-bold mb-2">🔓 Unlock {subject}</h2>
        <p className="text-sm text-gray-600">Class {classLevel}</p>

        <div className="mt-4 bg-gray-50 p-4 rounded">
          <p className="text-lg font-semibold">Price: ৳{price ?? "..."}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading || price === null}
            className="flex-1 bg-indigo-600 text-white py-2 rounded"
          >
            {loading ? "Redirecting..." : "Pay Now"}
          </button>
        </div>
      </Card>
    </div>
  );
}
