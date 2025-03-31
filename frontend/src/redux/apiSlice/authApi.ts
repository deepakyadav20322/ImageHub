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
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth','Resources','Folder', 'Asset'], // For cache invalidation
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

    })
  }),
});

export const { useLoginMutation,useSignUpMutation } = authApi;
export default authApi;