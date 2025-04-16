// import { useState } from "react";
// import {
//   ChevronRight,
//   ChevronDown,
//   Folder,
//   FolderOpen,
//   File,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { Resource } from "@/lib/types";

// export interface FolderTreeData {
//   resourceId: string;
//   accountId: string;
//   parentResourceId: string;
//   type: string;
//   name: string;
//   displayName?: string;
//   path: string;
//   visibility: string;
//   inheritPermissions: boolean;
//   overridePermissions: boolean;
//   children?: FolderTreeData[];
//   // Other properties from your data
//   metadata?: Record<string, unknown>;
//   resourceTypeDetails?: Record<string, unknown>;
//   versionId?: string;
//   expiresAt?: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt?: string;
// }

// interface FolderTreeProps {
//   folders: FolderTreeData[]; // Changed from 'resources' to 'folders'(parent child structure ) to match your usage
// }

// const FolderTree = ({ folders }: FolderTreeProps) => {
//   console.log("tree folder",folders)
//   const { folderId } = useParams();
//   const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

//   const rootFolder = useSelector((state:RootState)=>state.items.bucketRootFolder) as Resource | null;
//   console.log("folders", folders);
// const navigate = useNavigate();
//   const toggleFolder = (folderId: string) => {
//     setExpandedFolders((prev) => ({
//       ...prev,
//       [folderId]: !prev[folderId],
//     }));

//   };

//   const handleFolderClick = (folderId:string):void=>{
//     setExpandedFolders((prev) => ({
//       ...prev,
//       [folderId]: !prev[folderId],
//     }));
//      // if (folderId !== folderId) {
//       navigate(`/dashboard/media/folders/${folderId}`);
//     // }
//   }

// // --------------------------------------
// // const dispatch = useDispatch();
// //  // here we pass folderId

// //   const handleFolderClick = async (folderId: string) => {
// //     if (expandedFolders[folderId]) {
// //       setExpandedFolders((prev) => ({
// //         ...prev,
// //         [folderId]: false,
// //       }));
// //       return;
// //     }

// //     // Fetch only if not already loaded
// //     if (!fetchedFolders[folderId]) {
// //       setFetchedFolders((prev) => ({
// //         ...prev,
// //         [folderId]: true,
// //       }));
// //     }

// //     setExpandedFolders((prev) => ({
// //       ...prev,
// //       [folderId]: true,
// //     }));
// //   };

// //   const handleAssetFetch = (folderId: string) => {
// //     dispatch(useGetAssetsOfFolderQuery(folderId));
// //   };

// // --------------------------------------

// const renderResources = (items: FolderTreeData[], level = 0) => {
//   console.log("folders items",items)
//   return items.map((item) => (
//     <div key={item.resourceId} className="w-full">
//       <div
//         className={`flex items-center py-1 my-1 rounded ${
//           item.type === "file" ? "pl-8" : ""
//         } ${folderId === item.resourceId ? "bg-blue-100 hover:bg-blue-200" : "hover:bg-gray-100"}`}
//         style={{
//           paddingLeft: `${level * 16 + (item.type === "folder" ? 8 : 24)}px`,
//         }}
//       >
//         {item.type === "folder" && item.children && (
//           <button
//             onClick={() => toggleFolder(item.resourceId)}
//             className="mr-1 text-gray-500 hover:text-gray-700 cursor-pointer"
//           >
//             {expandedFolders[item.resourceId] ? (
//               <ChevronDown size={16} />
//             ) : (
//               <ChevronRight size={16} />
//             )}
//           </button>
//         )}

//         {item.type === "folder" ? (
//           expandedFolders[item.resourceId] ? (
//             <FolderOpen size={18} className="mr-2 text-blue-500" />
//           ) : (
//             <Folder size={18} className="mr-2 text-blue-500" />
//           )
//         ) : (
//           <File size={18} className="mr-2 text-gray-400" />
//         )}

//         <span onClick={() => handleFolderClick(item.resourceId)} className="text-sm">{item.displayName || item.name}</span>
//       </div>

//       {item.type === "folder" &&
//         item.children &&
//         expandedFolders[item.resourceId] && (
//           <div className="w-full">
//             {renderResources(item.children, level + 1)}
//           </div>
//         )}
//     </div>
//   ));
// };

//   return (
//     <div className="p-2 overflow-y-auto w-60 bg-white">
//       {

//       folders.length===0?
//       <button onClick={() => rootFolder && handleFolderClick(rootFolder.resourceId)} className="mr-1 text-gray-500 hover:text-gray-700 cursor-pointer flex items-center">
//           <ChevronRight size={16} />
//       <Folder size={18} className="mr-2 text-blue-500" /><span>Default</span>
//       </button>
//       :

