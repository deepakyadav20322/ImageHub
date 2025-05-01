import { HardDrive, ExternalLink, DropletIcon as Dropbox, HardDriveIcon as GoogleDrive } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UploadTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const UploadTabs = ({ activeTab, setActiveTab }: UploadTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 mb-8 sm:mb-4">
      <TabsTrigger
        value="my-files"
        className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium dark:data-[state=active]:bg-black dark:data-[state=active]:border-slate-300 text-gray-500 cursor-pointer"
        onClick={() => setActiveTab("my-files")}
      >
        <HardDrive className="h-4 w-4" />
        <span>My Files</span>
      </TabsTrigger>
      <TabsTrigger
        value="google-drive"
        className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium text-gray-500 cursor-pointer dark:data-[state=active]:bg-black dark:data-[state=active]:border-slate-300"
        onClick={() => setActiveTab("google-drive")}
      >
        <GoogleDrive className="h-4 w-4" />
        <span>Google Drive</span>
      </TabsTrigger>
      <TabsTrigger
        value="dropbox"
        className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium text-gray-500 cursor-pointer dark:data-[state=active]:bg-black dark:data-[state=active]:border-slate-300"
        onClick={() => setActiveTab("dropbox")}
      >
        <Dropbox className="h-4 w-4" />
        <span>Dropbox</span>
      </TabsTrigger>
      <TabsTrigger
        value="url"
        className="flex items-center gap-1.5 data-[state=active]:text-blue-600 data-[state=active]:font-medium text-gray-500 cursor-pointer dark:data-[state=active]:bg-black dark:data-[state=active]:border-slate-300"
        onClick={() => setActiveTab("url")}
      >
        <ExternalLink className="h-4 w-4" />
        <span>URL</span>
      </TabsTrigger>
    </TabsList>
  );
};