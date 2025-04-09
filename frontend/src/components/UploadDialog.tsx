
import type React from "react"
import { useRef, useState, useCallback } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  UploadCloud,
  X,
  FileImage,
  AlertCircle,
  CheckCircle2,
  Trash2,
  HardDrive,
  FileText,
  HardDriveIcon as GoogleDrive,
  DropletIcon as Dropbox,
  ImageIcon,
  ExternalLink,
  Plus,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

interface FileWithPreview extends File {
  id: string
  preview?: string
  uploadProgress?: number
  status?: "idle" | "uploading" | "success" | "error"
  errorMessage?: string
}

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (files: File[]) => Promise<void>
  maxSizeMB?: number
  allowedTypes?: string[]
  multiple?: boolean
  maxFiles?: number
}

const UploadDialog = ({
  open,
  onClose,
  onUpload,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/jpg", "image/png"],
  multiple = true,
  maxFiles = 10,
}: UploadDialogProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState("my-files")
  const [fileUrl, setFileUrl] = useState("")
  const [isUrlLoading, setIsUrlLoading] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File): { valid: boolean; message?: string } => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          message: `Only ${allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} files are allowed.`,
        }
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        return {
          valid: false,
          message: `File size exceeds ${maxSizeMB}MB limit.`,
        }
      }

      return { valid: true }
    },
    [allowedTypes, maxSizeMB],
  )

  const createFileWithPreview = useCallback((file: File): Promise<FileWithPreview> => {
    return new Promise((resolve) => {
      const fileWithId = Object.assign(file, {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: "idle",
        uploadProgress: 0,
      }) as FileWithPreview

      // Create preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          fileWithId.preview = e.target?.result as string
          resolve(fileWithId)
        }
        reader.readAsDataURL(file)
      } else {
        resolve(fileWithId)
      }
    })
  }, [])

  const handleFiles = useCallback(
    async (newFiles: File[]) => {
      if (!multiple && files.length + newFiles.length > 1) {
        toast.error("Only one file can be uploaded at a time")
        return
      }

      if (multiple && files.length + newFiles.length > maxFiles) {
        toast.error(`You can upload a maximum of ${maxFiles} files`)
        return
      }

      const validatedFiles: FileWithPreview[] = []
      const invalidFiles: { file: File; message: string }[] = []

      for (const file of newFiles) {
        const validation = validateFile(file)
        if (validation.valid) {
          const fileWithPreview = await createFileWithPreview(file)
          validatedFiles.push(fileWithPreview)
        } else {
          invalidFiles.push({ file, message: validation.message || "Invalid file" })
        }
      }

      if (invalidFiles.length > 0) {
        if (invalidFiles.length === 1) {
          toast.error(`${invalidFiles[0].file.name}: ${invalidFiles[0].message}`)
        } else {
          toast.error(`${invalidFiles.length} files couldn't be added. Check file types and sizes.`)
        }
      }

      if (validatedFiles.length > 0) {
        setFiles((prev) => [...prev, ...validatedFiles])
      }
    },
    [multiple, files.length, maxFiles, validateFile, createFileWithPreview],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles)
      }
    },
    [handleFiles],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : []
      if (selectedFiles.length > 0) {
        handleFiles(selectedFiles)
      }
      // Reset input value so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [handleFiles],
  )

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }, [])

  const removeAllFiles = useCallback(() => {
    setFiles([])
  }, [])

  const fetchFileFromUrl = async (url: string) => {
    if (!url) return

    try {
      // Validate URL
      try {
        new URL(url)
      } catch (e) {
        throw new Error("Please enter a valid URL")
      }

      // Fetch the file
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }

      // Get file name from URL or Content-Disposition header
      let fileName = url.split("/").pop() || "downloaded-file"
      const contentDisposition = response.headers.get("content-disposition")
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        if (fileNameMatch) {
          fileName = fileNameMatch[1]
        }
      }

      // Get content type
      const contentType = response.headers.get("content-type") || ""

      // Check if content type is allowed
      if (!allowedTypes.some((type) => contentType.includes(type.split("/")[1]))) {
        throw new Error(
          `File type not allowed. Only ${allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} are supported.`,
        )
      }

      // Convert response to blob
      const blob = await response.blob()

      // Check file size
      if (blob.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit.`)
      }

      // Create a File object
      const file = new File([blob], fileName, { type: contentType })

      // Add file to the list
      await handleFiles([file])

      return file
    } catch (error) {
      console.error("Error fetching file:", error)
      throw error
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file.")
      return
    }

    setUploading(true)
    setOverallProgress(0)
    setUploadStatus("idle")

    // Update all files to uploading status
    setFiles((prev) =>
      prev.map((file) => ({
        ...file,
        status: "uploading",
        uploadProgress: 0,
      })),
    )

    // Simulate individual file upload progress
    const progressIntervals = files.map((file) => {
      return setInterval(
        () => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id === file.id && f.uploadProgress !== undefined && f.uploadProgress < 95) {
                return {
                  ...f,
                  uploadProgress: Math.min(95, (f.uploadProgress || 0) + Math.random() * 10),
                }
              }
              return f
            }),
          )

          // Update overall progress based on individual file progress
          setOverallProgress((prev) => {
            const totalProgress = files.reduce((sum, f) => sum + (f.uploadProgress || 0), 0)
            return Math.min(95, totalProgress / files.length)
          })
        },
        200 + Math.random() * 300,
      )
    })

    try {
      // Convert FileWithPreview back to File for the upload function
      const filesToUpload = files.map((f) => {
        const { id, preview, uploadProgress, status, errorMessage, ...fileProps } = f
        return new File([f], f.name, fileProps)
      })

      await onUpload(filesToUpload)

      // Set all files to success
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "success",
          uploadProgress: 100,
        })),
      )

      setOverallProgress(100)
      setUploadStatus("success")
      toast.success(files.length === 1 ? "File uploaded successfully!" : `${files.length} files uploaded successfully!`)

      // Delay closing to show success state
      setTimeout(() => {
        onClose()
        reset()
      }, 1500)
    } catch (error) {
      setUploadStatus("error")

      // Set all pending files to error
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: file.uploadProgress && file.uploadProgress < 100 ? "error" : file.status,
          errorMessage: "Upload failed",
        })),
      )

      toast.error("Upload failed. Please try again.")
    } finally {
      // Clear all intervals
      progressIntervals.forEach((interval) => clearInterval(interval))
      setUploading(false)
    }
  }

  const reset = () => {
    setFiles([])
    setOverallProgress(0)
    setUploadStatus("idle")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    } else if (fileType.startsWith("text/")) {
      return <FileText className="h-6 w-6 text-orange-500" />
    } else {
      return <FileImage className="h-6 w-6 text-purple-500" />
    }
  }

  const getFileTypeLabel = (fileType: string) => {
    return fileType.split("/")[1].toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !uploading && !isOpen && onClose()}>
      <DialogContent
        className="w-[98vw] !max-w-3xl p-4 sm:p-6 [&>button:last-child]:hidden"
        onInteractOutside={(e) => uploading && e.preventDefault()}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Upload Files</DialogTitle>
          <p className="text-sm text-gray-500">Select files from your device or cloud storage</p>
          <DialogClose asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Close"
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>

        <Tabs defaultValue="my-files" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 mb-8 sm:mb-4">
  <TabsTrigger 
    value="my-files" 
    className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium text-gray-500 cursor-pointer"
  >
    <HardDrive className="h-4 w-4" />
    <span>My Files</span>
  </TabsTrigger>
  <TabsTrigger 
    value="google-drive" 
    className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium text-gray-500 cursor-pointer"
  >
    <GoogleDrive className="h-4 w-4" />
    <span>Google Drive</span>
  </TabsTrigger>
  <TabsTrigger 
    value="dropbox" 
    className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium text-gray-500 cursor-pointer"
  >
    <Dropbox className="h-4 w-4" />
    <span>Dropbox</span>
  </TabsTrigger>
  <TabsTrigger 
    value="url" 
    className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium text-gray-500 cursor-pointer"
  >
    <ExternalLink className="h-4 w-4" />
    <span>URL</span>
  </TabsTrigger>
</TabsList>

          <TabsContent value="my-files" className="space-y-4">
            {files.length === 0 ? (
              <motion.div
                initial={{ opacity: 0.9, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200",
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:bg-slte-50 hover:border-blue-300",
                )}
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                role="button"
                tabIndex={0}
                aria-label="Upload area. Click or drag and drop files here."
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    inputRef.current?.click()
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
                      className="flex flex-col items-center"
                    >
                      <UploadCloud className="mb-3 h-12 w-12 text-blue-500" />
                      <p className="text-base font-medium text-blue-600">Drop your files here</p>
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
                      <p className="text-base font-medium text-gray-700">Drag & drop or click to upload</p>
                      <p className="mt-2 text-sm text-gray-500">
                        Supports {allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")}
                        (max {maxSizeMB}MB per file)
                      </p>
                      {multiple && (
                        <p className="mt-1 text-xs text-gray-500">You can upload up to {maxFiles} files at once</p>
                      )}
                      <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          inputRef.current?.click()
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
                  ref={inputRef}
                  onChange={handleFileChange}
                  multiple={multiple}
                  aria-label="File upload input"
                />
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Selected Files ({files.length})</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeAllFiles}
                    disabled={uploading}
                    className="h-8 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Remove All
                  </Button>
                </div>

                <ScrollArea className="h-[200px] sm:h-[250px] rounded-md border">
                  <div className="grid grid-cols-1 gap-3 p-4">
                    <AnimatePresence initial={false}>
                      {files.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="relative flex items-start gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-white p-2 sm:p-3"
                        >
                          <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {file.preview ? (
                              <img
                                src={file.preview || "/placeholder.svg"}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                              <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                              <span className="text-gray-300">•</span>
                              <span>{getFileTypeLabel(file.type)}</span>
                            </div>

                            {/* File upload progress */}
                            {file.status === "uploading" && (
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Uploading...</span>
                                  <span className="text-gray-600">{Math.round(file.uploadProgress || 0)}%</span>
                                </div>
                                <Progress value={file.uploadProgress} className="h-1.5 w-full" />
                              </div>
                            )}

                            {/* Success state */}
                            {file.status === "success" && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Upload complete</span>
                              </div>
                            )}

                            {/* Error state */}
                            {file.status === "error" && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>{file.errorMessage || "Upload failed"}</span>
                              </div>
                            )}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                                  onClick={() => removeFile(file.id)}
                                  disabled={uploading}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span className="sr-only">Remove file</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove file</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (inputRef.current) {
                        inputRef.current.click()
                      }
                    }}
                    disabled={uploading}
                    className="h-9"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add More
                  </Button>

                  <div className="text-xs text-gray-500">
                    {files.length} of {maxFiles} files selected
                  </div>
                </div>
              </div>
            )}

            {/* Overall progress and status */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {overallProgress < 100 ? "Uploading..." : "Processing..."}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2 w-full" />
                </motion.div>
              )}

              {uploadStatus === "success" && !uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 rounded-md bg-green-50 p-2.5 text-green-700"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {files.length === 1
                      ? "File uploaded successfully!"
                      : `${files.length} files uploaded successfully!`}
                  </span>
                </motion.div>
              )}

              {uploadStatus === "error" && !uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-red-700"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Upload failed. Please try again.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="google-drive" className="min-h-[300px]">
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
              <GoogleDrive className="mb-3 h-12 w-12 text-blue-500 opacity-70" />
              <h3 className="text-lg font-medium text-gray-700">Connect to Google Drive</h3>
              <p className="mt-2 text-center text-sm text-gray-500">
                Access your Google Drive files and select them for upload
              </p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Connect Google Drive</Button>
            </div>
          </TabsContent>

          <TabsContent value="dropbox" className="min-h-[300px]">
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
              <Dropbox className="mb-3 h-12 w-12 text-blue-500 opacity-70" />
              <h3 className="text-lg font-medium text-gray-700">Connect to Dropbox</h3>
              <p className="mt-2 text-center text-sm text-gray-500">
                Access your Dropbox files and select them for upload
              </p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Connect Dropbox</Button>
            </div>
          </TabsContent>

          <TabsContent value="url" className="min-h-[300px]">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Upload from URL</h3>
                <p className="mb-4 text-xs text-gray-500">Enter a URL to fetch and upload a file from the web</p>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <input
                      type="url"
                      value={fileUrl}
                      onChange={(e) => {
                        setFileUrl(e.target.value)
                        setUrlError(null)
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                      disabled={!fileUrl || isUrlLoading}
                      onClick={async () => {
                        if (!fileUrl) return

                        try {
                          setIsUrlLoading(true)
                          setUrlError(null)

                          // Validate URL
                          try {
                            new URL(fileUrl)
                          } catch (e) {
                            throw new Error("Please enter a valid URL")
                          }

                          // Fetch the file
                          const response = await fetch(fileUrl)
                          if (!response.ok) {
                            throw new Error(`Failed to fetch file: ${response.statusText}`)
                          }

                          // Get file name from URL or Content-Disposition header
                          let fileName = fileUrl.split("/").pop() || "downloaded-file"
                          const contentDisposition = response.headers.get("content-disposition")
                          if (contentDisposition) {
                            const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
                            if (fileNameMatch) {
                              fileName = fileNameMatch[1]
                            }
                          }

                          // Get content type
                          const contentType = response.headers.get("content-type") || ""

                          // Check if content type is allowed
                          if (!allowedTypes.some((type) => contentType.includes(type.split("/")[1]))) {
                            throw new Error(
                              `File type not allowed. Only ${allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} are supported.`,
                            )
                          }

                          // Convert response to blob
                          const blob = await response.blob()

                          // Check file size
                          if (blob.size > maxSizeMB * 1024 * 1024) {
                            throw new Error(`File size exceeds ${maxSizeMB}MB limit.`)
                          }

                          // Create a File object
                          const file = new File([blob], fileName, { type: contentType })

                          // Add file to the list
                          await handleFiles([file])

                          // Switch to My Files tab to show the uploaded file
                          setActiveTab("my-files")

                          // Clear URL input
                          setFileUrl("")

                          toast.success("File fetched successfully!")
                        } catch (error) {
                          console.error("Error fetching file:", error)
                          setUrlError(error instanceof Error ? error.message : "Failed to fetch file")
                          toast.error(error instanceof Error ? error.message : "Failed to fetch file")
                        } finally {
                          setIsUrlLoading(false)
                        }
                      }}
                    >
                      {isUrlLoading ? (
                        <>
                          <span className="h-4 w-4 mr-1.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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

                  <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                    <h4 className="font-medium mb-1">Tips:</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Make sure the URL points directly to a file</li>
                      <li>The file must be publicly accessible</li>
                      <li>
                        Only {allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} files are
                        supported
                      </li>
                      <li>Maximum file size: {maxSizeMB}MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Selected Files ({files.length})</h3>
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
                      <div key={file.id} className="flex items-center gap-2 rounded-md bg-gray-50 p-2">
                        <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                        </div>
                      </div>
                    ))}

                    {files.length > 2 && (
                      <div className="text-center text-xs text-gray-500 py-1">+{files.length - 2} more files</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-2 sm:mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
            className="w-full sm:w-auto transition-all duration-200 mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className={cn(
              "w-full sm:w-auto relative overflow-hidden transition-all duration-300",
              uploadStatus === "success"
                ? "bg-green-600 hover:bg-green-700"
                : uploadStatus === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700",
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
  )
}

export default UploadDialog


