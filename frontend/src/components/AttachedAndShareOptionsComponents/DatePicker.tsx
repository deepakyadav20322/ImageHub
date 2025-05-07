"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "../ui/calendar"

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Convert database string to Date
function parseDBDate(dateString: string | Date): Date {
  return typeof dateString === "string" ? new Date(dateString) : dateString
}

const DateRangeSchema = z.object({
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }).optional(),
}).refine(
  data => !data.endDate || data.endDate > data.startDate,
  { message: "End date must be after start date", path: ["endDate"] }
)

export type DateRangeValues = z.infer<typeof DateRangeSchema>

interface DateRangePickerProps {
  onSave: (dates: { startDate: string; endDate?: string }) => Promise<void>
  initialStartDate?: string | Date
  initialEndDate?: string | Date
}

export function DateRangePicker({ 
  onSave,
  initialStartDate,
  initialEndDate
}: DateRangePickerProps) {
  const form = useForm<DateRangeValues>({
    resolver: zodResolver(DateRangeSchema),
    defaultValues: {
      startDate: initialStartDate ? parseDBDate(initialStartDate) : new Date(),
      endDate: initialEndDate ? parseDBDate(initialEndDate) : undefined,
    },
  });

  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startDate = form.watch("startDate")

  async function onSubmit(data: DateRangeValues) {
    try {
      setIsSubmitting(true)
      
      // Convert dates to ISO strings for database
      await onSave({
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString()
      })

      toast.success("Date range saved successfully")
    } catch (error) {
      toast.error("Failed to save date range")
      console.error("Save error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover open={openStart} onOpenChange={setOpenStart}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? formatDate(field.value) : <span>Pick start date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date)
                          setOpenStart(false)
                          setOpenEnd(true)
                        }
                      }}
                      initialFocus
                    
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover open={openEnd} onOpenChange={setOpenEnd}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? formatDate(field.value) : <span>Pick end date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date)
                          setOpenEnd(false)
                        }
                      }}
                      disabled={{ before: startDate }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 min-w-[150px] cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : "Save Date Range"}
          </Button>
        </div>
      </form>
    </Form>
  )
}