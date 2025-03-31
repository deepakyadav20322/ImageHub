

import { Resource } from "@/lib/types";
import authApi from "./authApi"; 
import { useSelector } from "react-redux";
import { RootState } from "../store";

const folderApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFolders: builder.query({
      query: ({ folderId, token }: { folderId: string|''; token: string|'' }) => ({
        url: `/resource/folders/${folderId}`,
        method: 'GET',
        headers:{
          Authorization:`${token}`
        }
      }),
      transformResponse:(response: { success: boolean; data:Resource[] }) => {
              return response.data;
      },
      providesTags: (result, error, arg) => [{ type: 'Folder', id: arg.folderId }],
    }),
    
    getSubfolders: builder.query({
      query: (folderId) => ({
        url: `/resource/folders/subfolders?folderId=${folderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, folderId) => [{ type: 'Folder', id: folderId }],
    }),
    getAssets: builder.query({
      query: (folderId) => ({
        url: `/resource/folders/${folderId}/assets`,
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
