import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // optional auto redirect after few seconds
    const timer = setTimeout(() => {
      navigate("/student/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>

            <h1 className="text-2xl font-bold text-green-600">
              Payment Successful!
            </h1>

            <p className="text-gray-600 mt-2">
              আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Subject আনলক হয়ে গেছে ✅
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/student/dashboard")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
              >
                Go to Dashboard
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              You will be redirected automatically…
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
