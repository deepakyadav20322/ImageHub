import { useState } from "react";
import {
  MoreHorizontal,
  Upload,
  Globe,
  Lock,
  ImageIcon,
  FileText,
  UploadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { Resource } from "@/lib/types";
import { cn } from "@/lib/utils";
import UploadDialog from "./UploadDialog";
import { useAssetUploader } from "@/hooks/useAssetsUploader";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { useParams } from "react-router";
import { useDeleteAssetOfFolderMutation, useGetAssetsOfFolderQuery } from "@/redux/apiSlice/itemsApi";
import AssetActions from "./AssetsActions";
interface AssetListProps {
  assets: Resource[];
  allSelectedAssets: Resource[];
  setAllSelectedAssets: (assets: Resource[]) => void;
}

const AssetList = ({
  assets,
  allSelectedAssets,
  setAllSelectedAssets,
}: AssetListProps) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const {activeBucket} = useSelector((state: RootState) => state.resource);
  const { folders: AllfolderData } = useSelector(
    (state: RootState) => state.items
  ) as { folders: Resource[] };

  const toggleAsset = (id: string) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id));
      // setAllSelectedAssets(selectedAssets.filter((assetId) => assetId !== id));
    } else {
      setSelectedAssets([...selectedAssets, id]);
    }
  };
  const { folderId: currentopenOrSelectedFolder } = useParams();
  const toggleAllAssets = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(assets.map((asset) => asset.resourceId));
      setAllSelectedAssets(assets.map((asset) => asset));
    } else {
      setSelectedAssets([]);
    }
  };
  const { refetch } = useGetAssetsOfFolderQuery({
    folderId: currentopenOrSelectedFolder || "",
    token: token || "",
  });

  const { handleUpload, isError, isLoading } = useAssetUploader(); // custome hooks
  const handleDialogUpload = async (formdata: FormData) => {
    try {
      await handleUpload({
        formdata,
        userAccountId: user?.accountId!,
        token: token || "",
        folderId: currentopenOrSelectedFolder || "",
        refetch,
      });
      setUploadOpen(false); // optionally close dialog after success
    } catch (err) {
      // optional error UI
    }
  };


  const handleShare = (assetId: string) => {
    // Add custom logic here to share the asset via email
    console.log("Sharing asset via email with ID:", assetId);
  };


  if (assets.length === 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className="w-full h-full min-h-[25rem] flex justify-center items-center"
        >
          <motion.div
            className="flex flex-col items-center gap-4 p-6 dark:bg-black bg-slate-100 rounded-lg w-full max-w-lg mx-auto"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* <motion.div className="border-2 border-dashed border-muted hover:border-primary transition-colors  rounded-lg p-10 flex flex-col items-center gap-4 bg-muted/40 dark:bg-muted/10 min-w-[28rem]">
              <div>🚫 No assets available</div>
              <div className="flex justify-center items-center flex-col">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Upload Assets to This Folder
                </p>
                <div className="text-2xl text-blue-500">+</div>
              </div>
            </motion.div> */}
            <img src="/Empty_State_Illustration_1.svg" alt="" />
            <h2 className="text-lg font-semibold dark:text-slte-100">
              Upload assets to this folder
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setUploadOpen(!uploadOpen)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <UploadIcon className="w-4 h-4" /> Upload
              </Button>
            </motion.div>
          </motion.div>
          <UploadDialog
            open={uploadOpen}
            onClose={() => setUploadOpen(false)}
            onUpload={handleDialogUpload}
            maxSizeMB={5}
            allowedTypes={[
              "image/jpeg",
              "image/png",
              "image/jpg",
              "image/webp",
            ]}
            multiple={true}
            maxFiles={5}
          />
        </motion.div>
      </>
    );
  }

  return (
    <div className="rounded-md border relative ">
      {/* Fixed height container to prevent layout shifts */}
      <div
        className="overflow-auto relative scrollbar-thin min-h-fit"
        style={{
          height: `calc(100vh - 220px)`, // Changed to fixed height

          // minHeight: `${Math.min(assets.length * 60 + 56, 400)}px`,
        }}
      >
        <Table className="relatve ">
          <TableHeader className=" sticky top-0 z-10 dark:bg-zinc-900 border-b border-muted">
            <TableRow>
              <TableHead className="w-12  z-20 border-r border-muted">
                <Checkbox
                  className="border-gray-300 dark:border-zinc-600 rounded-sm text-primary focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-zinc-900"
                  checked={
                    selectedAssets.length === assets.length && assets.length > 0
                  }
                  onCheckedChange={(checked) =>
                    toggleAllAssets(checked as boolean)
                  }
                  aria-label="Select all"
                  ref={(input) => {
                    if (input) {
                      (input as HTMLInputElement).indeterminate =
                        selectedAssets.length > 0 &&
                        selectedAssets.length < assets.length;
                    }
                  }}
                />
              </TableHead>
              <TableHead className=" bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-r">
                Display name
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-r">
                Containing folder
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-r">
                Asset type
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-r">
                Format
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-r">
                Size
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-r">
                Dimensions
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-r">
                Access control
              </TableHead>
              <TableHead className="w-12 sticky top-0 bg-white dark:bg-zinc-900 z-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {assets.map((asset, index) => (
                <motion.tr
                  key={asset.resourceId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  // className="group hover:bg-blue-100/45 hover:dark:bg-blue-400/20 h-[60px]"
                  className={cn(
                    "group h-[60px] border-b border-slate-300 dark:border-slate-700", // bottom border
                    selectedAssets?.includes(asset.resourceId)
                      ? "bg-blue-100 dark:bg-blue-800/40 border-b-white dark:border-slate-500"
                      : "hover:bg-blue-100/45 hover:dark:bg-blue-400/20"
                  )}
                >
                  <TableCell>
                    <Checkbox
                      className="border-gray-300 dark:border-zinc-600 rounded-sm text-primary focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-zinc-900"
                      checked={selectedAssets?.includes(asset.resourceId)}
                      onCheckedChange={() => toggleAsset(asset.resourceId)}
                      aria-label={`Select ${asset.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-muted dark:bg-slate-500 flex-shrink-0">
                        {/* <img
                          src={asset?.path || "/placeholder.svg"}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        /> */}
                      </div>
                      <span className="font-medium">{asset.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {
                      AllfolderData.find(
                        (data: Resource) =>
                          data.resourceId === asset.parentResourceId
                      )?.name
                    }
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {asset.resourceTypeDetails !== null ? (
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-orange-500 dark:text-orange-300" />
                      )}
                      {asset.type}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {typeof asset.metadata === "string"
                      ? asset.metadata
                      : asset.metadata
                      ? JSON.stringify(asset.metadata.mimetype)
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {typeof asset.metadata === "string"
                      ? asset.metadata
                      : asset.metadata
                      ? JSON.stringify(asset.metadata.size) + " bits"
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {typeof asset.metadata === "string"
                      ? asset.metadata
                      : asset.metadata
                      ? "null"
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      {asset.visibility ? (
                        <>
                          <Globe className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-muted-foreground">
                            Public
                          </span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-amber-500" />
                          <span className="text-xs text-muted-foreground">
                            Private
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className="">Share</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Copy Link</DropdownMenuItem>
                              <DropdownMenuItem>Email</DropdownMenuItem>
                              <DropdownMenuItem>Embed</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                    {/* Here we make a reusable components which use all view of assets for perform actions on each assets(file)  */}
                    <AssetActions
                  asset={asset}
                  bucketId={activeBucket}
                  folderId={currentopenOrSelectedFolder ?? ""}
                   onShare={handleShare} // Optional: share handler
                     />
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetList;
