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
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteAssetOfFolderMutation, useGetAssetsOfFolderQuery } from "@/redux/apiSlice/itemsApi";
import { Resource } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface AssetActionsProps {
  asset: Resource;
  bucketId:string,
  folderId:string,
  onShare?: (id: string) => void;
}

export default function AssetActions({ asset, onShare,bucketId,folderId }: AssetActionsProps) {
  const [dialogType, setDialogType] = useState<"delete" | "share" | null>(null);
  const [deleteAsset, { isLoading,error }] = useDeleteAssetOfFolderMutation();
  const auth = useSelector((state:RootState)=>state.auth)
    const { refetch } = useGetAssetsOfFolderQuery({
      folderId: folderId ?? "",
      token: auth.token || "",
    });
  console.log(error)
  // Close Dialog
  const closeDialog = () => setDialogType(null);

  // Handle Delete Action
  const handleDelete = async () => {
    try {
      await deleteAsset({
        bucketId: bucketId,
        folderId: folderId,
        assetId: asset.resourceId,
        token:auth.token || "",
      }).unwrap();
      toast.success("Asset deleted successfully");
      refetch()
      closeDialog();
    } catch {
      toast.error("Failed to delete asset");
    }
  };

  // Handle Share Action - Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://yourapp.com/assets/${asset.resourceId}`
    );
    toast.success("Link copied to clipboard");
    closeDialog();
  };

  // Handle Share Action - Email (if onShare callback is provided)
  const handleShareEmail = () => {
    if (onShare) onShare(asset.resourceId); // Optionally, call parent's share handler
    toast.success("Shared via email (mock)");
    closeDialog();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDialogType("share")}>
            <Share2 size={14} className="mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogType("delete")}>
            <Trash2 size={14} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogType === "delete"} onOpenChange={closeDialog}>
        <DialogContent  
        onCloseAutoFocus={(event) => {
      event.preventDefault();
      document.body.style.pointerEvents = '';
    }}>
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{asset.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
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

      {/* Share Dialog */}
      <Dialog open={dialogType === "share"} onOpenChange={closeDialog}>
        <DialogContent 
         onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.body.style.pointerEvents = '';
        }}
        >
          <DialogHeader>
            <DialogTitle>Share Asset</DialogTitle>
            <DialogDescription>
              Share <strong>{asset.name}</strong> using one of the methods:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            <Button variant="outline" className="w-full" onClick={handleCopyLink}>
              Copy Link
            </Button>
            <Button variant="outline" className="w-full" onClick={handleShareEmail}>
              Share via Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