//       <>{
//       renderResources(folders)}</>}
//     </div>
//   );
// };

// export default FolderTree;

import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  MoreVertical,
  Trash2,
  Download,
  Share2,
  Search,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Resource } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useDeleteFolderMutation,
  useGetFoldersQuery,
} from "@/redux/apiSlice/itemsApi";
import toast from "react-hot-toast";


export interface FolderTreeData {
  resourceId: string;
  accountId: string;
  parentResourceId: string;
  type: string;
  name: string;
  displayName?: string;
  path: string;
  visibility: string;
  inheritPermissions: boolean;
  overridePermissions: boolean;
  children?: FolderTreeData[];
  metadata?: Record<string, unknown>;
  resourceTypeDetails?: Record<string, unknown>;
  versionId?: string;
  expiresAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface FolderTreeProps {
  folders: FolderTreeData[];
}

const FolderTree = ({ folders }: FolderTreeProps) => {
  const { folderId } = useParams();
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [selectedFolder, setSelectedFolder] = useState<FolderTreeData | null>(
    null
  );
  const { token } = useSelector((state: RootState) => state.auth);
  const { activeBucket } = useSelector((state: RootState) => state.resource);
  const [deleteFolder, { isLoading, isSuccess }] = useDeleteFolderMutation();
  const { refetch } = useGetFoldersQuery({
    folderId: folderId ?? "",
    token: token ?? "",
  });

  const [dialogType, setDialogType] = useState<
    "delete" | "share" | "download" | null
  >(null);

  const rootFolder = useSelector(
    (state: RootState) => state.items.bucketRootFolder
  ) as Resource | null;
  const navigate = useNavigate();

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleFolderClick = (folderId: string): void => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
    navigate(`/dashboard/media/folders/${folderId}`);
  };

