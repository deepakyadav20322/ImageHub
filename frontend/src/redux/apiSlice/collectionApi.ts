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
            query: ({ collectionId,token,name,description }) => ({
                url: `/collection/update-collection/${collectionId}`,
                method: 'PATCH',
                body:{name,description},
                headers:{
                    Authorization:token
                }
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


        addItemToCollection: builder.mutation({
            query: ({ collectionId, resourceId, token }) => ({
                url: `/collection/collection/add-item`,
                method: 'POST',
                body:{
                    collectionId,
                    resourceId
                },
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ['Collection'],
        }),

        getItemsOfCollection: builder.query({
            query: ({collectionId, token}) => ({
                url: `/collection/get-itemOf-collection/${collectionId}`,
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }),
            providesTags: ['Collection']
        }),
    }),
})

export const {
    useGetItemsOfCollectionQuery,
    useGetAllCollectionsQuery,
    useCreateCollectionMutation,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
} = collectionApi