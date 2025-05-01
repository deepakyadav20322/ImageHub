import { AlertCircle, CheckCircle2, FileImage, FileText, ImageIcon, Trash2 } from "lucide-react";
import { FileWithPreview } from "@/components/UploadDialogComponents/types";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface FilePreviewProps{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  uploading: boolean;
}

export const FilePreview = ({ file, onRemove, uploading }: FilePreviewProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else if (fileType?.startsWith("text/")) {
      return <FileText className="h-6 w-6 text-orange-500" />;
    } else {
      return <FileImage className="h-6 w-6 text-purple-500" />;
    }
  };

  const getFileTypeLabel = (fileType: string) => {
    return fileType?.split("/")[1].toUpperCase();
  };

  return (
    <div className="relative flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
        {file.preview ? (
          <img
            src={file.preview || "/placeholder.svg"}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate dark:text-gray-100" title={file.name}>
          {file.name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span>{getFileTypeLabel(file.type)}</span>
        </div>

        {file.status === "uploading" && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>Uploading...</span>
              <span>{Math.round(file.uploadProgress || 0)}%</span>
            </div>
            <Progress
              value={file.uploadProgress}
              className="h-1.5 w-full bg-gray-200 dark:bg-gray-700"
            />
          </div>
        )}

        {file.status === "success" && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Upload complete</span>
          </div>
        )}

        {file.status === "error" && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{file.errorMessage || "Upload failed"}</span>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
        onClick={() => onRemove(file.id)}
        disabled={uploading}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
};