"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Plus,
  Share2,
  Share2Icon,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";
import CollectionDialog from "@/components/Collections/CollectionDialog";
import { toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useGetAllCollectionsQuery,
} from "@/redux/apiSlice/collectionApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// // This would typically come from your API or database
// const collections: any[] | (() => any[]) = [
//   // Uncomment to add more collections for testing
//   {
//     id: "2",
//     name: "Product Photos",
//     thumbnail: "/placeholder.svg?height=200&width=300",
//     assetCount: 12,
//     owner: {
//       initials: "JD",
//       color: "#3366ff",
//     },
//   },
// ];

const CollectionsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "delete" | "share" | "rename" | null
  >(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const { data: collectionsData, isLoading } = useGetAllCollectionsQuery({
    token,
  });
  const closeDialog = useCallback(() => setDialogType(null), []);
  console.log(collectionsData ,"787878787878")
  const [createCollection, { isLoading: creationLoading }] =
    useCreateCollectionMutation();

  const dropdownCollectionActions = useMemo(
    () => [
      {
        label: "Share",
        icon: <Share2 color="green" size={14} />,
        onClick: () => setDialogType("share"),
        disabled: false,
      },
      {
        label: "Delete",
        icon: <Trash2 color="red" size={14} />,
        onClick: () => setDialogType("delete"),
        disabled: false,
      },
      {
        label: "Rename",
        icon: <Pencil color="yellow" size={14} />,
        onClick: () => setDialogType("rename"),
        disabled: false,
      },
    ],
    []
  );

  const [deleteCollection,{isLoading:isDeleting}] = useDeleteCollectionMutation()

  const handleCreateCollection = async ({ name }: { name: string }) => {
    try {
      const res = await createCollection({ name, token }).unwrap();
      if (res?.data?.success) {
        console.log("response", res);
        toast.success("Collection created");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in creating collection");
    }
  };

  const handleDelete = async ({collectionId}:{collectionId:string}) => {
    try {
      const res = await deleteCollection({collectionId,token}).unwrap();
      console.log(res,"hjjjjjjjjjjjj")
      if(res?.success){
      toast.success('Collection deleted Successfully!')
      }
      console.log("collection delete");
      closeDialog();
    } catch (error) {
      toast.error("Something went wrong during collection deletion")
      console.log(error);
    }finally{
       closeDialog();
    }
  };
  

  if(isLoading){
    return (
      <div className="flex justify-center items-center h-[calc(100vh-62px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-1 h-4 w-4 cursor-pointer" />
          Create Collection
        </Button>
      </div>

      {collectionsData?.data?.length > 0 ? (
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          exit={{ y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {collectionsData?.data.map((collection: any) => (
              <div key={collection.id} className="block group ">
                <div className="rounded-lg overflow-hidden border border-border bg-card transition-all hover:shadow-md">
                  <Link to={`/dashboard/media/collections/${collection.id}`}>
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={collection?.thumbnail || "/placeholder.svg"}
                        alt={collection.name}
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded backdrop-blur-sm">
                        {collection.name}
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 flex items-center justify-between dark:bg-accent ">
                    <div className="flex items-center gap-2 ">
                      <div
                        className="w-8 h-8  rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{
                          backgroundColor:
                            collection?.owner?.color ?? "#3366ff",
                        }}
                      >
                        {collection?.owner?.initials || "IN"}
                      </div>
                      <span className="text-sm">
                        {collection.assetCount} Assets
                      </span>
                    </div>
                    {/* <button className="p-1 rounded-full hover:bg-muted">
                      <MoreVertical className="h-5 w-5" />
                    </button> */}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-slate-500 dark:bg-zinc-800 "
                      >
                        {dropdownCollectionActions.map((action) => (
                          <DropdownMenuItem
                            key={action.label}
                            onClick={action.onClick}
                            className={`${action.disabled} ? "cursor-not-allowed" : "cursor-pointer" dark:hover:bg-black cursor-pointer`}
                            disabled={action.disabled}
                          >
                            {action.icon}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {dialogType === "delete" && (
                  <Dialog open onOpenChange={closeDialog}>
                    <DialogContent
                      onCloseAutoFocus={(event) => {
                        event.preventDefault();
                        document.body.style.pointerEvents = "";
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Delete Collection</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete{" "}
                          <strong className="text-red-600">
                            {collection?.name}
                          </strong>{" "}
                          collection?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={closeDialog}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={()=>handleDelete({collectionId:collection.id})}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0.5, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="max-w-md mb-8">
              <img
                src="/empty_state_collection.svg"
                alt="Empty collections illustration"
                width={400}
                height={300}
                className="mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold mb-2">Collections</h2>
              <p className="text-muted-foreground mb-6">
                Use collections to dynamically group your assets and share them
                internally or externally
              </p>
              <Button
                className="mx-auto cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                Create New Collection
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <CollectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateCollection={handleCreateCollection}
      />
    </div>
  );
};

export default CollectionsPage;
