import authApi from "./authApi";

const collectionApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCollections: builder.query({
            query: ({token}) => ({url:'/collection/get-all-collection',
                method:"GET",
                headers:{
                    Authorization:token,
                    'Content-Type':'application/json'
                }
                

            }),
            
            providesTags: ['Collection'],
        }),
        getCollection: builder.query({
            query: (id) => `/collections/${id}`,
            providesTags: ['Collection'],
        }),
        createCollection: builder.mutation({
            query: (body) => ({
                url: '/collections',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Collection'],
        }),
        updateCollection: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/collections/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Collection'],
        }),
        deleteCollection: builder.mutation({
            query: (id) => ({
                url: `/collections/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Collection'],
        }),
    }),
})

export const {
    useGetAllCollectionsQuery,
    useGetCollectionQuery,
    useCreateCollectionMutation,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
} = collectionApi