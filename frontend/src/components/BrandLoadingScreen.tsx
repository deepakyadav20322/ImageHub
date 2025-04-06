// components/LoadingScreen.tsx
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* Top navbar loading bar */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Spinner + Branding */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xl font-semibold tracking-wide text-blue-600">
          MediaHub
        </span>
      </motion.div>
    </div>
  );
}
