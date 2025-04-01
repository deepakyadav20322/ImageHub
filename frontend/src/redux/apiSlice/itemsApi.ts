import { Resource } from "@/lib/types";
import authApi from "./authApi";
const folderApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFolders: builder.query<Resource[], { folderId: string; token: string }>({
      query: ({ folderId, token }) => ({
        url: `/resource/folders/${folderId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

    getAssetsOfFolder: builder.query< Resource[], { folderId: string; token: string }>({
      query: ({ folderId, token }) => ({
        url: `/resource/folders/${folderId}/assets`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: { success: boolean; data: Resource[] }) =>
        response.data,
      providesTags: (result, error, arg) => [
        { type: "Asset", id: arg.folderId },
      ],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useGetSubfoldersQuery,
  useGetAssetsOfFolderQuery,
} = folderApi;

export default folderApi;
