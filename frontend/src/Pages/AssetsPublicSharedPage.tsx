import { useState, useEffect } from "react";
import { Download, Cloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { useGetPublicLinkShareByAssetShareIdQuery } from "@/redux/apiSlice/itemsApi";
import { toast } from "react-hot-toast";

const AssetsPublicSharedDownloadPage = () => {
  const { assetShareId } = useParams<{ assetShareId: string }>();
  const { data, isLoading, isError, error } = useGetPublicLinkShareByAssetShareIdQuery({
    assetShareId: assetShareId || 'undefined'
  }) as { data: any; isLoading: boolean; isError: boolean; error: { data: { success:boolean,message: string } } };

  const [isImage, setIsImage] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
 console.log("uid data",data?.data.name)
  useEffect(() => {
    if (data?.data?.assetAbsoluteURL ) {
      // Simple check for image extension
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp','svg'];
      const isImageFile = imageExtensions.some(ext => 
        data?.data?.url?.toLowerCase().includes(ext)
      );
      setIsImage(true);
    }
  }, [data]);

  const handleDownload = async () => {
    if (!data?.data?.assetAbsoluteURL ) return;
    
    try {
        // Create a persistent toast
    const toastId = toast.loading(
      <div className="flex items-center gap-2">
        <span>Preparing download...</span>
      </div>,
      {
        duration: Infinity, // Will stay until manually dismissed
      }
    );
      setIsDownloading(true);
      const response = await fetch(data?.data.assetAbsoluteURL );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = data?.data?.name || 'download_mediaHub';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(
        <div className="flex items-center gap-2">
          <span>Download started!</span>
        </div>,
        {
          id: toastId,
          duration:2000
        }
      );
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data?.data?.assetAbsoluteURL ) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-y-4 bg-slate-100">
        
        <img 
          src="/download.svg" 
          alt="download img" 
          className="w-48 h-48 opacity-70" 
        />
        <p className="text-gray-600">
          {isError ? (error.data.message) :( "No asset available")}
        </p>
        <Button asChild variant="outline">
          <Link to="/">Go to Home</Link>
        </Button>
        <p className="text-sm absolute bottom-4 text-gray-500">
          Powered by{" "}
          <Link to="/" className="text-blue-600 hover:underline">
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
                {data?.data?.name || 'Untitled'}
              </span>
              <span className="text-sm text-gray-500">
                {data?.data.metaData ? `${(data?.data.metaData.size / 1024).toFixed(2)}KB` : 'Unknown size'}
              </span>
              {data.dimensions && (
                <span className="text-sm text-gray-500">
                  {data.dimensions.width} × {data.dimensions.height}
                </span>
              )}
            </div>
          </div>
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2 bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download
            
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 flex items-center justify-center py-1">
        <div className="w-full h-full object-contain relative">

      {data?.data?.assetAbsoluteURL ? (
          <ImageWithLoader 
            src={data.data.assetAbsoluteURL}
            alt={data?.data.name || 'Asset preview'}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <Download className="h-16 w-16 text-gray-400" />
            <p className="text-gray-500">No asset available</p>
          </div>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 bg-white border-t flex items-center px-4">
        <div className="w-full max-w-6xl mx-auto flex justify-end text-sm text-gray-600 gap-2">
          <span>Powered by</span>
          <Link to="/" className="font-semibold text-blue-600 hover:underline">
            MediaHub
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AssetsPublicSharedDownloadPage;




const ImageWithLoader = ({ src, alt }:{src:string,alt:string}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className=" w-full h-full flex items-center justify-center">
       {/* Skeleton Loading Animation */}
       {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center m-4">
          <div className="w-full h-full animate-pulse bg-gray-300 rounded-none flex justify-center items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      )}
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <p className="text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`max-h-[calc(100vh-112px)] max-w-full object-contain ${
          isLoading || hasError ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};
