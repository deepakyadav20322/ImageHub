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
    
        createCollection: builder.mutation({
            query: ({name,token}) => ({
                url: '/collection/create-collection',
                method: 'POST',
                body:{name},
                headers:{
                   Authorization:token,
                    'Content-Type':'application/json',
                }
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
            query: ({collectionId,token}) => ({
                url: `/collection/delete-collection/${collectionId}`,
                method: 'DELETE',
                headers:{
                    Authorization:token,
                }
            }),
            invalidatesTags: ['Collection'],
        }),
    }),
})

export const {
    useGetAllCollectionsQuery,
    useCreateCollectionMutation,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
} = collectionApi