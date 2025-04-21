import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useGetAllAssetsOfParticularAccountQuery, useGetAllTagsOfAccountQuery } from "@/redux/apiSlice/itemsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function TagFilterDropdown({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;

}) {
  const [filter, setFilter] = useState("");

  // 🟢 Fetch tag data from API
  const {user,token} = useSelector((state:RootState)=>state.auth);
  const {activeBucket} = useSelector((state:RootState)=>state.resource)
  
  
  const { data: tagsData, isLoading }= useGetAllTagsOfAccountQuery({accountId:user?.accountId ??'',token:token||'',bucketId:activeBucket});

  // const {refetch:refetchAssets} = useGetAllAssetsOfParticularAccountQuery({
  //   accountId:user?.accountId,
  //   token:token || '',
  //   bucketId:activeBucket,
  //   // no tags param means return all assets
  // })

  // 🟢 Extract tagName from response
  const availableTags: string[] = useMemo(() => {
    return tagsData?.data?.map((tag: any) => tag.tagName) || [];
  }, [tagsData]);
  // 🔍 Filter logic
  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    

    
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
  

  };

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size={'sm'} className="flex items-center gap-2 hover:border-blue-500 border-[1px] cursor-pointer">
            Tags
            {selectedTags.length > 0 && (
              <span className="bg-amber-600 text-yellow-100 rounded-full text-xs min-w-[20px] h-[20px] flex items-center justify-center px-1 pb-[1px]">
                {selectedTags.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-2 space-y-2">
          <Input
            placeholder="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full"
          />

          <ScrollArea className="h-40">
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-sm text-muted-foreground px-2 py-1">Loading...</div>
              ) : filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <button
                    key={tag}
                    className={`px-2 py-1 rounded w-full text-left cursor-pointer ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground px-2 py-1">No tags found.</div>
              )}
            </div>
          </ScrollArea>

          <div className="text-xs text-muted-foreground mt-2">Selected Tags</div>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-[#101928] border border-blue-500 text-blue-400 rounded-full px-3 py-1 flex items-center gap-1"
              >
                <span>{tag}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
