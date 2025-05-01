// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { RootState } from '../store'; // Make sure to import your RootState type

// interface Resource {
//     id: string;
//     title: string;
//     url: string;
//     description?: string;
//     createdAt: string;
//     // Add more fields as needed
// }

// export const resourceApi = createApi({
//     reducerPath: 'resourceApi',
//     baseQuery: fetchBaseQuery({
//         baseUrl: 'http://localhost:3000/api',
//         prepareHeaders: (headers, { getState }) => {
//             // Get the token from the auth state
//             const token = (getState() as RootState).auth.token;

//             // If we have a token set in state, let's assume that we should be passing it
//             if (token) {
//                 headers.set('authorization', `Bearer ${token}`);
//             }

//             return headers;
//         },
//     }),
//     endpoints: (builder) => ({
//         getResources: builder.query<Resource[], void>({
//             query: () => '/resources',
//         }),
//         getResourceById: builder.query<Resource, string>({
//             query: (id) => `/resources/${id}`,
//         }),
//         createResource: builder.mutation<Resource, Partial<Resource>>({
//             query: (resource) => ({
//                 url: '/resources',
//                 method: 'POST',
//                 body: resource,
//             }),
//         }),
//         updateResource: builder.mutation<Resource, Partial<Resource> & { id: string }>({
//             query: ({ id, ...resource }) => ({
//                 url: `/resources/${id}`,
//                 method: 'PUT',
//                 body: resource,
//             }),
//         }),
//         deleteResource: builder.mutation<void, string>({
//             query: (id) => ({
//                 url: `/resources/${id}`,
//                 method: 'DELETE',
//             }),
//         }),
//     }),
// });

// export const {
//     useGetResourcesQuery,
//     useGetResourceByIdQuery,
//     useCreateResourceMutation,
//     useUpdateResourceMutation,
//     useDeleteResourceMutation,
// } = resourceApi;

import { authApi } from "./authApi"; // Import the base API
import { Resource } from "../../lib/types";

export const resourceApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getResourcesBucketByAccount: builder.query<
      Resource[],
      { accountId: string; access_token: string }
    >({
      query: ({ accountId, access_token }) => ({
        url: `/resource/get-all-environments/${accountId}`,
        headers: {
          Authorization: `${access_token}`, // Add custom header here
            'Content-Type':'application/json'
          
        },
      }),
      transformResponse: (response: { success: boolean; data: Resource[] }) => {
        return response.data; // This extracts just the data array
      },
      providesTags: ["Resources"],
    }),

    getResourceById: builder.query<Resource, string>({
      query: (resourceId) => `/resources/${resourceId}`,
      providesTags: ["Resources"],
    }),
 // use for creating bucket -=----------
    createResource: builder.mutation<Resource, Partial<Resource>>({
      query: (resource) => ({
        url: "/resources",
        method: "POST",
        body: resource,
        headers:{
          'Content-Type':'application/json'
        },
      }),
      invalidatesTags: ["Resources"],
    }),

    updateResource: builder.mutation<
      Resource,
      Partial<Resource> & { id: string }
    >({
      query: ({ id, ...resource }) => ({
        url: `/resources/${id}`,
        method: "PUT",
        body: resource,
        headers:{
          'Content-Type':'application/json'
        },
      }),
      invalidatesTags: ["Resources"],
    }),

    deleteResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Resources"],
    }),
  }),
  overrideExisting: false, // Ensures we don't overwrite existing endpoints
});

export const {
  useGetResourcesBucketByAccountQuery,
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourceApi;
