// components/upload/UrlUpload.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ExternalLink, FileText, ImageIcon } from "lucide-react";
import { FileWithPreview } from "./types";
import { toast } from "react-hot-toast";

interface UrlUploadProps {
  fileUrl: string;
  setFileUrl: (url: string) => void;
  isUrlLoading: boolean;
  urlError: string | null;
  setIsUrlLoading: (loading: boolean) => void;
  setUrlError: (error: string | null) => void;
  handleFiles: (files: File[]) => Promise<void>;
  setActiveTab: (tab: string) => void;
  allowedTypes: string[];
  maxSizeMB: number;
  files: FileWithPreview[];
}

export const UrlUpload = ({
  fileUrl,
  setFileUrl,
  isUrlLoading,
  urlError,
  setIsUrlLoading,
  setUrlError,
  handleFiles,
  setActiveTab,
  allowedTypes,
  maxSizeMB,
  files,
}: UrlUploadProps) => {
  const fetchFileFromUrl = async () => {
    if (!fileUrl) return;

    try {
      setIsUrlLoading(true);
      setUrlError(null);

      // Validate URL
      try {
        new URL(fileUrl);
      } catch (e) {
        throw new Error("Please enter a valid URL.");
      }

      // Fetch the file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Get content-type and mime type
      const contentType = response.headers.get("content-type") || "";
      const mimeType = contentType.split(";")[0].trim();

      // Validate file type
      if (!allowedTypes.includes(mimeType)) {
        throw new Error(
          `Unsupported file type: ${mimeType}. Only ${allowedTypes
            .map((t) => t.split("/")[1].toUpperCase())
            .join(", ")} are supported.`
        );
      }

      // Extract file name from URL or Content-Disposition
      let rawFileName = fileUrl.split("/").pop()?.split("?")[0] || "downloaded-file";
      const contentDisposition = response.headers.get("content-disposition");
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*)\1/);
        if (match && match[2]) {
          rawFileName = match[2];
        }
      }

      // Generate extension map dynamically from allowedTypes
      const extensionMap = Object.fromEntries(
        allowedTypes.map((type) => [type, `.${type.split("/")[1]}`])
      );
      const correctExt = extensionMap[mimeType];

      // Clean filename (e.g., abc.sd.jpg → abc.jpg)
      const baseName = rawFileName.split(".")[0]; // take only before first dot
      const finalFileName = `${baseName}${correctExt}`;

      // Convert response to blob
      const blob = await response.blob();

      // Validate file size
      if (blob.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit.`);
      }

      // Create File object
      const file = new File([blob], finalFileName, { type: mimeType });

      // Upload file
      await handleFiles([file]);

      // Switch to My Files tab
      setActiveTab("my-files");

      // Clear input
      setFileUrl("");
      toast.success("File fetched successfully!");
    } catch (error) {
      console.error("Error fetching file:", error);
      const message =
        error instanceof Error ? error.message : "Failed to fetch file";
      setUrlError(message);
      toast.error(message);
    } finally {
      setIsUrlLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-400/10 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-slate-200">
          Upload from URL
        </h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">
          Enter a URL to fetch and upload a file from the web
        </p>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => {
                setFileUrl(e.target.value);
                setUrlError(null);
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap dark:text-white"
              disabled={!fileUrl || isUrlLoading}
              onClick={fetchFileFromUrl}
            >
              {isUrlLoading ? (
                <>
                  <span className="h-4 w-4 mr-1.5 animate-spin rounded-full border-2 border-white border-t-transparent dark:text-white" />
                  Fetching...
                </>
              ) : (
                "Fetch File"
              )}
            </Button>
          </div>

          {urlError && (
            <div className="rounded-md bg-red-50 p-2.5 text-sm text-red-700">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1.5" />
                <span>{urlError}</span>
              </div>
            </div>
          )}

          <div className="rounded-md bg-gray-50 dark:bg-gray-400/20 p-3 text-xs text-gray-600 dark:text-white">
            <h4 className="font-medium mb-1">Tips:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Make sure the URL points directly to a file</li>
              <li>The file must be publicly accessible</li>
              <li>
                Only{" "}
                {allowedTypes
                  .map((type) => type.split("/")[1].toUpperCase())
                  .join(", ")}{" "}
                files are supported
              </li>
              <li>Maximum file size: {maxSizeMB}MB</li>
            </ul>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="rounded-lg border bg-background border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Selected Files ({files.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("my-files")}
              className="h-8 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              View All Files
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {files.slice(0, 2).map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 rounded-md bg-gray-50 p-2"
              >
                <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                  {file.type?.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-orange-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                </div>
              </div>
            ))}

            {files.length > 2 && (
              <div className="text-center text-xs text-gray-500 py-1">
                +{files.length - 2} more files
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};