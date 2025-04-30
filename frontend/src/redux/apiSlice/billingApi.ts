
import { authApi } from "./authApi"; // Import the base API

export const billingApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getBillCredits: builder.query<
            { success: boolean, data: any },
            { accountId: string; access_token: string }
        >({
            query: ({ accountId, access_token }) => ({
                url: `/billing/credits/${accountId}`,
                headers: {
                    Authorization: `${access_token}`,
                    'Content-Type': 'application/json'
                },
            }),
            transformResponse: (response: { success: boolean; data: any }) => {
                return response.data;
            },
        }),

        getCurrentPlan: builder.query<
            { success: boolean, data: any },
            { accountId: string; access_token: string }
        >({
            query: ({ accountId, access_token }) => ({
                url: `/billing/plan/${accountId}`,
                headers: {
                    Authorization: `${access_token}`,
                    'Content-Type': 'application/json'
                },
            }),
            transformResponse: (response: { success: boolean; data: any }) => {
                return response.data;
            },
        }),

        getCreditAndStorage: builder.query<
            { success: boolean, data: any },
            { accountId: string; access_token: string }
        >({
            query: ({ accountId, access_token }) => ({
                url: `/billing/all-data-current-plan/${accountId}`,
                headers: {
                    Authorization: `${access_token}`,
                    'Content-Type': 'application/json'
                },
            }),
            transformResponse: (response: { success: boolean; data: any }) => {
                return response.data;
            },
        }),

    }),



});

export const {
    useGetBillCreditsQuery,
    useGetCreditAndStorageQuery
} = billingApi;
