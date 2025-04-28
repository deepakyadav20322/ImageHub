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
  Search,
  X,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  useLazyGetAllAssetsOfParticularAccountQuery,
} from "@/redux/apiSlice/itemsApi";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Resource } from "@/lib/types";
import AssetDrawer from "@/components/AssetsInfoDrawer";
import { Input } from "@/components/ui/input";
import { TagFilterDropdown } from "@/components/TagFilterDropdown";
import { getColumns } from "./GetColumnOfAllAssets";

type ViewMode = "list" | "card";

const AssetsManagerTable = () => {
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 14,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { activeBucket } = useSelector((state: RootState) => state.resource);
  const [sorting, setSorting] = useState([
    { id: "createdAt", desc: true },
  ]);

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("_score");

  const [allAssets, setAllAssets] = useState<Resource[]>([]);
  const singleScrollContainerRef = useRef<HTMLDivElement>(null);
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  
  // Track column resizing
  const [columnSizing, setColumnSizing] = useState({});
  const [tableWidth, setTableWidth] = useState(0);

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
      pagination,
      sorting,
      columnSizing,
    },
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Calculate total table width based on column sizing
  useEffect(() => {
    const width = table.getTotalSize();
    setTableWidth(width);
  }, [columnSizing, table]);

  return (
    <div className="mt-14 p-2 py-1">
      <AnimatePresence>
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 bg-gray-100 rounded p-1 dark:bg-zinc-900 dark:text-white mb-1">
              <div className="flex items-center justify-between w-full">
                <div className="flex px-2 items-center gap-4 w-full ps-2">
                  <div className="relative dark:bg-black dark:text-white bg-white text-black">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoComplete="off"
                      className="border px-2 py-1 w-72 pl-9 pr-9 border-gray-400 rounded-md"
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
                  <Button
                    onClick={() => fetchAssets()}
                    size="sm"
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
              marginBottom: table.getSelectedRowModel().rows.length > 0 ? 16 : 0,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-4 bg-muted dark:bg-blue-500/20 rounded-md py-1 mt-1">
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

          {/* Single scrollable table container */}
          <div className="flex-1 overflow-hidden relative rounded border border-[#e7e3e4] dark:border-zinc-500">
            <div 
              ref={singleScrollContainerRef} 
              className="h-full overflow-auto custom-scrollbar"
            >
              <Table style={{ width: tableWidth > 0 ? `${tableWidth}px` : "100%" }}>
                {/* Fixed table header */}
                <TableHeader className="sticky top-0 z-10 bg-background">
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
                          {header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={`
                                absolute right-0 top-0 h-full w-1
                                bg-border cursor-col-resize select-none touch-none
                                hover:bg-primary hover:w-1.5 transition-colors
                                ${
                                  header.column.getIsResizing()
                                    ? "bg-primary w-1.5"
                                    : ""
                                }
                              `}
                            />
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                
                {/* Table body in the same container */}
                <TableBody>
                  {isLoading ? (
                    [...Array(12)].map((_, idx) => (
                      <TableRow key={idx} className="animate-pulse">
                        {table.getAllColumns().map((col, colIndex) => (
                          <TableCell 
                            key={colIndex}
                            style={{ width: col.getSize() }}
                          >
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
                          <TableCell 
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                          >
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
            </div>
          </div>

          {/* Fixed Pagination */}
          {table.getRowModel().rows.length > 0 && (
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
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next ➡️
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssetsManagerTable;