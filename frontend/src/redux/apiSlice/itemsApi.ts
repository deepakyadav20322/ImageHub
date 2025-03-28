
import authApi from "./authApi"; // Assuming this handles authentication

const folderApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFolders: builder.query({
      query: (folderId) => ({
        url: `folders/${folderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, folderId) => [{ type: 'Folder', id: folderId }],
    }),
    getSubfolders: builder.query({
      query: (folderId) => ({
        url: `folders/subfolders?folderId=${folderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, folderId) => [{ type: 'Folder', id: folderId }],
    }),
    getAssets: builder.query({
      query: (folderId) => ({
        url: `folders/${folderId}/assets`,
        method: 'GET',
      }),
      providesTags: (result, error, folderId) => [{ type: 'Asset', id: folderId }],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useGetSubfoldersQuery,
  useGetAssetsQuery,
} = folderApi;

export default folderApi;
