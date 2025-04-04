import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FolderTreeData } from "@/components/FolderTree"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const buildFolderTree = (flatData: FolderTreeData[]): FolderTreeData[] => {
  if (!flatData || !Array.isArray(flatData) || flatData.length === 0) {
    console.error("Invalid or empty data provided to buildFolderTree:", flatData);
    return [];
  }
  console.log("BEGIN",flatData)
  const lookup: Record<string, FolderTreeData> = {};
  const roots: FolderTreeData[] = [];

  // Build lookup map
  flatData.forEach((item) => {
    lookup[item.resourceId] = { ...item, children: [] };
  });

  // Link children to parents
  flatData.forEach((item) => {
    const parentId = item.parentResourceId;
    if (parentId && lookup[parentId]) {
      lookup[parentId].children!.push(lookup[item.resourceId]);
    } else {
      // Parent not found => root
      roots.push(lookup[item.resourceId]);
    }
  });
  console.log("last",roots);
  
  return roots;
};



