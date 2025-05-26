// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, Trash2, Share2 } from "lucide-react";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { toast } from "react-hot-toast";
// import { Resource } from "@/lib/types";

// interface AssetActionsProps {
//   asset: Resource;
//   loading:boolean,
//   error:boolean,
//   onDelete: (id: string) => Promise<void>; // delete logic
//   onShare?: (id: string) => void; // optional share logic
// }

// export default function AssetActions({
//   asset,
//   onDelete,
//   onShare,
//   loading,
//   error
// }: AssetActionsProps) {
//   const [dialogType, setDialogType] = useState<"delete" | "share" | null>(null);

//   const closeDialog = () => setDialogType(null);

//   const handleDelete = async () => {
//     try {
//       await onDelete(asset.resourceId);
//       toast.success("Asset deleted successfully");
//     } catch (err) {
//       toast.error("Failed to delete asset");
//     } finally {
//       closeDialog();
//     }
//   };

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="icon" className="h-8 w-8">
//             <MoreHorizontal className="h-4 w-4" />
//             <span className="sr-only">Open menu</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuItem onClick={() => setDialogType("share")}>
//             <Share2 size={14} className="mr-2" />
//             Share
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => setDialogType("delete")}>
//             <Trash2 size={14} className="mr-2" />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={dialogType === "delete"} onOpenChange={closeDialog}>
//         <DialogContent  onCloseAutoFocus={(event) => {
//         event.preventDefault();
//         document.body.style.pointerEvents = '';
//       }}>
//           <DialogHeader>
//             <DialogTitle>Delete Asset</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete <strong>{asset.name}</strong>?
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={closeDialog}>
//               Cancel
//             </Button>
//             <Button
//               className="bg-red-600 text-white hover:bg-red-700"
//               onClick={handleDelete}
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Share Dialog */}
//       <Dialog open={dialogType === "share"} onOpenChange={closeDialog}>
//         <DialogContent  onCloseAutoFocus={(event) => {
//         event.preventDefault();
//         document.body.style.pointerEvents = '';
//       }}>
//           <DialogHeader>
//             <DialogTitle>Share Asset</DialogTitle>
//             <DialogDescription>
//               Share <strong>{asset.name}</strong> using one of the following
//               methods:
//             </DialogDescription>
//           </DialogHeader>

//           {/* Custom share content goes here */}
//           <div className="space-y-2 mt-2">
//             <Button
//               className="w-full"
//               variant="outline"
//               onClick={() => {
//                 navigator.clipboard.writeText(
//                   `https://yourapp.com/assets/${asset.resourceId}`
//                 );
//                 toast.success("Link copied to clipboard");
//                 closeDialog();
//               }}
//             >
//               Copy Link
//             </Button>
//             <Button
//               className="w-full"
//               variant="outline"
//               onClick={() => {
//                 if (onShare) onShare(asset.resourceId);
//                 toast.success("Shared via email (mock)");
//                 closeDialog();
//               }}
//             >
//               Share via Email
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Trash2,
  Share2,
  Pencil,
  Share2Icon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useDeleteAssetOfFolderMutation,
  useGetAllAssetsOfParticularAccountQuery,
  useGetAssetsOfFolderQuery,
  useRename_resorcefileMutation,
} from "@/redux/apiSlice/itemsApi";
import { Resource } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import ShareLinksModal from "./AttachedAndShareOptionsComponents/ShareLinksModal";
import ShareButtonOrLink from "./AttachedAndShareOptionsComponents/ShareButtonOrLink";
import { AddAssetToCollection } from "./Collections/AddAssetToCollectionDialog";


interface AssetActionsProps {
  asset: Resource;
  bucketId: string;
  folderId: string;
  onShare?: (id: string) => void;
}

