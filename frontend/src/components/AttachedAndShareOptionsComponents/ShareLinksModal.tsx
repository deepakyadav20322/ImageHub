"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker, type DateRangeValues } from "./DatePicker";
import { useAddPublicShareLinkMutation, useDeletePublickShareLinkMutation, useGetPublicLinkShareQuery } from "@/redux/apiSlice/itemsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { data } from "react-router";

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: {
    id: string;
    name: string;
  };
}

const ShareLinksModal = ({
  isOpen,
  onClose,
  imageData,
}: ShareLinkModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [link, setLink] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeValues>({
    startDate: new Date(),
    endDate: undefined,
  });
  const { token } = useSelector((state: RootState) => state.auth);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("public");

  const [createPublicLink] = useAddPublicShareLinkMutation();
  const { data: shareLinkData,refetch: refetchShareLink  } = useGetPublicLinkShareQuery({ token: token ?? "", resourceId: imageData.id })
const [deletePublicLink,{isLoading:deleteLoading}] = useDeletePublickShareLinkMutation()
  console.log(shareLinkData)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const fetchLink = async () => {
        try {
    
          if (shareLinkData?.success) {
            setLink(
              `${import.meta.env.VITE_FRONTEND_URL}/assets/${shareLinkData?.data?.assetShareId
             
              }`
            );
            setDateRange({
              startDate: shareLinkData?.data?.startDate,
              endDate: shareLinkData?.data?.endDate,
            });
            await refetchShareLink();
          } else {
            setLink(null);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching link:", error);
          setLink(null);
          setIsLoading(false);
        }
      };
      fetchLink();
    }
  }, [isOpen, imageData.id]);

  // const handleSave = async (dates: DateRangeValues) => {
  //   setDateRange(dates);

  //   // Convert dates to ISO strings for the onSave prop
  //   const dateStrings = {
  //     startDate: dates.startDate.toISOString(),
  //     endDate: dates.endDate?.toISOString(),
  //   };

  //   // If we have both dates and a link, automatically save the changes
  //   if (dates.endDate && link) {
  //     try {
  //       setIsLoading(true);
  //       // Simulate API call to save date changes
  //       await new Promise((resolve) => setTimeout(resolve, 800));
  //       setIsLoading(false);
  //       console.log("Date range saved:", dateStrings);
  //     } catch (error) {
  //       console.error("Error saving date range:", error);
  //       setIsLoading(false);
  //     }
  //   }
  // };

  const handleSave = async (dates: { startDate: string; endDate?: string | undefined }) => {
    // Convert strings to Date objects
    const dateRangeValues: DateRangeValues = {
      startDate: new Date(dates.startDate),
      endDate: dates.endDate ? new Date(dates.endDate) : undefined
    };
    
    setDateRange(dateRangeValues);
  
    // If we have both dates and a link, automatically save the changes
    if (dates.endDate && link) {
      try {
        setIsLoading(true);
        // Simulate API call to save date changes
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
        console.log("Date range saved:", dates);
      } catch (error) {
        console.error("Error saving date range:", error);
        setIsLoading(false);
      }
    }
  };


  const handleCreateLink = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      const response = await createPublicLink({
        token: token ?? "",
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        resourceId: imageData?.id,
      }).unwrap();
      if (response.data.success) {
        console.log("link response", response);
        setLink(
          `${import.meta.env.VITE_FRONTEND_URL}/asset/${
            response.data.assetShareId
          }`
        );
        setDateRange({
          startDate: response.data.startDate,
          endDate: response.data.endDate,
        });
        await refetchShareLink();
      }
    } catch (error) {
      console.error("Error creating link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteLink = async (assetShareId:string) => {
    setIsLoading(true);
    try {
     await deletePublicLink({token:token??'',assetShareId:assetShareId})
      setLink(null);
      setDateRange({
        startDate: new Date(),
        endDate: undefined,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting link:", error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Public Link for '{imageData.name}'</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs
          defaultValue="public"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="mt-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-8"
                >
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              ) : link ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Public Link</h3>
                        <p className="text-sm text-muted-foreground">
                          Original Size
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2 cursor-pointer"
                          onClick={handleCopyLink}
                        >
                          <Copy className="h-4 w-4" />
                          {copied ? "Copied!" : "Copy Link"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={()=>handleDeleteLink(shareLinkData?.data?.assetShareId)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <Input
                      value={link}
                      readOnly
                      className="bg-muted/50 text-xs"
                      onClick={(e) => e.currentTarget.select()}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Set expiration date</h3>
                    <DateRangePicker
                      onSave={handleSave}
                      initialStartDate={dateRange.startDate}
                      initialEndDate={dateRange.endDate}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-8 space-y-4"
                >
                  <p className="text-muted-foreground">
                    No public links available for this image.
                  </p>
                  <Button onClick={handleCreateLink}>Create Public Link</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="private" className="mt-4">
            <div className="py-8 text-center text-muted-foreground">
              Private link options will appear here.
            </div>
          </TabsContent>

          <TabsContent value="embed" className="mt-4">
            <div className="py-8 text-center text-muted-foreground">
              Embed options will appear here.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLinksModal;
