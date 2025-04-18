import { loginSchema } from "@/lib/ZodSchema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {z} from "zod";
import {LoginResponse} from "@/lib/types"
type LoginCredentials = z.infer<typeof loginSchema>

export const authApi = createApi({
  reducerPath: "authSlice",
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL_V1,
    credentials: 'include', // Handles cookies if needed
    prepareHeaders: (headers) => {
      // Add any common headers here
      // headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth','Resources','Folder', 'Asset','AllAssets'], // For cache invalidation
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        
      }),
      transformErrorResponse: (response) => {
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
        headers:{'Content-Type':'application/josn',
          'Access-Control-Allow-Origin':'*'
        }

      }),
      transformErrorResponse:(response)=>{
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
      transformErrorResponse: (response) => {
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
    
    
  }),
});

export const { useLoginMutation,useSignUpMutation,useForgetPasswordMutation,useResetPasswordMutation } = authApi;
export default authApi;