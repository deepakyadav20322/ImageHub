// const arr = [
//     {
//       resourceId: "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
//       accountId: "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//       parentResourceId: "22c87dcd-f1d8-4bcd-8111-45f8d88fee3b",
//       type: "folder",
//       name: "default",
//       displayName: "Default Folder",
//       path: "/original/default",
//       visibility: "private",
//       inheritPermissions: true,
//       overridePermissions: false,
//       metadata: {},
//       resourceTypeDetails: {},
//       versionId: null,
//       expiresAt: null,
//       status: "active",
//       createdAt: "2025-03-31T08:32:35.105Z",
//       updatedAt: "2025-03-31T08:32:35.105Z",
//       deletedAt: null,
//     },
//     {
//       resourceId: "9a42d441-70ef-49ab-a06a-b5aedc9e89b2",
//       accountId: "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//       parentResourceId: "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
//       type: "folder",
//       name: "defaultNew3",
//       displayName: "Default New 3",
//       path: "/original/default/defaultNew3",
//       visibility: "private",
//       inheritPermissions: true,
//       overridePermissions: false,
//       metadata: null,
//       resourceTypeDetails: {},
//       versionId: null,
//       expiresAt: null,
//       status: "active",
//       createdAt: "2025-04-03T10:28:24.860Z",
//       updatedAt: "2025-04-03T10:28:24.860Z",
//       deletedAt: null,
//     },
//     {
//       resourceId: "abc511a7-84a5-4c29-b177-b9a3dc007653",
//       accountId: "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//       parentResourceId: "9a42d441-70ef-49ab-a06a-b5aedc9e89b2",
//       type: "folder",
//       name: "Hanuman kind",
//       displayName: "Hanuman kind",
//       path: "/original/default/defaultNew3/Hanuman kind",
//       visibility: "private",
//       inheritPermissions: true,
//       overridePermissions: false,
//       metadata: null,
//       resourceTypeDetails: null,
//       versionId: null,
//       expiresAt: null,
//       status: "active",
//       createdAt: "2025-04-04T08:20:33.517Z",
//       updatedAt: "2025-04-04T08:20:33.517Z",
//       deletedAt: null,
//     },
//     {
//       resourceId: "24d75d5b-2b6b-4712-bbae-1ac35bfbd8e1",
//       accountId: "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//       parentResourceId: "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
//       type: "folder",
//       name: "newFolder",
//       displayName: "New Folder",
//       path: "/original/default/newFolder",
//       visibility: "private",
//       inheritPermissions: true,
//       overridePermissions: false,
//       metadata: null,
//       resourceTypeDetails: {},
//       versionId: null,
//       expiresAt: null,
//       status: "active",
//       createdAt: "2025-04-02T05:33:28.008Z",
//       updatedAt: "2025-04-02T05:33:28.008Z",
//       deletedAt: null,
//     },
//   ];
  
//   function buildFolderTree(flatData) {
//     if (!flatData || !Array.isArray(flatData) || flatData.length === 0) {
//       console.error("Invalid or empty data provided to buildFolderTree:", flatData);
//       return [];
//     }
  
//     console.log("BEGIN", flatData);
//     const lookup = {};
//     const roots = [];
  
//     // Build lookup
//     flatData.forEach((item) => {
//       lookup[item.resourceId] = { ...item, children: [] };
//     });
  
//     // Link children
//     flatData.forEach((item) => {
//       const parentId = item.parentResourceId;
//       if (parentId && lookup[parentId]) {
//         lookup[parentId].children.push(lookup[item.resourceId]);
//       } else {
//         roots.push(lookup[item.resourceId]);
//       }
//     });
  
//     console.log("LAST", JSON.stringify(roots, null, 2));
//     return roots;
//   }
  
//   buildFolderTree(arr);
  
let tree = [{
  "resourceId": "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
  "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
  "parentResourceId": "22c87dcd-f1d8-4bcd-8111-45f8d88fee3b",
  "type": "folder",
  "name": "default",
  "displayName": "Default Folder",
  "path": "/original/default",
  "visibility": "private",
  "inheritPermissions": true,
  "overridePermissions": false,
  "metadata": {},
  "resourceTypeDetails": {},
  "versionId": null,
  "expiresAt": null,
  "status": "active",
  "createdAt": "2025-03-31T08:32:35.105Z",
  "updatedAt": "2025-03-31T08:32:35.105Z",
  "deletedAt": null,
  "children": [
      {
          "resourceId": "9a42d441-70ef-49ab-a06a-b5aedc9e89b2",
          "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
          "parentResourceId": "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
          "type": "folder",
          "name": "defaultNew3",
          "displayName": "Default New 3",
          "path": "/original/default/defaultNew3",
          "visibility": "private",
          "inheritPermissions": true,
          "overridePermissions": false,
          "metadata": null,
          "resourceTypeDetails": {},
          "versionId": null,
          "expiresAt": null,
          "status": "active",
          "createdAt": "2025-04-03T10:28:24.860Z",
          "updatedAt": "2025-04-03T10:28:24.860Z",
          "deletedAt": null,
          "children": [
              {
                  "resourceId": "abc511a7-84a5-4c29-b177-b9a3dc007653",
                  "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
                  "parentResourceId": "9a42d441-70ef-49ab-a06a-b5aedc9e89b2",
                  "type": "folder",
                  "name": "Hanuman kind",
                  "displayName": "Hanuman kind",
                  "path": "/original/default/defaultNew3/Hanuman kind",
                  "visibility": "private",
                  "inheritPermissions": true,
                  "overridePermissions": false,
                  "metadata": null,
                  "resourceTypeDetails": null,
                  "versionId": null,
                  "expiresAt": null,
                  "status": "active",
                  "createdAt": "2025-04-04T08:20:33.517Z",
                  "updatedAt": "2025-04-04T08:20:33.517Z",
                  "deletedAt": null,
                  "children": []
              }
          ]
      },
      {
          "resourceId": "24d75d5b-2b6b-4712-bbae-1ac35bfbd8e1",
          "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
          "parentResourceId": "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
          "type": "folder",
          "name": "newFolder",
          "displayName": "New Folder",
          "path": "/original/default/newFolder",
          "visibility": "private",
          "inheritPermissions": true,
          "overridePermissions": false,
          "metadata": null,
          "resourceTypeDetails": {},
          "versionId": null,
          "expiresAt": null,
          "status": "active",
          "createdAt": "2025-04-02T05:33:28.008Z",
          "updatedAt": "2025-04-02T05:33:28.008Z",
          "deletedAt": null,
          "children": []
      }
  ]
}
]


const findBreadcrumbPath = (tree, currentFolderId) => {
  const path = [];

  const dfs = (node, trail) => {
    const newTrail = [...trail, { name: node.displayName || node.name, resourceId: node.resourceId }];

    if (node.resourceId === currentFolderId) {
      path.push(...newTrail);
      return true;
    }

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (dfs(child, newTrail)) return true;
      }
    }

    return false;
  };

  for (const root of tree) {
    if (dfs(root, [])) break;
  }

  return path;
};
const breadcrumb = findBreadcrumbPath(tree, "abc511a7-84a5-4c29-b177-b9a3dc007653");
console.log("Breadcrumb:", breadcrumb);

