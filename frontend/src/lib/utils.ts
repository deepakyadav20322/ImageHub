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



// utils/getDaysLeft.ts-----------------------------
export function getDaysLeft(expiryDateString: string): number {
  const now = new Date();
  const expiryDate = new Date(expiryDateString);

  // Get the difference in milliseconds and convert to full days
  const diffInMs = expiryDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}
