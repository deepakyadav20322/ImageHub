"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
}


interface ShareLinkModalProps {
  isOpen: boolean
  onClose: () => void
  imageData: {
    id: string
    name: string
  }
}

const ShareLinksModal = ({ isOpen, onClose, imageData }: ShareLinkModalProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [link, setLink] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: undefined,
  })
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("public")

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      const fetchLink = async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const hasLink = Math.random() > 0.5
          if (hasLink) {
            setLink(`https://asset.cloudinary.com/dtylrk1zj/d9e0ed37ff${imageData.id}`)
            setDateRange({
              startDate: new Date(),
              endDate: undefined,
            })
          } else {
            setLink(null)
          }
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching link:", error)
          setLink(null)
          setIsLoading(false)
        }
      }
      fetchLink()
    }
  }, [isOpen, imageData.id])

  const handleDateChange = async (dates: any) => {
    setDateRange(dates)

    // If we have both dates and a link, automatically save the changes
    if (dates.endDate && link) {
      try {
        setIsLoading(true)
        // Simulate API call to save date changes
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsLoading(false)
        console.log("Date range saved:", dates)
      } catch (error) {
        console.error("Error saving date range:", error)
        setIsLoading(false)
      }
    }
  }

  const handleCreateLink = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setLink(`https://asset.cloudinary.com/dtylrk1zj/d9e0ed37ff${imageData.id}`)
      setDateRange({
        startDate: new Date(),
        endDate: undefined,
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating link:", error)
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDeleteLink = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLink(null)
      setDateRange({
        startDate: new Date(),
        endDate: undefined,
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Error deleting link:", error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Public Link for '{imageData.name}'</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="public" className="w-full" value={activeTab} onValueChange={setActiveTab}>
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
                        <p className="text-sm text-muted-foreground">Original Size</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" className="gap-2" onClick={handleCopyLink}>
                          <Copy className="h-4 w-4" />
                          {copied ? "Copied!" : "Copy Link"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleDeleteLink}>
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
                    <DatePicker
  date={dateRange.endDate}
  setDate={(date) => handleDateChange({ ...dateRange, endDate: date })}
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
                  <p className="text-muted-foreground">No public links available for this image.</p>
                  <Button onClick={handleCreateLink}>Create Public Link</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="private" className="mt-4">
            <div className="py-8 text-center text-muted-foreground">Private link options will appear here.</div>
          </TabsContent>

          <TabsContent value="embed" className="mt-4">
            <div className="py-8 text-center text-muted-foreground">Embed options will appear here.</div>
          </TabsContent>
        </Tabs>
       
      </DialogContent>
    </Dialog>
  )
}

export default ShareLinksModal


const DatePicker = ({ date, setDate }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}