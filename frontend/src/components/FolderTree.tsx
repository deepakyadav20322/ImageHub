import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
} from "lucide-react";

export interface FolderTreeData {
  resourceId: string;
  accountId: string;
  parentResourceId: string;
  type: string;
  name: string;
  displayName?: string;
  path: string;
  visibility: string;
  inheritPermissions: boolean;
  overridePermissions: boolean;
  children?: FolderTreeData[];
  // Other properties from your data
  metadata?: Record<string, unknown>;
  resourceTypeDetails?: Record<string, unknown>;
  versionId?: string;
  expiresAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface FolderTreeProps {
  folders: FolderTreeData[]; // Changed from 'resources' to 'folders'(parent child structure ) to match your usage
}

const FolderTree = ({ folders }: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  console.log("folders", folders);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const renderResources = (items: FolderTreeData[], level = 0) => {
    return items.map((item) => (
      <div key={item.resourceId} className="w-full">
        <div
          className={`flex items-center py-1 hover:bg-gray-100 rounded ${
            item.type === "file" ? "pl-8" : ""
          }`}
          style={{
            paddingLeft: `${level * 16 + (item.type === "folder" ? 8 : 24)}px`,
          }}
        >
          {item.type === "folder" && item.children && (
            <button
              onClick={() => toggleFolder(item.resourceId)}
              className="mr-1 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {expandedFolders[item.resourceId] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}

          {item.type === "folder" ? (
            expandedFolders[item.resourceId] ? (
              <FolderOpen size={18} className="mr-2 text-blue-500" />
            ) : (
              <Folder size={18} className="mr-2 text-blue-500" />
            )
          ) : (
            <File size={18} className="mr-2 text-gray-400" />
          )}

          <span className="text-sm">{item.displayName || item.name}</span>
        </div>

        {item.type === "folder" &&
          item.children &&
          expandedFolders[item.resourceId] && (
            <div className="w-full">
              {renderResources(item.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };

  return (
    <div className="p-4 border-r h-full overflow-y-auto w-56 bg-white">
      {renderResources(folders)}
    </div>
  );
};

export default FolderTree;
