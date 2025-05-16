
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Define the form schema with Zod
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Collection name must be at least 3 characters" })
    .max(50, { message: "Collection name must be less than 50 characters" }),
})

type FormValues = z.infer<typeof formSchema>

interface CollectionDialog {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCollection: (data: FormValues) => void
}

const CollectionDialog = ({ open, onOpenChange, onCreateCollection }: CollectionDialog)=> {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await onCreateCollection(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create collection:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-slate-400">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>Create a collection to organize and share your assets.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input  placeholder="Enter collection name" {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="button"  className="cursor-pointer" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button  type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-500" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CollectionDialog