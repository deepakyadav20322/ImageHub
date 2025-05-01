import { UploadCloud, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUploadAreaProps } from "./types";
import { cn } from "@/lib/utils";

export const FileUploadArea = ({
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick,
  allowedTypes,
  maxSizeMB,
  multiple,
  maxFiles,
  inputRef,
  handleFileChange,
}: FileUploadAreaProps) => {
  return (
    <motion.div
      className={cn(
        "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 dark:border-gray-400 dark:bg-gray-600/20 p-6 hover:dark:bg-blue-600/10",
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:bg-slte-50 hover:border-blue-300"
      )}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
      aria-label="Upload area. Click or drag and drop files here."
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <AnimatePresence mode="wait">
        {isDragging ? (
          <motion.div
            key="dragging"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center "
          >
            <UploadCloud className="mb-3 h-12 w-12 text-blue-500" />
            <p className="text-base font-medium text-blue-600">
              Drop your files here
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 rounded-full bg-blue-50 p-3">
              <UploadCloud className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-base font-medium text-gray-700 dark:text-slate-300">
              Drag & drop or click to upload
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Supports{" "}
              {allowedTypes
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}
              (max {maxSizeMB}MB per file)
            </p>
            {multiple && (
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                You can upload up to {maxFiles} files at once
              </p>
            )}
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 dark:text-white"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Select Files
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        type="file"
        accept={allowedTypes.join(",")}
        hidden
        name="files"
        ref={inputRef}
        onChange={handleFileChange}
        multiple={multiple}
        aria-label="File upload input"
      />
    </motion.div>
  );
};