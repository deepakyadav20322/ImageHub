// import React, { useMemo } from "react";
// import { useNavigate, useParams } from "react-router";
// import { ChevronRight } from "lucide-react";
// import { FolderTreeData } from "./FolderTree";
// import { assert } from "console";

// interface BreadcrumbProps {
//   folders: FolderTreeData[];
// }


// const Breadcrumb = ({ folders }: BreadcrumbProps) => {
//   const { folderId } = useParams();
//   const navigate = useNavigate();
// console.log(folders,"folders crumb12121212")
//   const folderMap = useMemo(() => {
//     const map = new Map<string, FolderTreeData>();
//     folders.forEach(folder => map.set(folder.resourceId, folder));
//     return map;
//   }, [folders]);

//   const getBreadcrumbPath = (resourceId: string | undefined): FolderTreeData[] => {
//     const path: FolderTreeData[] = [];
//     let currentId = resourceId;
    
//     while (currentId) {
//       const folder = folderMap.get(currentId);
//       if (!folder) break;
      
//       path.unshift(folder);
//       currentId = folder.parentResourceId;
//     }
    
//     return path;
//   };

//   const breadcrumbPath = folderId ? getBreadcrumbPath(folderId) : [];

//   const handleBreadcrumbClick = (id: string) => {
//     navigate(`/dashboard/media/folders/${id}`);
//   };

//   if (breadcrumbPath.length === 0 && folderId) {
//     return (
//       <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded mb-2 w-full">
//         <span className="text-red-500">Invalid folder</span>
//       </div>
//     );
//   }

//   return (
//     <div 
//       className="flex items-center space-x-2 p-2 bg-gray-100 rounded mb-2 w-full"
//       aria-label="Breadcrumb"
//     >
//       <span 
//         className="text-blue-600 hover:underline cursor-pointer"
//         onClick={() => navigate('/dashboard/media/folders')}
//       >
//         Root
//       </span>
//       {breadcrumbPath.length > 0 && <ChevronRight size={16} />}
      
//       {breadcrumbPath.map((folder, index) => (
//         <React.Fragment key={folder.resourceId}>
//           <span
//             className={`text-blue-600 hover:underline cursor-pointer ${
//               index === breadcrumbPath.length - 1 ? "font-bold" : ""
//             }`}
//             onClick={() => handleBreadcrumbClick(folder.resourceId)}
//             aria-current={index === breadcrumbPath.length - 1 ? "page" : undefined}
//           >
//             {folder.displayName || folder.name}
//           </span>
//           {index < breadcrumbPath.length - 1 && <ChevronRight size={16} />}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// export default Breadcrumb;


import React, { useMemo } from "react";
import { FolderTreeData } from "./FolderTree";

type Props = {
  data: FolderTreeData[];
  currentFolderId: string;
  // onNavigate?: (folderId: string) => void;
};

const Breadcrumb: React.FC<Props> = ({ data, currentFolderId }) => {
  const findBreadcrumbPath = (nodes: FolderTreeData[], targetId: string): { name: string; resourceId: string }[] => {
    const path: { name: string; resourceId: string }[] = [];

    const dfs = (node: FolderTreeData, trail: { name: string; resourceId: string }[]): boolean => {
      const newTrail = [...trail, { name: node.displayName || node.name, resourceId: node.resourceId }];
      if (node.resourceId === targetId) {
        path.push(...newTrail);
        return true;
      }
      for (const child of node.children || []) {
        if (dfs(child, newTrail)) return true;
      }
      return false;
    };

    for (const root of nodes) {
      if (dfs(root, [])) break;
    }

    return path;
  };

  const breadcrumb = useMemo(() => findBreadcrumbPath(data, currentFolderId), [data, currentFolderId]);

  return (
    <div className="text-sm text-gray-800 space-x-2 p-2 bg-gray-100 rounded mb-2  dark:text-white flex items-center gap-1 w-full">
      {breadcrumb.map((item, idx) => (
        <div key={item.resourceId} className="flex items-center gap-1">
          <span className={` ${item.resourceId=== currentFolderId?'text-blue-400 dark:text-blue-600':""} hover:underline cursor-pointer`}>{item.name}</span>
          {idx < breadcrumb.length - 1 && (
            <span className="text-gray-500 dark:text-gray-400">{"->"}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
