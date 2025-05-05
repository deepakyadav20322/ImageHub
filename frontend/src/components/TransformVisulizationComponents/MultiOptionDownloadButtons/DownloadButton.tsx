
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadOptionsPopup } from "@/components/TransformVisulizationComponents/MultiOptionDownloadButtons/DowloadOptionPopups";

interface DownloadButtonProps {
  imageUrl: string;
  filename?: string;
}

export function DownloadButton({
  imageUrl,
  filename = "image",
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        className="flex items-center gap-2 cursor-pointer"
      >
        <Download className="h-4 w-4 " />
        Rich Download options
      </Button>

      <DownloadOptionsPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        imageUrl={imageUrl}
        filename={filename}
      />
    </>
  );
}
