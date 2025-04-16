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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, X } from "lucide-react";
import clsx from "clsx";

interface Asset {
  imageUrl: string;
  location: string;
  format: string;
  fileSize: string;
  dimensions: string;
  lastReplaced: string;
  created: string;
  tags: string;
  description: string;
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm text-muted-foreground border-b py-2">
    <span className="font-medium text-foreground">{label}</span>
    <span>{value}</span>
  </div>
);

const AssetDrawer = ({ asset }: { asset: Asset }) => {
  if (!asset) return null;

  const [tags, setTags] = useState(asset.tags.split(",").map((tag) => tag.trim()));
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState(asset.description);
  const [errors, setErrors] = useState<{ tags?: string; description?: string }>({});

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      if (newTag.length > 20) {
        setErrors((e) => ({ ...e, tags: "Each tag must be under 20 characters." }));
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

  const handleSave = () => {
    let hasError = false;
    const newErrors: typeof errors = {};

    if (description.length > 200) {
      newErrors.description = "Description must be under 200 characters.";
      hasError = true;
    }

    if (tags.length > 10) {
      newErrors.tags = "You can add up to 10 tags only.";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      console.log("Saved:", {
        tags,
        description,
      });
      // Implement API update logic here
    }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>

        <Button variant="outline" size="icon" className="cursor-pointer">
              <Eye className="h-4 w-4" />
                <span className="sr-only">Preview</span>
                </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4 dark:bg-gray-900 bg-white max-w-md ml-auto h-screen">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">Asset Details</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Preview, inspect, and edit asset information.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden border dark:border-gray-800 shadow-sm">
            <img
              src={asset.imageUrl}
              alt="Asset Preview"
              className="w-full object-contain max-h-64 bg-muted"
            />
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-muted">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
               
              <Card className="bg-background border-muted">
              <span className="text-center inline-block rounded-full bg-[#422006] px-3 py-1 text-xs font-semibold text-[#dcd10b] border border-[#dcd10b] mx-2">
  More rich metadata info coming soon!!
</span>

                <CardContent className="p-4 space-y-2">
                  <InfoItem label="Location" value={asset.location} />
                  <InfoItem label="Format" value={asset.format} />
                  <InfoItem label="File Size" value={asset.fileSize} />
                  <InfoItem label="Dimensions" value={asset.dimensions} />
                  <InfoItem label="Last Replaced" value={asset.lastReplaced} />
                  <InfoItem label="Created" value={asset.created} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metadata" className="mt-4">
  <Card className="bg-background border-muted">
    <CardContent className="p-4 space-y-4">
      <div className="space-y-1">
        <Label htmlFor="tags" className="text-sm font-medium text-foreground">
          Tags
        </Label>
        <Input
          id="tags"
          placeholder="Add tags, separated by commas"
          defaultValue={asset.tags}
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description" className="text-sm font-medium text-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Add a description..."
          defaultValue={asset.description}
          className="text-sm min-h-[100px]"
        />
      </div>

      <div className="flex justify-end">
        <Button variant="default">Save Metadata</Button>
      </div>
    </CardContent>
  </Card>
</TabsContent>


          </Tabs>
        </div>

        <DrawerFooter className="pt-6">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AssetDrawer;
