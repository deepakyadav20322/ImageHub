import { Resource } from "@/lib/types";
import authApi from "./authApi";
import { boolean } from "zod";
const folderApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFolders: builder.query<Resource[], { folderId: string; token: string }>({
      query: ({ folderId, token }) => ({
        url: `/resource/folders/${folderId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type':'application/json'
        },
      }),
      transformResponse: (response: { success: boolean; data: Resource[] }) =>
        response.data,
      providesTags: (result, error, arg) => [
        { type: "Folder", id: arg.folderId },
      ],
    }),

    getSubfolders: builder.query<Resource[], string>({
      query: (folderId) => ({
        url: `/resource/folders/subfolders?folderId=${folderId}`,
        method: "GET",
      }),
      providesTags: (result, error, folderId) => [
        { type: "Folder", id: folderId },
      ],
    }),

    getAssetsOfFolder: builder.query<
      Resource[],
      { folderId: string; token: string }
    >({
      query: ({ folderId, token }) => ({
        url: `/resource/folders/${folderId}/assets`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        keepUnusedDataFor: 0,
      }),
      transformResponse: (response: { success: boolean; data: Resource[] }) =>
        response.data,
      providesTags: (result, error, arg) => [
        { type: "Asset", id: arg.folderId },
      ],
    }),

    createNewFolder: builder.mutation<
      Resource,
      {
        parentFolderId: string;
        folderName: string;
        visibility: string;
        token: string;
      }
    >({
      query: ({
        parentFolderId,
        folderName,
        visibility = "private",
        token,
      }) => ({
        url: `/resource/folders/create-folder`,
        method: "POST",
        body: {
          parentFolderId,
          folderName,
          visibility,
        },
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type':'application/json'
        },
      
      }),
      
      transformResponse: (response: { success: boolean; data: Resource }) =>
        response.data,
      invalidatesTags: (result, error, arg) => [
        { type: "Folder", id: arg.parentFolderId },
      ],
    }),
    getRootFolderOfBucket: builder.query<
      Resource,
      { bucketId: string; token: string }
    >({
      query: ({ bucketId, token }) => ({
        url: `/resource/folders/root-folder/${bucketId}`,
        method: "GET",
        headers: {
          Authorization: token,
            'Content-Type':'application/json'
        },
      }),
      transformResponse: (response: { success: boolean; data: Resource }) =>
        response.data,
    }),
    deleteFolder: builder.mutation<
      Resource,
      { bucketId: string; folderId: string; token: string }
    >({
      query: ({ bucketId, folderId, token }) => ({
        url: `/resource/folders/delete-folder/${bucketId}/${folderId}`,
        method: "DELETE",
        headers: {
          Authorization: token,
      
            'Content-Type':'application/json'
      
        },
      }),

    }),
    uploadAssets: builder.mutation<
      Resource[],
      { bucketName: string; resourceType: string; files: FormData; token: string,folderId:string }
    >({
      query: ({ bucketName, resourceType, files, token,folderId }) => {
        

      return  {
        url: `/resource/${bucketName}/${resourceType}/upload?folderId=${folderId}`,
        method: 'POST',
        body: files,
        headers: {
          Authorization: `Bearer ${token}`,
          'x-folder-id': folderId,
      
        }
      }
      },
      transformResponse: (response: { success: boolean; data: Resource[] }) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: "Asset", id: arg.folderId },
      ]
    })

  }),
});

export const {
  useUploadAssetsMutation,
  useCreateNewFolderMutation,
  useGetFoldersQuery,
  useGetSubfoldersQuery,
  useGetAssetsOfFolderQuery,
  useGetRootFolderOfBucketQuery,
  useDeleteFolderMutation,

} = folderApi;

export default folderApi;
