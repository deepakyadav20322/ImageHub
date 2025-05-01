import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface StatusMessageProps {
  type: "success" | "error";
  message: string;
}

export const StatusMessage = ({ type, message }: StatusMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`flex items-center gap-2 rounded-md p-2.5 text-sm font-medium ${
        type === "success"
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      <span>{message}</span>
    </motion.div>
  );
};