import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  getFilteredRowModel,
  RowSelectionState,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Download,
  Trash2,
  Share2,
  Copy,
  MoreVertical,
  Folder,
  File,
  Image,
  Film,
  Music,
  FileText,
  FolderClosedIcon,
  Settings,
  Grid,
  List,
  LayoutGrid,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  useGetAllAssetsOfParticularAccountQuery,
  useLazyGetAllAssetsOfParticularAccountQuery,
} from "@/redux/apiSlice/itemsApi";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Resource } from "@/lib/types";
import { Link } from "react-router";
import AssetDrawer from "@/components/AssetsInfoDrawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TagFilterDropdown } from "@/components/TagFilterDropdown";
import AssetsActions from "@/components/AssetsActions";
import { getColumns } from "@/components/GetColumnOfAllAssets";

type ViewMode = "list" | "card";

const AssetsManagerTable = () => {
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 14, // Set your desired page size
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { activeBucket } = useSelector((state: RootState) => state.resource);
  const [sorting, setSorting] = useState([
    { id: "createdAt", desc: true }, // automatically sorted by latest created
  ]);

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("_score"); // Default sort

  const [allAssets, setAllAssets] = useState<Resource[]>([]);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  // Searching and view mode states
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  //   const [searchQuery, setSearchQuery] = useState("");
  const clearSearch = () => {
    setSearch("");
  };
  const [getAllAssets, { isLoading }] =
    useLazyGetAllAssetsOfParticularAccountQuery();

  const fetchAssets = async () => {
    try {
      const response = await getAllAssets({
        accountId: user?.accountId,
        token: token ?? "",
        bucketId: activeBucket,
        search,
        tags: selectedTags,
        sort_by: sortBy,
        //   bucketId: activeBucket || 'a3a98955-e1df-474e-894e-f9cb5767f961'
      }).unwrap();

      if (response) {
        setAllAssets(response);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAllAssets([]);
    }
  };

  const showingText = () => {
    const start = pagination.pageIndex * pagination.pageSize + 1;
    const end = Math.min(
      (pagination.pageIndex + 1) * pagination.pageSize,
      allAssets.length
    );
    return `Showing ${start}-${end} of ${allAssets.length} resources`;
  };

  useEffect(() => {
    fetchAssets();
  }, [activeBucket]);

  const handleShare = (assetId: string) => {
    // Add custom logic here to share the asset via email
    console.log("Sharing asset via email with ID:", assetId);
  };

  useEffect(() => {
    if (selectedTags.length === 0) {
      fetchAssets();
    }
  }, [selectedTags]);

  const columns = useMemo(
    () =>
      getColumns({
        bucketId: activeBucket,
        handleShare,
      }),
    [activeBucket, handleShare]
  );

  const table = useReactTable({
    data: allAssets,
    columns,
    state: {
      rowSelection,
      pagination: pagination,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    columnResizeMode,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalWidth = table.getTotalSize();

  // Synchronize horizontal scrolling
  const handleHeaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="mt-14 p-2 py-1">
      <AnimatePresence>
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4 flex-1 bg-gray-100 rounded p-1 dark:bg-zinc-900 dark:text-white mb-1">
              {/* <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Type to filter..."
                  className="w-full pl-9 pr-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div> */}
              <div className="flex items-center justify-between w-full">
                <div className="flex px-2 items-center  gap-4 w-full ps-2">
                  <div className="relative dark:bg-black dark:text-white bg-white text-black">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoComplete="off"
                      className="border px-2 py-1 w-72  pl-9 pr-9 border-gray-400 rounded-md"
                    />
                    {search && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-2.5 top-2.5 h-4 w-3 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <TagFilterDropdown
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                  />
                  {/* <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="_score">Relevance</option>
                  <option value="createdAt">Newest</option>
                  <option value="name">Name</option>
                </select> */}
                  <Button
                    onClick={() => fetchAssets()}
                    size={"sm"}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Apply
                  </Button>
                </div>
                <AssetDrawer
                  allSelectedAssets={table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original)}
                  isIcon={false}
                />
              </div>
            </div>
          </div>
        </header>
        <motion.div className="flex flex-col h-[calc(100vh-7.8rem)] space-y-1 transition-all">
          {/* Batch actions bar */}
          <motion.div
            initial={false}
            animate={{
              height: table.getSelectedRowModel().rows.length > 0 ? "auto" : 0,
              opacity: table.getSelectedRowModel().rows.length > 0 ? 1 : 0,
              marginBottom:
                table.getSelectedRowModel().rows.length > 0 ? 16 : 0,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-4  bg-muted dark:bg-blue-500/20 rounded-md py-1 mt-1">
              <div className="text-sm text-muted-foreground px-2">
                {table.getSelectedRowModel().rows.length} resource(s) selected
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </motion.div>

          {/* Table container */}
          <div className="flex-1 overflow-hidden relative">
            <motion.div
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="rounded border border-[#e7e3e4] dark:border-zinc-500 h-full flex flex-col"
            >
              {/* Header container with synchronized scroll */}
              <div className="sticky top-0 z-20 bg-background overflow-hidden ">
                <div
                  ref={headerScrollRef}
                  className="overflow-x-auto scrollbar-hide scrollable-hide-scrollbar"
                  style={{
                    width: "100%",
                    overflowY: "hidden",
                  }}
                  onScroll={handleHeaderScroll}
                >
                  <div style={{ minWidth: `${totalWidth}px` }}>
                    <Table style={{ width: `${totalWidth}px` }}>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <TableHead
                                key={header.id}
                                style={{
                                  width: header.getSize(),
                                  position: "relative",
                                }}
                                className="group bg-background"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                <div
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                  className={`
                                      absolute right-0 top-0 h-full w-1
                                      bg-border cursor-col-resize select-none touch-none
                                      hover:bg-primary hover:w-1.5 transition-transform
                                      ${
                                        header.column.getIsResizing()
                                          ? "bg-primary w-1.5"
                                          : ""
                                      }
                                    `}
                                />
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Body container with synchronized scroll */}
              <div
                ref={bodyScrollRef}
                className="flex-1 overflow-auto custom-scrollbar"
                onScroll={handleBodyScroll}
              >
                <motion.div
                  style={{ minWidth: `${totalWidth}px` }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Table style={{ width: `${totalWidth}px` }}>
                    <TableBody>
                      {isLoading ? (
                        [...Array(12)].map((_, idx) => (
                          <TableRow key={idx} className="animate-pulse">
                            {table.getAllColumns().map((col, colIndex) => (
                              <TableCell key={colIndex}>
                                <div className="md:h-6 h-4 w-full max-w-[150px] bg-gray-100/90 dark:bg-zinc-700 rounded animate-pulse" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length}>
                            <motion.div
                              className="flex flex-col items-center justify-center py-6 gap-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img
                                src="/no-data.png"
                                alt="No Data"
                                className="h-32 w-32 opacity-70"
                              />
                              <p className="text-sm text-muted-foreground">
                                No assets found
                              </p>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Fixed Pagination */}
          {table.getRowModel().rows.length > 0 ? (
            <div className="sticky bottom-0 z-20 bg-card border-t px-4 py-3 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {showingText()}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    ⬅️ Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      table.nextPage(), console.log("page 123");
                    }}
                    disabled={!table.getCanNextPage()}
                  >
                    Next ➡️
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssetsManagerTable;
