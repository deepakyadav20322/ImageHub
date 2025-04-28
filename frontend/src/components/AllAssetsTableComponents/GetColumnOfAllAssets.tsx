// columns.ts or wherever you're defining it
import { ColumnDef } from "@tanstack/react-table";
import AssetsActions from "../AssetsActions";
import { Resource } from "@/lib/types";
import { Badge } from "../ui/badge";
import { ChevronDown, File, FileText, Film, Folder, FolderClosedIcon, Image, Music } from "lucide-react";
import { Link } from "react-router";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";



function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/"))
    return <Image className="h-5 w-5 text-blue-500" />;
  if (mimeType.startsWith("video/"))
    return <Film className="h-5 w-5 text-purple-500" />;
  if (mimeType.startsWith("audio/"))
    return <Music className="h-5 w-5 text-green-500" />;
  if (mimeType === "application/pdf")
    return <FileText className="h-5 w-5 text-red-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
}


export const getColumns = ({
  bucketId,
  handleShare,
}: {
  bucketId: string;
  handleShare?: (asset: any) => void;
}): ColumnDef<Resource>[] => [
 
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-gray-300 dark:border-zinc-600 rounded-sm text-primary focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-zinc-900"
        />
      ),
      size: 40,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 300,
      minSize: 250,
      cell: ({ row }) => {
        const resource = row.original;
        const isFolder = resource.type === "folder";
        const displayName = resource.displayName || resource.name;
        const mimeType = resource.metadata?.mimetype || "";
  
        return (
          <div className="flex items-center gap-2 font-medium truncate max-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-md bg-muted dark:bg-slate-500 flex-shrink-0 flex items-center justify-center">
                {isFolder ? (
                  <Folder className="h-5 w-5 text-yellow-500" />
                ) : (
                  getFileIcon(mimeType)
                )}
              </div>
              <span>{displayName}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "parent_resource_id",
      header: "Containing Folder",
      size: 200,
      minSize: 150,
      maxSize: 700,
      cell: ({ row }) => {
        const { path, parentResourceId } = row.original;
  
        if (!path || !parentResourceId) {
          return <span className="text-muted-foreground italic">—</span>;
        }
  
        const pathParts = path.split("/").filter(Boolean);
        const folderName =
          pathParts.length > 1 ? pathParts[pathParts.length - 2] : "Root";
  
        return (
          <Link
            to={`/dashboard/media/folders/${parentResourceId}`} // ✅ update route as needed
            className="text-sm text-primary hover:underline truncate flex items-center gap-x-1 max-w-[180px]"
            title={`Go to folder: ${folderName}`}
          >
            <FolderClosedIcon color="blue" size={18} /> {folderName}
          </Link>
        );
      },
    },
  
    {
      accessorKey: "metadata.mimetype",
      header: "Type",
      size: 150,
      minSize: 120,
      cell: ({ row }) => {
        const type = row.original.metadata?.mimetype || row.original.type;
        return (
          <Badge variant="outline" className="capitalize">
            {String(type).split("/").pop()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "visibility",
      header: "Visibility",
      size: 130,
      minSize: 120,
      cell: ({ row }) => {
        const visibility = row.getValue("visibility");
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-8 cursor-pointer"
              >
                {String(visibility)}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Public</DropdownMenuItem>
              <DropdownMenuItem>Private</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      minSize: 120,
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={`capitalize font-medium
                  ${
                    status === "active"
                      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      : ""
                  }
                  ${
                    status === "processing"
                      ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                      : ""
                  }
                  ${
                    status === "error"
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      : ""
                  }
                  ${
                    status === "inactive"
                      ? "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                      : ""
                  }
                `}
          >
            {String(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Modified",
      size: 150,
      minSize: 120,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {new Date(row.getValue("updatedAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 150,
      minSize: 120,
      sortingFn: "datetime",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string;
        const date = new Date(dateStr);
  
        return isNaN(date.getTime()) ? (
          <span className="text-muted-foreground">Invalid Date</span>
        ) : (
          date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      },
    },
    {
        id: "actions",
        cell: ({ row }) => (
          <AssetsActions
            asset={row.original}
            bucketId={bucketId}
            folderId={row.original.parentResourceId ?? ''}
            onShare={handleShare}
          />
        ),
        size: 40,
      },

  
];
