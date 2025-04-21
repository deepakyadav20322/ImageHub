// import React, { useState } from "react";
// import {
//   Drawer,
//   DrawerTrigger,
//   DrawerContent,
//   DrawerTitle,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerClose,
//   DrawerHeader,
// } from "@/components/ui/drawer";

// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Eye, X } from "lucide-react";

// import { Resource } from "@/lib/types";

// interface  AssetDrawerInterface {
//   allSelectedAssets: Resource[];
//   setAllSelectedAssets: (assets: Resource[]) => void;
//   isIcon: boolean;
// }

// const InfoItem = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex justify-between items-center text-sm text-muted-foreground border-b py-2">
//     <span className="font-medium text-foreground">{label}</span>
//     <span>{value}</span>
//   </div>
// );

// const AssetDrawer = ({ allSelectedAssets,setAllSelectedAssets ,isIcon }: AssetDrawerInterface) => {
//   if (!allSelectedAssets) return null;

//   const [tags, setTags] = useState(
//     asset.tags.split(",").map((tag) => tag.trim())
//   );
//   const [tagInput, setTagInput] = useState("");
//   const [description, setDescription] = useState(asset.description);
//   const [errors, setErrors] = useState<{ tags?: string; description?: string }>(
//     {}
//   );

//   const handleAddTag = () => {
//     const newTag = tagInput.trim();
//     if (newTag && !tags.includes(newTag)) {
//       if (newTag.length > 20) {
//         setErrors((e) => ({
//           ...e,
//           tags: "Each tag must be under 20 characters.",
//         }));
//         return;
//       }
//       setTags([...tags, newTag]);
//       setTagInput("");
//       setErrors((e) => ({ ...e, tags: undefined }));
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleSave = () => {
//     let hasError = false;
//     const newErrors: typeof errors = {};

//     if (description.length > 200) {
//       newErrors.description = "Description must be under 200 characters.";
//       hasError = true;
//     }

//     if (tags.length > 10) {
//       newErrors.tags = "You can add up to 10 tags only.";
//       hasError = true;
//     }

//     setErrors(newErrors);

//     if (!hasError) {
//       console.log("Saved:", {
//         tags,
//         description,
//       });
//       // Implement API update logic here
//     }
//   };

//   return (
//     <Drawer direction="right">
//       <DrawerTrigger asChild>
//         <Button
//           variant={isIcon ? "outline" : "default"}
//           size={isIcon ? "icon" : "lg"}
//           className="cursor-pointer"
//         >
//           {isIcon ? (
//             <Eye className="h-4 w-4" />
//           ) : (
//             <span className="">Preview</span>
//           )}
//           <span className="sr-only">Preview</span>
//         </Button>
//       </DrawerTrigger>

//       <DrawerContent className="p-4 dark:bg-gray-900 bg-white max-w-md ml-auto h-screen">
//         <DrawerHeader>
//           <DrawerTitle className="text-xl font-semibold">
//             Asset Details
//           </DrawerTitle>
//           <DrawerDescription className="text-sm text-muted-foreground">
//             Preview, inspect, and edit asset information.
//           </DrawerDescription>
//         </DrawerHeader>

//         <div className="flex flex-col gap-4">
//           <div className="rounded-xl overflow-hidden border dark:border-gray-800 shadow-sm">
//             <img
//               src={asset.imageUrl}
//               alt="Asset Preview"
//               className="w-full object-contain max-h-64 bg-muted"
//             />
//           </div>

//           <Tabs defaultValue="summary" className="w-full">
//             <TabsList className="grid grid-cols-2 w-full bg-muted">
//               <TabsTrigger value="summary">Summary</TabsTrigger>
//               <TabsTrigger value="metadata">Metadata</TabsTrigger>
//             </TabsList>

//             <TabsContent value="summary" className="mt-4">
//               <Card className="bg-background border-muted">
//                 <span className="text-center inline-block rounded-full bg-[#422006] px-3 py-1 text-xs font-semibold text-[#dcd10b] border border-[#dcd10b] mx-2">
//                   More rich metadata info coming soon!!
//                 </span>

//                 <CardContent className="p-4 space-y-2">
//                   <InfoItem label="Location" value={asset.location} />
//                   <InfoItem label="Format" value={asset.format} />
//                   <InfoItem label="File Size" value={asset.fileSize} />
//                   <InfoItem label="Dimensions" value={asset.dimensions} />
//                   <InfoItem label="Last Replaced" value={asset.lastReplaced} />
//                   <InfoItem label="Created" value={asset.created} />
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="metadata" className="mt-4">
//               <Card className="bg-background border-muted">
//                 <CardContent className="p-4 space-y-4">
//                   <div className="space-y-1">
//                     <Label
//                       htmlFor="tags"
//                       className="text-sm font-medium text-foreground"
//                     >
//                       Tags
//                     </Label>
//                     <Input
//                       id="tags"
//                       placeholder="Add tags, separated by commas"
//                       defaultValue={asset.tags}
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <Label
//                       htmlFor="description"
//                       className="text-sm font-medium text-foreground"
//                     >
//                       Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       placeholder="Add a description..."
//                       defaultValue={asset.description}
//                       className="text-sm min-h-[100px]"
//                     />
//                   </div>

//                   <div className="flex justify-end">
//                     <Button variant="default">Save Metadata</Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>

//         <DrawerFooter className="pt-6">
//           <DrawerClose asChild>
//             <Button variant="outline" className="w-full">
//               Close
//             </Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default AssetDrawer;

import React, { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerHeader,
} from "@/components/ui/drawer";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, X } from "lucide-react";

