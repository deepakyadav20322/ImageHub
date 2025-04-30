import { Resource } from "@/lib/types";
import authApi from "./authApi";
import { boolean } from "zod";
import { url } from "inspector";


const folderApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFolders: builder.query<Resource[], { folderId: string; token: string }>({
      query: ({ folderId, token }) => ({
        url: `/resource/folders/${folderId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
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
          'Content-Type': 'application/json'
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }),
    }),

    uploadAssets: builder.mutation<
      Resource[],
      { bucketName: string; resourceType: string; files: FormData; token: string; folderId: string }
    >({
      query: ({ bucketName, resourceType='image', files, token, folderId }) => ({
        url: `/resource/${bucketName}/${resourceType}/upload?folderId=${folderId}`,
        method: 'POST',
        body: files,
        headers: {
          Authorization: `Bearer ${token}`,
          'x-folder-id': folderId,
         
        }
      }),
      transformResponse: (response: { success: boolean; data: Resource[] }) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: "Asset", id: arg.folderId },
        { type: "AllAssets", id:arg.folderId }, // ✅ This will refresh account-level assets of the bucket
      ],
     
    }),

    deleteAssetOfFolder: builder.mutation<
      Resource,
      { bucketId: string; folderId: string; assetId: string; token: string }
    >({
      query: ({ bucketId, folderId, assetId, token }) => ({
        url: `/resource/folder/delete-asset/${bucketId}/${folderId}/${assetId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Asset", id: arg.assetId },
      ]
    }),

    getAllAssetsOfParticularAccount: builder.query<
      Resource[],
      { accountId: string; token: string; bucketId: string,search?:string,tags?:string[],sort_by?:string }
    >({
      query: ({ accountId, token, bucketId ,search,tags,sort_by}) => ({
        url: `/resource/${bucketId}/${accountId}/getAll-assets?search=${search}&sort_by=${sort_by}&tags=${tags?.join(',')}`,

        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: { success: boolean; data: Resource[] }) => response.data,
      providesTags: (result, error, { bucketId }) => [
        { type: "AllAssets", id: bucketId },
      ],
    }),

    addTagsToAccount: builder.mutation<
    { success: boolean; message: string },
    {accountId:string ,bucketId:string, resourceId: string; token: string; tags: string[] }
  >({
    query: ({accountId,bucketId, resourceId, token, tags }) => ({
      url: `resource/${bucketId}/addtags/${resourceId}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { tags },
    }),
    // Optimistic update to append tags to the existing list of tags in the Redux state
    // onQueryStarted: async ({ accountId, tags }, { dispatch, queryFulfilled }) => {
    //   try {
    //     // If the request is successful, update the tags cache
    //     const { data } = await queryFulfilled;
    //     dispatch(
    //       folderApi.util.updateQueryData('getAllTagsOfAccount', { accountId, token: '' }, (draft) => {
    //         draft.push(...tags);
    //       })
    //     );
    //   } catch (err) {
    //     console.error('Error adding tags:', err);
    //   }
    // },
    invalidatesTags: (result, error, { accountId }) => [{ type: 'Tags', id: accountId }],
  }),

  getAllTagsOfAccount: builder.query<
  { success: boolean; data: string[] }, // Assuming tags are just strings
  { bucketId:string,accountId: string; token: string }
>({
  query: ({bucketId, accountId, token }) => ({
    url: `resource/${bucketId}/getAllTags`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  transformResponse: (response: { success: boolean; data: string[] }) => ({ success: response.success, data: response.data }),
  providesTags: (result, error, { accountId }) => [
    { type: 'Tags', id: accountId },
  ],
}),

createApiKey: builder.mutation<
  { success: boolean; data: any },
  { token: string; name: string }
>({
  query: ({ token, name }) => ({
    url: `/resource/create-apiKey`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: { apiName:name }
  }),
  transformResponse: (response: { success: boolean; data: any }) => response
}),

deleteApiKey: builder.mutation<
  { success: boolean,message:string },
  {  keyId: string; token: string }
>({
  query: ({ keyId, token }) => ({
    url: `/resource/delete-apiKey/${keyId}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}),

getAllApiKeys: builder.query<
{ success: boolean; data: any[] },
{ token: string }
>({
query: ({ token }) => ({
  url: `/resource/get-apiKey`,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}),
transformResponse: (response: { success: boolean; data: any[] }) => response
}),

updateApiKeyName: builder.mutation<
  {
      message?: string; success: boolean; data: any 
},
  { keyId: string; token: string; name: string }
>({
  query: ({ keyId, token, name }) => ({
    url: `/resource/update-apiKey/${keyId}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: { apiName: name }
  }),
  transformResponse: (response: { success: boolean; data: any }) => response,
 
}),

toggleApiKeyStatus: builder.mutation<
  { success: boolean; message: string },
  { keyId: string; token: string }
>({
  query: ({ keyId, token }) => ({
    url: `/resource/toggle-apiKeys/${keyId}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }),

}),

  })
});

export const {
  useUpdateApiKeyNameMutation,
  useToggleApiKeyStatusMutation,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useGetAllApiKeysQuery,
  useAddTagsToAccountMutation,
  useGetAllTagsOfAccountQuery,
  useLazyGetAllAssetsOfParticularAccountQuery,
  useDeleteAssetOfFolderMutation,
  useUploadAssetsMutation,
  useCreateNewFolderMutation,
  useGetFoldersQuery,
  useGetSubfoldersQuery,
  useGetAssetsOfFolderQuery,
  useGetRootFolderOfBucketQuery,
  useDeleteFolderMutation,
  useGetAllAssetsOfParticularAccountQuery
} = folderApi;

export default folderApi;
