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



 

export function formatBytesToMbAndGb(
  bytesStr: string,
  options: {
    precision?: number; // Decimal places (default: 1)
    forceGB?: boolean;  // Force GB display even for small values
  } = {}
): string {
  const { precision = 1, forceGB = false } = options;
  const bytes = parseFloat(bytesStr);
  
  if (isNaN(bytes)) return "0MB";

  const MB = 1024 * 1024;
  const GB = 1024 * MB;

  if (forceGB || bytes >= GB) {
    const gbValue = bytes / GB;
    return gbValue % 1 === 0 
      ? `${gbValue}GB` 
      : `${gbValue.toFixed(precision)}GB`;
  }

  const mbValue = bytes / MB;
  return mbValue % 1 === 0
    ? `${mbValue}MB`
    : `${mbValue.toFixed(precision)}MB`;
}