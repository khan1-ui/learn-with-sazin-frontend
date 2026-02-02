import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { motion } from "framer-motion";

export default function PaymentFail() {
  const navigate = useNavigate();

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
            <div className="text-5xl mb-4">❌</div>

            <h1 className="text-2xl font-bold text-red-500">
              Payment Failed
            </h1>

            <p className="text-gray-600 mt-2">
              দুঃখিত! পেমেন্ট সম্পন্ন হয়নি।
            </p>

            <p className="text-sm text-gray-500 mt-1">
              অনুগ্রহ করে আবার চেষ্টা করুন।
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/student/dashboard")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded"
              >
                Back to Dashboard
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
