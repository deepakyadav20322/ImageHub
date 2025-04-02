import { useGetFoldersQuery } from "@/redux/apiSlice/itemsApi";
import { setFoldersDataWithParent } from "@/redux/features/itemsSlice";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import AssetManager from "@/components/AssetsManager";
import { buildFolderTree } from "@/lib/utils";

const Folders = () => {
    const { activeBucket } = useSelector((state: RootState) => state.resource);
  const { folderId } = useParams(); // Get folderId from URL
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  console.log(folderId);
  const { data, error, isLoading } = useGetFoldersQuery({
    folderId: folderId || "",
    token: token || "",
  });
  console.log(data);
  // 🟢 Store Data in Redux
  useEffect(() => {
    if (data) {
      dispatch(setFoldersDataWithParent(data));
    }
  }, [data, dispatch]);

  // 🟢 Get Data from Redux
  const folderData = useSelector((state: RootState) => state.items.folders);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {`folder page`} </div>;

  return (
    <div>
      {/* This is folder page and current working bucket : " " {activeBucket} */}
      {/* <div className="border-2 p-4">{JSON.stringify(folderData)}</div> */}
      {/* <FolderTree folders={folderData} /> */}
      {/* <AssetsOfFolder folderId={folderId || ''}/> */}
      <div className="my-11">
      <AssetManager folders={buildFolderTree(folderData)} />
      </div>

    </div>
  );
};

export default Folders;

// const datas = [
//   {
//     "resourceId": "1a2b3c4d-1111-2222-3333-444455556666",
//     "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//     "parentResourceId": null,
//     "type": "folder",
//     "name": "Home",
//     "displayName": null,
//     "path": "/original/Home",
//     "visibility": "private",
//     "inheritPermissions": true,
//     "overridePermissions": false,
//     "metadata": {},
//     "resourceTypeDetails": {},
//     "versionId": null,
//     "expiresAt": null,
//     "status": "active",
//     "createdAt": "2025-03-31T08:32:35.105Z",
//     "updatedAt": "2025-03-31T08:32:35.105Z",
//     "deletedAt": null,
//     "children": [
//       {
//         "resourceId": "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
//         "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//         "parentResourceId": "1a2b3c4d-1111-2222-3333-444455556666",
//         "type": "folder",
//         "name": "Images",
//         "displayName": null,
//         "path": "/original/Home/Images",
//         "visibility": "private",
//         "inheritPermissions": true,
//         "overridePermissions": false,
//         "metadata": {},
//         "resourceTypeDetails": {},
//         "versionId": null,
//         "expiresAt": null,
//         "status": "active",
//         "createdAt": "2025-03-31T08:32:35.105Z",
//         "updatedAt": "2025-03-31T08:32:35.105Z",
//         "deletedAt": null,
//         "children": [
//           {
//             "resourceId": "7f8e9d1c-3333-4444-5555-666677778888",
//             "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//             "parentResourceId": "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
//             "type": "folder",
//             "name": "Vacation",
//             "displayName": null,
//             "path": "/original/Home/Images/Vacation",
//             "visibility": "private",
//             "inheritPermissions": true,
//             "overridePermissions": false,
//             "metadata": {},
//             "resourceTypeDetails": {},
//             "versionId": null,
//             "expiresAt": null,
//             "status": "active",
//             "createdAt": "2025-03-31T08:32:35.105Z",
//             "updatedAt": "2025-03-31T08:32:35.105Z",
//             "deletedAt": null,
//             "children":[
//               {
//                 "resourceId": "2e79bc82-656434-43a6-bd3e-6e7046e1d562",
//                 "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//                 "parentResourceId": "1a2b3c4d-1111-2222-3333-444455556666",
//                 "type": "folder",
//                 "name": "Images",
//                 "displayName": null,
//                 "path": "/original/Home/Images",
//                 "visibility": "private",
//                 "inheritPermissions": true,
//                 "overridePermissions": false,
//                 "metadata": {},
//                 "resourceTypeDetails": {},
//                 "versionId": null,
//                 "expiresAt": null,
//                 "status": "active",
//                 "createdAt": "2025-03-31T08:32:35.105Z",
//                 "updatedAt": "2025-03-31T08:32:35.105Z",
//                 "deletedAt": null,
//                 "children": [
//                   {
//                     "resourceId": "7f8e9d1c-3333-449944-5555-666677778888",
//                     "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//                     "parentResourceId": "2e79bc82-6434-43a6-bd3e-6e7046e1d562",
//                     "type": "folder",
//                     "name": "Vacation",
//                     "displayName": null,
//                     "path": "/original/Home/Images/Vacation",
//                     "visibility": "private",
//                     "inheritPermissions": true,
//                     "overridePermissions": false,
//                     "metadata": {},
//                     "resourceTypeDetails": {},
//                     "versionId": null,
//                     "expiresAt": null,
//                     "status": "active",
//                     "createdAt": "2025-03-31T08:32:35.105Z",
//                     "updatedAt": "2025-03-31T08:32:35.105Z",
//                     "deletedAt": null
//                   }
//                 ]
//               },
//             ]
//           }
//         ]
//       },
//       {
//         "resourceId": "9b0c1d2e-5555-6666-7777-88889999aaaa",
//         "accountId": "06d5fb0f-6d5d-4427-8caf-fc767d09497f",
//         "parentResourceId": "1a2b3c4d-1111-2222-3333-444455556666",
//         "type": "folder",
//         "name": "Documents",
//         "displayName": null,
//         "path": "/original/Home/Documents",
//         "visibility": "private",
//         "inheritPermissions": true,
//         "overridePermissions": false,
//         "metadata": {},
//         "resourceTypeDetails": {},
//         "versionId": null,
//         "expiresAt": null,
//         "status": "active",
//         "createdAt": "2025-03-31T08:32:35.105Z",
//         "updatedAt": "2025-03-31T08:32:35.105Z",
//         "deletedAt": null
//       }
//     ]
//   }
// ]
