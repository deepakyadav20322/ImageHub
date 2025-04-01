import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FolderTreeData } from "@/components/FolderTree"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// export const buildFolderTree = (flatData: FolderTreeData[] ): FolderTreeData[] => {
//   const idToNodeMap: { [key: string]: FolderTreeData } = {};
//   const tree: FolderTreeData[] = [];

//   flatData.forEach(item => {
//     idToNodeMap[item.resourceId] = {
//       ...item,
//       overridePermissions: item.overridePermissions ?? false, // Set default
//       children: [],
//     };
//   });

//   flatData.forEach(item => {
//     if (item.parentResourceId) {
//       const parent = idToNodeMap[item.parentResourceId];
//       if (parent) {
//         parent.children?.push(idToNodeMap[item.resourceId]);
//       }
//     } else {
//       tree.push(idToNodeMap[item.resourceId]);
//     }
//   });

//   return tree;
// }

export const buildFolderTree = (flatData: FolderTreeData[]): FolderTreeData[] => {
  const idToNodeMap: Record<string, FolderTreeData> = {};
  const tree: FolderTreeData[] = [];

  // Step 1: Initialize Nodes
  flatData.forEach(item => {
    idToNodeMap[item.resourceId] = {
      ...item,
      overridePermissions: item.overridePermissions ?? false,
      children: [],
    };
  });

  // Step 2: Build Tree
  flatData.forEach(item => {
    if (item.parentResourceId) {
      const parent = idToNodeMap[item.parentResourceId];
      if (parent && parent.children) {
        parent.children.push(idToNodeMap[item.resourceId]);
      } else {
        console.warn(`Parent not found for: ${item.resourceId}. Treating as top-level.`);
        tree.push(idToNodeMap[item.resourceId]); // Consider as top-level
      }
    } else {
      tree.push(idToNodeMap[item.resourceId]); // Root level folder
    }
  });

  return tree;
};
