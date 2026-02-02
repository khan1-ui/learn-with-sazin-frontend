import { motion } from "framer-motion";

export default function Card({ children, onClick ,className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`relative group bg-white rounded-xl p-6 shadow ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