import { Resource } from "@/lib/types";
import { useAddTagsToAccountMutation } from "@/redux/apiSlice/itemsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssetDrawerInterface {
  allSelectedAssets: Resource[];
  // setAllSelectedAssets: (assets: Resource[]) => void;
  isIcon: boolean;
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm text-muted-foreground border-b py-2">
    <span className="font-medium text-foreground">{label}</span>
    <span>{value}</span>
  </div>
);
const AssetDrawer = ({
  allSelectedAssets,
  isIcon,
}: AssetDrawerInterface) => {
  // if (!allSelectedAssets || allSelectedAssets.length === 0) return null;

  const [addTags, { isLoading }] = useAddTagsToAccountMutation();

  console.log(allSelectedAssets, "all123654");
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { activeBucket } = useSelector((state: RootState) => state.resource);
  const singleAsset =
    allSelectedAssets.length === 1 ? allSelectedAssets[0] : null;

  const [tags, setTags] = useState<string[]>(
    singleAsset
      ? singleAsset?.tags?.split(",").map((tag: any) => tag.trim())
      : []
  );
  const [tagInput, setTagInput] = useState("");
  // const [description, setDescription] = useState(singleAsset ? singleAsset.description : "");
  const [errors, setErrors] = useState<{ tags?: string }>({});

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      if (newTag.length > 20) {
        setErrors((e) => ({
          ...e,
          tags: "Each tag must be under 20 characters.",
        }));
        return;
      }
      setTags([...tags, newTag]);
      setTagInput("");
      setErrors((e) => ({ ...e, tags: undefined }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async (resourceId: string) => {
    let hasError = false;
    const newErrors: typeof errors = {};
    console.log(tags, "tags1");
    if (tags.length > 10) {
      // newErrors.tags = "You can add up to 10 tags only.";
      // hasError = true;
      toast.error("You can add up to 10 tags only.");
      return;
    }

    setErrors(newErrors);

    if (!hasError) {
      console.log("Saved:---->", {
        tags,
      });
      // Save logic here
      // Prepare the tags data for saving
      if (!user) return;

      const res = await addTags({
        accountId: user.accountId,
        tags: tags,
        bucketId: activeBucket,
        resourceId,
        token: token || "",
      }).unwrap();

      // Reset tags state after saving
      if (res) {
        // setAllSelectedAssets([]);
        toast.success('your tags added successfully')
        setTags([]);
      }
    }
    // if (isSuccess) {
    //   setAllSelectedAssets([]);
    //   setTags([]);
    // }
    // }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant={isIcon ? "outline" : "default"}
          size={isIcon ? "icon" : "sm"}
          className={`cursor-pointer ${isIcon?'':'py-4'}`}
        >
          {isIcon ? (
           
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Eye className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Preview
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
          ) : (
            <span className="">Preview</span>
          )}
          <span className="sr-only">Preview</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4 dark:bg-gray-900 bg-white max-w-md ml-auto h-screen">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">
            Asset Details
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            {singleAsset
              ? "Preview, inspect, and edit asset information."
              : "Please select one item to see preview."}
          </DrawerDescription>
        </DrawerHeader>

        {singleAsset ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-x-hidden border dark:border-gray-800 shadow-sm">
              <img
                // src={singleAsset?.imageUrl || ''}
                src={"/Empty_State_Illustration_1.svg"}
                alt="Asset Preview"
                className="w-full object-contain max-h-64 bg-muted dark:bg-white"
              />
            </div>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-muted">
                <TabsTrigger value="summary" className="">Summary</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <Card className="bg-background border-muted h-full ">
                  <span className="text-center inline-block rounded-full bg-[#422006] px-3 py-1 text-xs font-semibold text-[#dcd10b] border border-[#dcd10b] mx-2">
                    More rich metadata info coming soon!!
                  </span>
                  <CardContent className="p-4 space-y-2 overflow-auto h-[220px]">
                    {/* <InfoItem label="Location" value={singleAsset.location} />
                    <InfoItem label="Format" value={singleAsset.format} />
                    <InfoItem label="File Size" value={singleAsset.fileSize} />
                    <InfoItem label="Dimensions" value={singleAsset.dimensions} />
                    <InfoItem label="Last Replaced" value={singleAsset.lastReplaced} />
                    <InfoItem label="Created" value={singleAsset.created} /> */}

                    <InfoItem label="Name" value={singleAsset.name} />
                    <InfoItem label="Type" value={singleAsset.type} />
                    <InfoItem
                      label="Containing Folder"
                      value={singleAsset.path.split("/").slice(-2, -1)[0]}
                    />
                    <InfoItem
                      label="Visibility"
                      value={singleAsset.visibility}
                    />
                    <InfoItem label="Status" value={singleAsset.status} />
                    <InfoItem
                      label="Created At"
                      value={new Date(singleAsset.createdAt).toLocaleString()}
                    />
                    <InfoItem
                      label="Updated At"
                      value={new Date(singleAsset.updatedAt).toLocaleString()}
                    />
                    {singleAsset.expiresAt && (
                      <InfoItem
                        label="Expires At"
                        value={new Date(singleAsset.expiresAt).toLocaleString()}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metadata" className="mt-4">
                <Card className="bg-background border-muted">
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="tags"
                        className="text-sm font-medium text-foreground"
                      >
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        placeholder="Add tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        onBlur={handleAddTag}
                      />
                      {errors.tags && (
                        <p className="text-sm text-red-500">{errors.tags}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-muted text-foreground px-2 py-1 rounded flex items-center gap-1"
                          >
                            {tag}
                            <X
                              size={12}
                              className="cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* <div className="space-y-1">
                      <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Add a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="text-sm min-h-[100px]"
                      />
                      {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div> */}

                    <div className="flex justify-end">
                      <Button
                        disabled={isLoading }
                        onClick={() => handleSave(singleAsset.resourceId)}
                      >
                        {isLoading ? "Saving...." : "Save Metadata"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8 text-sm">
            Please select exactly one item to preview and edit its details.
          </div>
        )}

        {allSelectedAssets.length !== 1 && (
          <DrawerFooter className="pt-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AssetDrawer;