  const openDialog = (
    type: "delete" | "share" | "download",
    folder: FolderTreeData
  ) => {
    setSelectedFolder(folder);
    setDialogType(type);
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedFolder(null);
    // this because when we close popup then it add pointer event none in the body(you can see in page source)
    // const overlay = document.querySelector('.dialog-overlay') as HTMLElement;
    // if (overlay) {
    //   overlay.style.pointerEvents = 'auto';  // Reset pointer events
    // }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;
    try {
      const response = await deleteFolder({
        bucketId: activeBucket,
        folderId: selectedFolder.resourceId ?? "",
        token: token ?? "",
      });

      if ("data" in response) {
        const wasActive = selectedFolder.resourceId === folderId;

        closeDialog();
        toast.success("Folder deleted successfully", { duration: 3000 });

        await refetch();

        // ✅ If user deleted the currently active folder, navigate to its parent(This is for better UX)
        if (wasActive) {
          navigate(
            `/dashboard/media/folders/${selectedFolder.parentResourceId}`
          );
        }
      } else if ("error" in response) {
        const error = response.error as { data?: { message?: string } };
        toast.error(error.data?.message || "Failed to delete folder", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      closeDialog();
      toast.error("Something wrong while deleting folder", { duration: 3000 });
    }
  };

  const renderResources = (items: FolderTreeData[], level = 0) => {
    return items.map((item) => (
      <div key={item.resourceId} className="w-full relative group">
        <div
          className={`flex items-center justify-between py-1 my-1 rounded pr-2 ${
            folderId === item.resourceId
              ? "bg-[#0057FF]/10 hover:bg-[#0057FF]/20 dark:bg-[#0057FF]/20 dark:hover:bg-[#0057FF]/30"
              : "hover:bg-gray-100 dark:hover:bg-[#323e57]"
          }`}
          style={{
            paddingLeft: `${level * 16 + (item.type === "folder" ? 8 : 24)}px`,
          }}
        >
          <div className="flex items-center gap-1">
            {item.type === "folder" && item.children && (
              <button
                onClick={() => toggleFolder(item.resourceId)}
                className="mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer"
              >
                {expandedFolders[item.resourceId] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}

            {item.type === "folder" ? (
              expandedFolders[item.resourceId] ? (
                <FolderOpen size={18} className="text-blue-500" />
              ) : (
                <Folder size={18} className="text-blue-500" />
              )
            ) : (
              <File size={18} className="text-gray-400" />
            )}

            <span
              onClick={() => handleFolderClick(item.resourceId)}
              className="text-sm cursor-pointer dark:text-white"
            >
              {item.displayName || item.name}
            </span>
          </div>

          {/* Three Dot Menu */}
          {item.type === "folder" && item.parentResourceId !== activeBucket && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-gray-200  dark:hover:bg-zinc-700">
                  <MoreVertical size={16} className={"dark:text-white"} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" w-40 dark:bg-[#2a2a2a] dark:border-zinc-700 dark:text-white">
                <DropdownMenuItem onClick={() => openDialog("delete", item)}>
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => openDialog("share", item)}>
                  <Share2 size={14} className="mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDialog("download", item)}>
                  <Download size={14} className="mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Search size={14} className="mr-2" />
                  Search this Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Render Children */}
        {item.type === "folder" &&
          item.children &&
          expandedFolders[item.resourceId] && (
            <div className="w-full">
              {renderResources(item.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };

  return (
    <>
      <div className="p-2 overflow-y-auto w-60 bg-white dark:bg-[#0c0c0f]">
        {folders.length === 0 ? (
          <button
            onClick={() =>
              rootFolder && handleFolderClick(rootFolder.resourceId)
            }
            className="mr-1 text-gray-500 hover:text-gray-700 cursor-pointer flex items-center"
          >
            <ChevronRight size={16} />
            <Folder size={18} className="mr-2 text-blue-500" />
            <span>Default</span>
          </button>
        ) : (
          <>{renderResources(folders)}</>
        )}
      </div>

      {/* Dialog */}
      {/* <Dialog
  open={!!dialogType && !!selectedFolder}
  onOpenChange={(isOpen) => {
    if (!isOpen) {
      closeDialog();
    }
  }}
>
  <DialogContent className="dark:bg-[#2a2a2a] dark:text-white dark:border-zinc-700">
    <DialogHeader>
      <DialogTitle className="dark:text-white">
        {dialogType === "delete" && "Delete Folder"}
        {dialogType === "share" && "Share Folder"}
        {dialogType === "download" && "Download Folder"}
      </DialogTitle>
      <DialogDescription className="dark:text-zinc-300">
        Are you sure you want to <strong>{dialogType}</strong> the folder{" "}
        <strong>"{selectedFolder?.name}"</strong>?
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button variant="outline" onClick={closeDialog}>
        Cancel
      </Button>
      <Button
        disabled={isLoading}
        className={`${
          dialogType === "delete"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-[#0057FF] hover:bg-[#004ae6]"
        } text-white relative`}
        onClick={() => {
          switch (dialogType) {
            case "delete":
              handleDeleteFolder();
              break;
            case "share":
              toast.success("Sharing functionality coming soon");
              closeDialog();
              break;
            case "download":
              toast.success("Download functionality coming soon");
              closeDialog();
              break;
          }
        }}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        ) : dialogType === "delete" ? (
          "Delete"
        ) : (
          "Confirm"
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog> */}

<Dialog
  open={!!dialogType && !!selectedFolder}
  onOpenChange={(isOpen) => {
    if (!isOpen) {
      closeDialog();
    }
  }}
>
  <DialogContent 
    className="dark:bg-[#2a2a2a] dark:text-white dark:border-zinc-700"
    onCloseAutoFocus={(event) => {
      event.preventDefault();
      document.body.style.pointerEvents = '';
    }}
    onInteractOutside={(e) => {
      // Prevent closing when clicking on the dialog itself
      const isDialogContent = e.target instanceof HTMLElement && 
        e.target.closest('[role="dialog"]');
      if (isDialogContent) {
        e.preventDefault();
      }
    }}
  >
    <DialogHeader>
      <DialogTitle className="dark:text-white">
        {dialogType === "delete" && "Delete Folder"}
        {dialogType === "share" && "Share Folder"}
        {dialogType === "download" && "Download Folder"}
      </DialogTitle>
      <DialogDescription className="dark:text-zinc-300">
        Are you sure you want to <strong>{dialogType}</strong> the folder{" "}
        <strong>"{selectedFolder?.name}"</strong>?
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={closeDialog}
        className="dark:bg-zinc-700 dark:hover:bg-zinc-600"
      >
        Cancel
      </Button>
      <Button
        disabled={isLoading}
        className={`${
          dialogType === "delete"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-[#0057FF] hover:bg-[#004ae6]"
        } text-white relative`}
        onClick={() => {
          switch (dialogType) {
            case "delete":
              handleDeleteFolder();
              break;
            case "share":
              toast.success("Sharing functionality coming soon");
              closeDialog();
              break;
            case "download":
              toast.success("Download functionality coming soon");
              closeDialog();
              break;
          }
        }}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        ) : dialogType === "delete" ? (
          "Delete"
        ) : (
          "Confirm"
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  );
};

export default FolderTree;
