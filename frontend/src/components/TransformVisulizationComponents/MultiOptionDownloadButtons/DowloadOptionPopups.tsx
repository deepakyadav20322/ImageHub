"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Facebook,
  Youtube,
  InstagramIcon as TiktokIcon,
  ShoppingBag,
  X,
  Download,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Define social media platform types and their download options
const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    options: [
      { name: "Post", width: 1080, height: 1080 },
      { name: "Story", width: 1080, height: 1920 },
      { name: "Profile Picture", width: 320, height: 320 },
      { name: "Carousel", width: 1080, height: 1080 },
      { name: "Reels Cover", width: 1080, height: 1920 },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    options: [
      { name: "Post", width: 1200, height: 630 },
      { name: "Story", width: 1080, height: 1920 },
      { name: "Cover Image", width: 820, height: 312 },
      { name: "Event Cover", width: 1920, height: 1005 },
      { name: "Ad carousel", width: 1080, height: 1080 },
      { name: "Profile Picture", width: 180, height: 180 },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: TiktokIcon,
    options: [
      { name: "Video Cover", width: 1080, height: 1920 },
      { name: "Profile Picture", width: 200, height: 200 },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    options: [
      { name: "Thumbnail", width: 1280, height: 720 },
      { name: "Channel Art", width: 2560, height: 1440 },
      { name: "Profile Picture", width: 800, height: 800 },
    ],
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: X,
    options: [
      { name: "Post", width: 1200, height: 675 },
      { name: "Header", width: 1500, height: 500 },
      { name: "Profile Picture", width: 400, height: 400 },
    ],
  },
  {
    id: "other",
    name: "Other",
    icon: ShoppingBag,
    options: [
      { name: "Banner (wide)", width: 970, height: 250 },
      { name: "Square", width: 1080, height: 1080 },
      { name: "Circle", width: 1010, height: 1010 },
    ],
  },
];

interface DownloadOptionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  filename?: string;
}

