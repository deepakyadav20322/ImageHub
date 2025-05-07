import { loginSchema } from "@/lib/ZodSchema";
import { BaseQueryFn, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {z} from "zod";
import {LoginResponse} from "@/lib/types"
import { logout } from "../features/authSlice";
type LoginCredentials = z.infer<typeof loginSchema>

// here we create cutome base query that itersept error that if that error is jwt expirs then it logout and send to login ------------

const baseQuery =  fetchBaseQuery({ 
  baseUrl: import.meta.env.VITE_API_URL_V1,
  credentials: 'include', // Handles cookies if needed
  prepareHeaders: (headers) => {
    // Add any common headers here
    // headers.set('Content-Type', 'application/json');
    return headers;
  },
})

const customBaseQuery: BaseQueryFn<any, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  // if (result.error) {
  //   // Log the detailed error structure HERE
  //   console.error('Error received in customBaseQuery:', JSON.stringify(result.error, null, 2));
  // }
  


  if (result.error && result.error.status === 401) {
    const message = (result.error.data as any)?.message || "";

    if (
      message.includes("Authorization token is required") || 
      message.includes("Session expired. Please log in again.") || 
      message.includes("Session expired") ||
      message.includes("Unauthorized")
    ) {
      api.dispatch(logout());
      window.location.href = "/login"; // Redirect user to login page
    }
  }
  return result;
};

// ----------------------------------------------------
export const authApi = createApi({
  reducerPath: "authSlice",
baseQuery:customBaseQuery,
  tagTypes: ['Auth','Resources','Folder', 'Asset','AllAssets','Tags','BillingPlan'], // For cache invalidation
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        
      }),
      transformErrorResponse: (response:any) => {
        // Handle error responses
        console.log(response);
        return response.data;
      },
    }),
    signUp:builder.mutation({
      query:(credential)=>({
        url:'/auth/register',
        method:"POST",
        body:credential,
        credentials:"include",
        headers:{'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*'
        }

      }),
      transformErrorResponse:(response: { success:string ; data: any })=>{
        // handle error data
        return response.data
      }

    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forget-password',
        method: 'POST',
        body: data, // RTK will serialize this to JSON
        credentials: 'include',
      }),
      transformErrorResponse: (response:any) => {
        return response.data;
      }
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
        credentials: 'include', // if your server uses cookies
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    welcomeOnboarding: builder.mutation({
      query: ({ interest='', organization,token }) => ({
        url: '/user/welcome',
        method: 'PATCH',
        body: { interest, organization },
        credentials: 'include',
        headers: {
          Authorization:token,
          'Content-Type': 'application/json'
        }
      }),
      transformErrorResponse: (response: any) => {
        return response.data;
      }
    }),
    
    userProfileUpdate: builder.mutation({
      query: ({firstName,lastName,userId,token}) => ({
        url: `/user/profile-update/${userId}`,
        method: 'PATCH',
        body: {firstName,lastName},
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization:token
        }
      }),
      invalidatesTags: ['Auth'],
      transformErrorResponse: (response: any) => {
        return response.data;
      }
    })
    
  }),
});

export const { useLoginMutation,useSignUpMutation,useForgetPasswordMutation,useResetPasswordMutation ,useWelcomeOnboardingMutation,useUserProfileUpdateMutation} = authApi;
export default authApi;