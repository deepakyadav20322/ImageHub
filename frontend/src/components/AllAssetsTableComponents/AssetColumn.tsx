import { ColumnDef } from "@tanstack/react-table"
import { Resource } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ArrowUp, ChevronDown, Copy, Download, MoreVertical, Share2, Trash2 } from "lucide-react"
import { Checkbox } from "../ui/checkbox"

export const resourceColumns: ColumnDef<Resource>[] = [
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
          className="translate-y-[2px]"
        />
      ),
      size: 40,
      minSize: 40,
      maxSize: 40,
    },
    {
      accessorKey: "displayName",
      header: "Display Name",
      size: 300,
      minSize: 200,
      cell: ({ row }) => (
        <div className="font-medium truncate max-w-[280px]">
          {row.getValue("displayName")}
        </div>
      ),
    },
    {
      accessorKey: "folder",
      header: "Folder",
      size: 160,
      minSize: 100,
      cell: ({ row }) => (
        <div className="truncate max-w-[140px]">{row.getValue("folder")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      size: 150,
      minSize: 100,
      cell: ({ row }) => (
        <Badge
          variant={row.getValue("type") === "Video" ? "destructive" : "outline"}
          className="capitalize"
        >
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: "format",
      header: "Format",
      size: 150,
      minSize: 100,
      cell: ({ row }) => (
        <div className="uppercase">{row.getValue("format")}</div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      size: 150,
      minSize: 100,
      cell: ({ row }) => <div>{row.getValue("size")}</div>,
    },
    {
      accessorKey: "dimensions",
      header: "Dimensions",
      size: 180,
      minSize: 100,
      cell: ({ row }) => <div>{row.getValue("dimensions")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      minSize: 100,
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
          <ArrowUp className="w-4 h-4 text-muted-foreground" />
          {row.getValue("status")}
        </Button>
      ),
    },
    {
      accessorKey: "visibility",
      header: "Visibility",
      size: 150,
      minSize: 100,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
              {row.getValue("visibility")}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Public</DropdownMenuItem>
            <DropdownMenuItem>Private</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: "actions",
      size: 40,
      minSize: 40,
      maxSize: 60,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  