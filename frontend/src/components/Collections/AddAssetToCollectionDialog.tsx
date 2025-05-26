
import React  from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Search, Folder, X, AlertCircle, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useGetAllCollectionsQuery } from "@/redux/apiSlice/collectionApi"
import { useSearchParams } from "react-router"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Collection, Resource } from "@/lib/types"
// Mock data for collections
const mockCollections = [
  {
    id: "1",
    name: "anuman",
    assetCount: 1,
    owner: "deepak yadav",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Design Assets",
    assetCount: 24,
    owner: "john doe",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Photography",
    assetCount: 156,
    owner: "jane smith",
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    name: "UI Components",
    assetCount: 89,
    owner: "alex johnson",
    createdAt: new Date("2024-01-01"),
  },
]

const formSchema = z.object({
  searchQuery: z.string().optional(),
  selectedCollectionId: z.string().min(1, "Please select a collection"),
})

type FormData = z.infer<typeof formSchema>



interface AddAssetToCollectionProps {
  asset?: Resource;
  onAddToCollection?: (collectionId: string, assetId: string) => void
  trigger?: React.ReactNode}

export function AddAssetToCollection({ asset, onAddToCollection, trigger }: AddAssetToCollectionProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedCollection, setSelectedCollection] = React.useState<string>("")
  const {token} = useSelector((state:RootState)=>state.auth)
  const {data,isLoading} = useGetAllCollectionsQuery({token}); 
  const [filteredCollections, setFilteredCollections] = React.useState<Collection[]>(data?.data)
  const [collections, setCollections] = React.useState<Collection[]>(data?.data)
   console.log(data)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: "",
      selectedCollectionId: "",
    },
  })

  const searchQuery = form.watch("searchQuery")

  // Filter collections based on search query
  React.useEffect(() => {
    if (!searchQuery) {
      setFilteredCollections(collections)
    } else {
      const filtered = collections?.filter(
        (collection) =>
          collection.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          collection?.owner?.toLowerCase().includes(searchQuery?.toLowerCase()),
      )
      setFilteredCollections(filtered)
    }
  }, [searchQuery, collections])

  const onSubmit = (data: FormData) => {
    if (onAddToCollection && asset?.resourceId) {
      onAddToCollection(data.selectedCollectionId, asset.resourceId)
    }
    setOpen(false)
    form.reset()
    setSelectedCollection("")
  }

  // Update state when data is available(because data load asynchronasly when add(data?.data) in collection state above)
React.useEffect(() => {
  if (data?.data) {
    setCollections(data.data)
    setFilteredCollections(data.data)
  }
}, [data])


  const handleCollectionSelect = (collectionId: string) => {
    setSelectedCollection(collectionId)
    form.setValue("selectedCollectionId", collectionId)
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
    setSelectedCollection("")
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add to Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden dark:border-gray-500">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add to Collection</DialogTitle>
            {/* <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
              <X className="w-4 h-4" />
            </Button> */}
          </div>
          <DialogDescription className="sr-only">Select a collection to add your asset to</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="px-6 py-4 space-y-4">
              <FormField
                control={form.control}
                name="searchQuery"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter collection name"
                          className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedCollectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ScrollArea className="h-[280px] w-full">
                        <div className="space-y-2 pr-4">
                            {isLoading ? (
  <div className="text-center py-8 text-muted-foreground">
    <p className="text-sm">Loading collections...</p>
  </div>
) : (<>
                          {filteredCollections?.length > 0 ? (
                            
                            filteredCollections?.map((collection) => (
                              <div
                                key={collection.id}
                                className={`
                                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                                  transition-all duration-200 hover:bg-muted/50
                                  ${
                                    selectedCollection === collection.id
                                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                                  }
                                `}
                                onClick={() => handleCollectionSelect(collection.id)}
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Folder className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm truncate">{collection.name}</h4>
                                    {selectedCollection === collection.id && (
                                      <Badge variant="secondary" className="text-xs">
                                        Selected
                                      </Badge>
                                    )}
                                  </div>
                                  {/* <p className="text-xs text-muted-foreground">
                                    {collection?.assetCount} assets | {collection.owner}
                                  </p> */}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No collections found</p>
                              <p className="text-xs">Try adjusting your search</p>
                            </div>
                          )}</>)}
                        </div>
                      </ScrollArea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="px-6 py-4 border-t bg-muted/20">
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Collections can contain up to 10000 assets in your current Assets plan. Disabled collections may have
                  reached capacity. <span className="text-primary hover:underline cursor-pointer">Reach out</span> to
                  our support team for more options and information.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={!selectedCollection} className="px-6 bg-primary hover:bg-primary/90">
                  Add
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
