import { Download, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { useState } from "react";

const AssetsPublicSharedDownloadPage = () => {
  const { assetsDownloadId } = useParams<{ assetsDownloadId: string }>();

  const [isImage, setIsImage] = useState(true);

  if (!isImage) {
    return (
      <div className="h-full min-h-screen w-full flex flex-col justify-center items-center gap-y-2 bg-slate-200 relative">
        <img src="/download.svg" alt="download img" className="w-48 h-48" />
        <Button>No any assets available</Button>
        <p className="text-sm absolute bottom-2 right-3">
          Powered by{" "}
          <Link to="/" className="text-blue-600">
            MediaHub
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white border-b shadow-sm flex items-center px-4">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Cloud className="h-5 w-5 text-gray-500" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">
                myimage_2_roxqj8
              </span>
              <span className="text-sm text-gray-500">22.63KB</span>
              <span className="text-sm text-gray-500">600 × 600</span>
            </div>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      {/* Main content (fills remaining space) */}
      <main className="flex bg-black items-center justify-center max-h-[calc(100vh-112px)] h-full w-full">
        <img
          src="/placeholder.svg?height=600&width=600"
          alt="Asset preview"
          className="max-h-full max-w-full object-contain"
        />
      </main>
      {/* Footer fixed at bottom */}
      <footer className="h-14 bg-white border-t flex items-center px-4">
        <div className="w-full max-w-6xl mx-auto flex justify-end text-sm text-gray-600 gap-2">
          <span>Powered by</span>
          <span className="font-semibold text-blue-600">MediaHub</span>
        </div>
      </footer>
    </div>
  );
};

export default AssetsPublicSharedDownloadPage;