export function DownloadOptionsPopup({
  isOpen,
  onClose,
  imageUrl,
  filename = "image",
}: DownloadOptionsPopupProps) {
  const [activeTab, setActiveTab] = useState("instagram");
  const [customWidth, setCustomWidth] = useState("1080");
  const [customHeight, setCustomHeight] = useState("1080");
  const [activeDownloads, setActiveDownloads] = useState<
    Record<string, boolean>
  >({});
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Function to transform the URL with new dimensions
  const getTransformedUrl = (
    width: number,
    height: number,
    optionName: string
  ) => {
    // Parse the original URL
    try {
      // If this is a transformation URL, modify the parameters
      if (imageUrl.includes("/upload/")) {
        // Check if there are already transformations
        const parts = imageUrl.split("/upload/");
        const baseUrl = parts[0] + "/upload/";

        let transformations = "";
        let resourcePath = parts[1];

        // If there are existing transformations
        if (resourcePath.includes("/")) {
          const pathParts = resourcePath.split("/");
          transformations = pathParts[0];
          resourcePath = pathParts[1];

          // Replace or add width and height parameters
          const transformParams = transformations.split(",");
          const filteredParams = transformParams.filter(
            (param) => !param.startsWith("w_") && !param.startsWith("h_")
          );

          filteredParams.push(`w_${width}`, `h_${height}`);

          // Add circle transformation if it's the circle option
          if (optionName.toLowerCase() === "circle") {
            transformParams.push("r_max", "b_1");
          }

          transformations = filteredParams.join(",");
        } else {
          // No existing transformations, add new ones
          const transformParams = [`w_${width}`, `h_${height}`];

          // Add circle transformation if it's the circle option
          if (optionName.toLowerCase() === "circle") {
            transformParams.push("r_max", "b_1");
          }

          transformations = transformParams.join(",");
        }

        return `${baseUrl}${transformations}/${resourcePath}`;
      }

      // For URLs without transformation support, just return the original
      console.log("imageUrl", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error transforming URL:", error);
      return imageUrl;
    }
  };

  // Function to handle download
  const handleDownload = async (
    width: number,
    height: number,
    optionName: string
  ) => {
    const downloadKey = `${width}x${height}-${optionName}`; // Unique key per option

    setActiveDownloads((prev) => ({ ...prev, [downloadKey]: true }));
    setDownloadError(null);

    try {
      const transformedUrl = getTransformedUrl(width, height, optionName);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      // Fetch the image
      const response = await fetch(transformedUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      const blob = await response.blob();

      // Create a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${filename}-${optionName
        .toLowerCase()
        .replace(/\s+/g, "-")}-${width}x${height}.png`;

      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      // Revoke the object URL after download
      setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Download failed. Please try again."
      );
    } finally {
      setActiveDownloads((prev) => ({ ...prev, [downloadKey]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] gap-0 overflow-x-auto bg-background dark:bg-background p-2">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-bold">
            Download for Social
          </DialogTitle>
          {downloadError && (
            <motion.div
              className="mt-2 text-sm text-red-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {downloadError}
            </motion.div>
          )}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 cursor-pointer" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col">
          {/* Platform tabs */}
          <div className="flex overflow-x-auto bg-muted/30 dark:bg-muted/20 border-b">
            {socialPlatforms.map((platform) => (
              <motion.button
                key={platform.id}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all relative whitespace-nowrap border cursor-pointer mx-[2px]",
                  activeTab === platform.id
                    ? " text-primary bg-gray-400/20  "
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/90 "
                )}
                onClick={() => setActiveTab(platform.id)}
                whileTap={{ scale: 0.97 }}
              >
                <platform.icon className="h-5 w-5" />
                <span className="hidden md:block">{platform.name}</span>
                {activeTab === platform.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                    initial={false}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Options content */}
          <div className="p-4 overflow-y-auto max-h-[60vh] h-[28rem] py-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
                layout
              >
                {socialPlatforms
                  .find((platform) => platform.id === activeTab)
                  ?.options.map((option) => (
                    <motion.div
                      key={option.name}
                      className="bg-background dark:bg-muted/10 border rounded-lg p-4 flex justify-between items-center"
                      whileHover={{
                        y: -2,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <div>
                        <h3 className="font-medium">{option.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {option.width} × {option.height}
                        </p>
                      </div>
                      <motion.button
                        className={cn(
                          // 👈 UPDATED CLASSES
                          "bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-4 py-2 flex items-center gap-2 min-w-[110px] justify-center cursor-pointer",
                          activeDownloads[
                            `${option.width}x${option.height}-${option.name}`
                          ] && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() =>
                          handleDownload(
                            option.width,
                            option.height,
                            option.name
                          )
                        }
                        whileHover={
                          !activeDownloads[
                            `${option.width}x${option.height}-${option.name}`
                          ]
                            ? { scale: 1.02 }
                            : {}
                        }
                        whileTap={
                          !activeDownloads[
                            `${option.width}x${option.height}-${option.name}`
                          ]
                            ? { scale: 0.97 }
                            : {}
                        }
                        disabled={
                          activeDownloads[
                            `${option.width}x${option.height}-${option.name}`
                          ]
                        }
                      >
                        {activeDownloads[
                          `${option.width}x${option.height}-${option.name}`
                        ] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Preparing...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  ))}

                {/* Custom size option for "Other" tab */}
                {activeTab === "other" && (
                  <motion.div
                    className="bg-background dark:bg-muted/10 border rounded-lg p-4 border-blue-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    layout
                  >
                    <h3 className="font-medium mb-3">Custom Size 👇</h3>

                    {/* 👇 Error message container - add this */}
                    {(Number(customWidth) < 100 ||
                      Number(customWidth) > 4000 ||
                      Number(customHeight) < 100 ||
                      Number(customHeight) > 4000) && (
                      <motion.p
                        className="text-red-500 text-sm mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Size must be between 100 and 4000 pixels
                      </motion.p>
                    )}

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Width:</span>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => {
                            const numValue = Number(e.target.value);
                            if (numValue < 100 || numValue > 4000) {
                              setSizeError("Size must be between 100 to 4000");
                            } else {
                              setSizeError(null);
                            }
                            setCustomWidth(numValue.toString());
                        }}
                          min={100}
                          max={4000}
                          className={cn(
                            "w-20 px-2 py-1 border rounded-md",
                            (Number(customWidth) < 100 ||
                              Number(customWidth) > 4000) &&
                              "border-red-500 bg-red-50 dark:bg-red-900/20"
                          )}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm">Height:</span>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => {
                            const numValue = Number(e.target.value);
                            if (numValue < 100 || numValue > 4000) {
                              setSizeError("Size must be between 100 to 4000");
                            } else {
                              setSizeError(null);
                            }
                            setCustomHeight(numValue.toString());
                        }}
                        //   min={100}
                        //   max={4000}
                          className={cn(
                            "w-20 px-2 py-1 border rounded-md",
                            (Number(customHeight) < 100 ||
                              Number(customHeight) > 4000) &&
                              "border-red-500 bg-red-50 dark:bg-red-900/20"
                          )}
                        />
                      </div>

                      <motion.button
                        className={cn(
                          "bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-4 py-2 flex items-center gap-2 ml-auto mt-2 sm:mt-0 min-w-[110px] justify-center",
                          (Number(customWidth) < 100 ||
                            Number(customWidth) > 4000 ||
                            Number(customHeight) < 100 ||
                            Number(customHeight) > 4000) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() =>
                          handleDownload(
                            Number(customWidth),
                            Number(customHeight),
                            "custom"
                          )
                        }
                        disabled={
                          Number(customWidth) < 100 ||
                          Number(customWidth) > 4000 ||
                          Number(customHeight) < 100 ||
                          Number(customHeight) > 4000
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