export default React.memo(function AssetActions({
  asset,
  onShare,
  bucketId,
  folderId,
}: AssetActionsProps) {
  const [dialogType, setDialogType] = useState<
    "delete" | "share" | "rename" | "publicLinkShare" | "addToCollection" | null
  >(null);
  const {user} = useSelector((state: RootState) => state.auth);
  const token = useSelector((state: RootState) => state.auth.token);
  const { activeBucket } = useSelector((state: RootState) => state.resource);
  const [renameFile, { isLoading: isRenameLoading }] =
    useRename_resorcefileMutation();

  const { refetch } = useGetAssetsOfFolderQuery(
    {
      folderId: folderId ?? "",
      token: token || "",
    },
    { skip: !folderId }
  );

  const {refetch:AllassetOfAccontRefetch} = useGetAllAssetsOfParticularAccountQuery({accountId:user?.accountId??"",token:token??"",bucketId:activeBucket})

  const form = useForm({
    defaultValues: {
      newName: `${asset?.name?.split(".").slice(0, -1).join(".")}` || "",
    },
  });
  const [deleteAsset, { isLoading, error }] = useDeleteAssetOfFolderMutation();

  const closeDialog = useCallback(() => setDialogType(null), []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteAsset({
        bucketId,
        folderId,
        assetId: asset.resourceId,
        token: token || "",
      }).unwrap();
      toast.success("Asset deleted successfully");
      refetch();
      AllassetOfAccontRefetch()
      closeDialog();
    } catch {
      toast.error("Failed to delete asset");
    }
  }, [
    bucketId,
    folderId,
    asset.resourceId,
    token,
    deleteAsset,
    refetch,
    closeDialog,
  ]);

  const handleCopyLink = useCallback(() => {
    console.log(asset.path, "path");
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_API_URL_V1}/resource/${
        user?.accountId || "????"
      }-original/image/upload/${asset.path.replace("/original/default/", "")}`
    );
    toast.success("Link copied to clipboard");
    closeDialog();
  }, [asset.path, user?.accountId, closeDialog]);

  const handleShareEmail = useCallback(() => {
    onShare?.(asset.resourceId);
    toast.success("Shared via email feature comming soon ");
    closeDialog();
  }, [asset.resourceId, onShare, closeDialog]);

  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const handleAddToCollection = (collectionId: string) => {
console.log("Added to:", collectionId);
};



  const dropdownActions = useMemo(
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
      {
        label: "Public Share Link",
        icon: <Share2Icon color="blue" size={14} />,
        onClick: () => setDialogType("publicLinkShare"),
        disabled: false,
      },
      {
        label: "Add to collection",
        icon: <Share2Icon color="black" size={14} />,
        onClick: () => setShowAddToCollection(true),
        disabled: false,
      },
    ],
    []
  );

  const handleRenameSubmit = async ({ newName }: { newName: string }) => {
    try {
      console.log("rename value sub", newName);

      await renameFile({
        resourceId: asset.resourceId,
        newName,
        token: token ?? "",
        bucketName: asset.accountId + "-original",
        bucketId:activeBucket
      });
      refetch();
      AllassetOfAccontRefetch()
      toast.success("File renamed!");
      closeDialog();
    } catch (error) {
      toast.error("File Rename failed.");
    }
  };

  return (
    <>
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
          {dropdownActions.map((action) => (
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

      {dialogType === "delete" && (
        <Dialog open onOpenChange={closeDialog}>
          <DialogContent
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.body.style.pointerEvents = "";
            }}
          >
            <DialogHeader>
              <DialogTitle>Delete Asset</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{asset.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {dialogType === "share" && (
        <Dialog open onOpenChange={closeDialog}>
          <DialogContent
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.body.style.pointerEvents = "";
            }}
          >
            <DialogHeader>
              <DialogTitle>Share Asset</DialogTitle>
              <DialogDescription>
                Share <strong>{asset.name}</strong> using one of the methods:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleShareEmail}
              >
                Share via Email
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {dialogType === "publicLinkShare" && (
        <Dialog open onOpenChange={closeDialog}>
          <DialogContent
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.body.style.pointerEvents = "";
            }}
          >
            <DialogHeader>
              <DialogTitle>Share Asset</DialogTitle>
              <DialogDescription>
                Share <strong>{asset.name}</strong> using one of the methods:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <ShareButtonOrLink
                previousPopupClose={closeDialog}
                imageData={{ name: asset.name, id: asset.resourceId }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {dialogType === "rename" && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              closeDialog();
              form.reset({
                newName: asset?.name?.split(".").slice(0, -1).join(".") || "",
              });
            }
          }}
        >
          <DialogContent
            className="border-2 dark:border-gray-500"
            onInteractOutside={(e) => e.preventDefault()}
            onCloseAutoFocus={(event) => {
              event.preventDefault();

              document.body.style.pointerEvents = "";
            }}
          >
            <DialogHeader>
              <DialogTitle>Rename File</DialogTitle>
              <DialogDescription>
                Rename{" "}
                <strong>
                  {asset?.name?.split(".").slice(0, -1).join(".")}
                </strong>{" "}
                to a new name:
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRenameSubmit)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name="newName"
                  rules={{
                    validate: (value) => {
                      const trimmed = value.trim();
                      if (trimmed.length < 3)
                        return "Name must be at least 3 characters long.";
                      if (/[\/\\:\*\?"<>\|]/.test(trimmed))
                        return 'Name contains invalid characters like / \\ : * ? " < > |';
                      if (/\.\w+$/.test(trimmed))
                        return "Do not include file extensions liek (.abc)";
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter new file name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      closeDialog();
                      form.reset({
                        newName:
                          asset?.name?.split(".").slice(0, -1).join(".") || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
                    disabled={
                      isRenameLoading || form.watch("newName") === asset.name
                    }
                  >
                    {isRenameLoading ? "Renaming..." : "Rename"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* This modal is used for collection section modal */}
          {showAddToCollection && (
  <AddAssetToCollection
    asset={asset}
    trigger={
    <span
      style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      onClick={(e) => e.preventDefault()} // Prevent default if needed
    >
      Add to Collection
    </span>
  }
    onAddToCollection={(collectionId, assetId) => {
    // Optional: handle after adding to collection
    setShowAddToCollection(false); // close modal
  }}
  />
)}

         </>
  );
});
