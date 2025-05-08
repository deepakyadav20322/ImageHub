import { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Trash2, X, FileUp, UploadCloud, Plus, HardDriveIcon as GoogleDrive,
    DropletIcon as Dropbox,  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

import { FileUploadArea } from "./FileUploadArea";
import { FilePreview } from "./FilePreview";
import { ProgressIndicator } from "./ProgressIndicator";
import { StatusMessage } from "./StatusMessage";

import { UrlUpload } from "./UrlUpload";
import { FileWithPreview, GoogleDriveFile, UploadDialogProps, UploadStatus } from "./types";
import { UploadTabs } from "./Uploadtabs";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";

const UploadDialog = ({
  open,
  onClose,
  onUpload,
  maxSizeMB = 10,
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  multiple = true,
  maxFiles = 5,
}: UploadDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [activeTab, setActiveTab] = useState("my-files");
  const [fileUrl, setFileUrl] = useState("");
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { openPicker, isGoogleApiLoaded } = useGoogleDrive();

  const validateFile = useCallback(
    (file: File): { valid: boolean; message?: string } => {
      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          message: `Only ${allowedTypes
            .map((type) => type.split("/")[1].toUpperCase())
            .join(", ")} files are allowed.`,
        };
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        return {
          valid: false,
          message: `File size exceeds ${maxSizeMB}MB limit.`,
        };
      }

      return { valid: true };
    },
    [allowedTypes, maxSizeMB]
  );

  const createFileWithPreview = useCallback(
    (file: File): Promise<FileWithPreview> => {
      return new Promise((resolve) => {
        const fileWithId = Object.assign(file, {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          status: "idle",
          uploadProgress: 0,
        }) as FileWithPreview;

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileWithId.preview = e.target?.result as string;
            resolve(fileWithId);
          };
          reader.readAsDataURL(file);
        } else {
          resolve(fileWithId);
        }
      });
    },
    []
  );

  const handleFiles = useCallback(
    async (newFiles: File[]) => {
      if (!multiple && files.length + newFiles.length > 1) {
        toast.error("Only one file can be uploaded at a time");
        return;
      }

      if (multiple && files.length + newFiles.length > maxFiles) {
        toast.error(`You can upload a maximum of ${maxFiles} files`);
        return;
      }

      const validatedFiles: FileWithPreview[] = [];
      const invalidFiles: { file: File; message: string }[] = [];

      for (const file of newFiles) {
        const validation = validateFile(file);
        if (validation.valid) {
          const fileWithPreview = await createFileWithPreview(file);
          validatedFiles.push(fileWithPreview);
        } else {
          invalidFiles.push({
            file,
            message: validation.message || "Invalid file",
          });
        }
      }

      if (invalidFiles.length > 0) {
        if (invalidFiles.length === 1) {
          toast.error(`${invalidFiles[0].file.name}: ${invalidFiles[0].message}`);
        } else {
          toast.error(
            `${invalidFiles.length} files couldn't be added. Check file types and sizes.`
          );
        }
      }

      if (validatedFiles.length > 0) {
        setFiles((prev) => [...prev, ...validatedFiles]);
      }
    },
    [multiple, files.length, maxFiles, validateFile, createFileWithPreview]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      if (selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  const removeAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
  
    setUploading(true);
    setOverallProgress(0);
    setUploadStatus("idle");
  
    // Update all files to uploading status
    setFiles((prev) =>
      prev.map((file) => ({
        ...file,
        status: "uploading",
        uploadProgress: 0,
      }))
    );
  
    // Create FormData object
    const formData = new FormData();

    // Add files to FormData - FIXED VERSION
    files.forEach((file) => {
      // Create a new Blob from the file data
      const blob = new Blob([file], { type: file.type });
      // Append the Blob to FormData with the filename
      formData.append('files', blob, file.name);
    });
  
    // Simulate individual file upload progress
    const progressIntervals = files.map((file) => {
      return setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (
              f.id === file.id &&
              f.uploadProgress !== undefined &&
              f.uploadProgress < 95
            ) {
              return {
                ...f,
                uploadProgress: Math.min(
                  95,
                  (f.uploadProgress || 0) + Math.random() * 10
                ),
              };
            }
            return f;
          })
        );
  
        // Update overall progress based on individual file progress
        setOverallProgress((prev) => {
          const totalProgress = files.reduce(
            (sum, f) => sum + (f.uploadProgress || 0),
            0
          );
          return Math.min(95, totalProgress / files.length);
        });
      }, 200 + Math.random() * 300);
    });
  
    try {
      // Pass FormData to upload function
      await onUpload(formData);
  
      // Set all files to success
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "success",
          uploadProgress: 100,
        }))
      );
  
      setOverallProgress(100);
      setUploadStatus("success");
      toast.success(
        files.length === 1
          ? "File uploaded successfully!"
          : `${files.length} files uploaded successfully!`
      );
  
      onClose();
      reset();
    } catch (error) {
      console.log(error, "Error occurred during upload");
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? 'An unknown error occurred';
      
      toast.error(errorMessage);
    } finally {
      // Clear all intervals
      progressIntervals.forEach((interval) => clearInterval(interval));
      setUploading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setOverallProgress(0);
    setUploadStatus("idle");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !uploading && !isOpen && onClose()}
    >
      <DialogContent
        className="w-[98vw] !max-w-3xl p-4 sm:p-6 [&>button:last-child]:hidden dark:border-gray-500"
        onInteractOutside={(e) => uploading && e.preventDefault()}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex gap-x-2 items-center dark:text-white text-blue-600">
            <span><FileUp/></span>
            Upload Files
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Select files from your device or cloud storage:
          </p>
          <DialogClose asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 transition-colors bg-gray-100 dark:bg-black hover:text-gray-700 focus:outline-none focus:ring-2 dark:focus:ring-slate-500 focus:ring-gray-200 :border-slate-500 cursor-pointer"
              aria-label="Close"
              disabled={uploading}
            >
              <X className="h-4 w-4 text-red-400 " />
            </button>
          </DialogClose>
        </DialogHeader>

        <Tabs
          defaultValue="my-files"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <UploadTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <TabsContent value="my-files" className="space-y-4">
            {files.length === 0 ? (
              <FileUploadArea
                isDragging={isDragging}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => inputRef.current?.click()}
                allowedTypes={allowedTypes}
                maxSizeMB={maxSizeMB}
                multiple={multiple}
                maxFiles={maxFiles}
                inputRef={inputRef}
                handleFileChange={handleFileChange}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    Selected Files ({files.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeAllFiles}
                    disabled={uploading}
                    className="h-8 text-xs text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Remove All
                  </Button>
                </div>

                <ScrollArea className="h-[200px] sm:h-[250px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mx-1">
                  <div className="grid grid-cols-1 gap-3 p-4">
                    <AnimatePresence initial={false}>
                      {files.map((file) => (
                        <FilePreview
                          key={file.id}
                          file={file}
                          onRemove={removeFile}
                          uploading={uploading}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between px-1 py-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    disabled={uploading}
                    className="h-9 text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add More
                  </Button>

                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {files.length} of {maxFiles} files selected
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {uploading && (
                <ProgressIndicator
                  progress={overallProgress}
                  label={overallProgress < 100 ? "Uploading..." : "Processing..."}
                />
              )}

              {uploadStatus === "success" && !uploading && (
                <StatusMessage
                  type="success"
                  message={
                    files.length === 1
                      ? "File uploaded successfully!"
                      : `${files.length} files uploaded successfully!`
                  }
                />
              )}

              {uploadStatus === "error" && !uploading && (
                <StatusMessage
                  type="error"
                  message="Upload failed. Please try again."
                />
              )}
            </AnimatePresence>
          </TabsContent>

          {/* <TabsContent value="google-drive" className="min-h-[300px]">
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-400 bg-gray-50  p-6 dark:bg-gray-600/20 dark:hover:bg-blue-600/10">
              <GoogleDrive className="mb-3 h-12 w-12 text-blue-500 opacity-70" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-slate-300">
                Connect to Google Drive
              </h3>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-slate-300">
                Access your Google Drive files and select them for upload
              </p>
              <Button className="mt-4 bg-blue-600 dark:text-white hover:bg-blue-700">
                Connect Google Drive
              </Button>
            </div>
          </TabsContent> */}


{/* // Update the Google Drive tab content */}
<TabsContent value="google-drive" className="min-h-[300px]">
  <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-400 bg-gray-50 p-6 dark:bg-gray-600/20 dark:hover:bg-blue-600/10">
    <GoogleDrive className="mb-3 h-12 w-12 text-blue-500 opacity-70" />
    <h3 className="text-lg font-medium text-gray-700 dark:text-slate-300">
      Connect to Google Drive
    </h3>
    <p className="mt-2 text-center text-sm text-gray-500 dark:text-slate-300">
      Access your Google Drive files and select them for upload
    </p>
    <Button 
      className="mt-4 bg-blue-600 dark:text-white hover:bg-blue-700"
      onClick={() => openPicker((file) => {
        setFiles(prev => [...prev, file]);
        setActiveTab('my-files');
        toast.success(`Added "${file.name}" from Google Drive`);
      })}
      disabled={!isGoogleApiLoaded}
    >
      {isGoogleApiLoaded ? 'Select from Google Drive' : 'Loading Google Drive...'}
    </Button>
  </div>
</TabsContent>

          <TabsContent value="dropbox" className="min-h-[300px]">
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-400 bg-gray-50  p-6 dark:bg-gray-600/20 dark:hover:bg-blue-600/10">
              <Dropbox className="mb-3 h-12 w-12 text-blue-500 dark:opacity-70 opacity-7" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-slate-300">
                Connect to Dropbox
              </h3>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-slate-300">
                Access your Dropbox files and select them for upload
              </p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 dark:text-white">
                Connect Dropbox
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="url" className="min-h-[300px]">
            <UrlUpload
              fileUrl={fileUrl}
              setFileUrl={setFileUrl}
              isUrlLoading={isUrlLoading}
              urlError={urlError}
              setIsUrlLoading={setIsUrlLoading}
              setUrlError={setUrlError}
              handleFiles={handleFiles}
              setActiveTab={setActiveTab}
              allowedTypes={allowedTypes}
              maxSizeMB={maxSizeMB}
              files={files}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-2 sm:mt-6 ">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
            className="w-full sm:w-auto transition-all duration-200 mt-2 sm:mt-0 dark:border-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className={cn(
              "w-full sm:w-auto relative overflow-hidden transition-all duration-300 dark:text-white",
              uploadStatus === "success"
                ? "bg-green-600 hover:bg-green-700"
                : uploadStatus === "error"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
            disabled={files.length === 0 || uploading}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={uploading ? "uploading" : "upload"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    {files.length === 0
                      ? "Upload"
                      : files.length === 1
                      ? "Upload File"
                      : `Upload ${files.length} Files`}
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;