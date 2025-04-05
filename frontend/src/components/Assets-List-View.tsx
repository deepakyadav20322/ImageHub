import { useState } from "react";
import {
  MoreHorizontal,
  Upload,
  Globe,
  Lock,
  ImageIcon,
  FileText,
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

interface AssetListProps {
  assets: Resource[];
}

const AssetList = ({ assets }: AssetListProps) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const toggleAsset = (id: string) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id));
    } else {
      setSelectedAssets([...selectedAssets, id]);
    }
  };

  const toggleAllAssets = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(assets.map((asset) => asset.resourceId));
    } else {
      setSelectedAssets([]);
    }
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
            className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg w-full max-w-lg mx-auto"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors rounded-lg p-10 flex flex-col items-center gap-4 bg-blue-100/30 min-w-[28rem]">
              <div>🚫 No assets available</div>
              <div className="flex justify-center items-center flex-col">
                <p className="text-lg font-medium text-gray-700">
                  Upload Assets to This Folder
                </p>
                <div className="text-2xl text-blue-500">+</div>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-white cursor-pointer">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </motion.div>
          </motion.div>
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
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-12  z-20">
                <Checkbox
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
              <TableHead className=" bg-white">
                Display name
              </TableHead>
              <TableHead className="hidden md:table-cell sticky top-0 bg-white z-10">
                Containing folder
              </TableHead>
              <TableHead className="hidden md:table-cell sticky top-0 bg-white z-10">
                Asset type
              </TableHead>
              <TableHead className="hidden md:table-cell sticky top-0 bg-white z-10">
                Format
              </TableHead>
              <TableHead className="hidden md:table-cell sticky top-0 bg-white z-10">
                Size
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white z-10">
                Dimensions
              </TableHead>
              <TableHead className="hidden lg:table-cell sticky top-0 bg-white z-10">
                Access control
              </TableHead>
              <TableHead className="w-12 sticky top-0 bg-white z-10"></TableHead>
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
                  className="group hover:bg-blue-100/45 h-[60px]"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedAssets.includes(asset.resourceId)}
                      onCheckedChange={() => toggleAsset(asset.resourceId)}
                      aria-label={`Select ${asset.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-300 flex-shrink-0">
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
                    {"default"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {asset.resourceTypeDetails !== null ? (
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-orange-500" />
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
