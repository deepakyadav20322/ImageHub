import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

  export const authApi = createApi({
        reducerPath:"authSlice",
        baseQuery:fetchBaseQuery({baseUrl:import.meta.env.VITE_API_URL_V1}),
        endpoints:(builder)=>({
         login:builder.mutation({
          query: (credentials) => ({
            url: "/auth/login",
            method: "POST",
            body: credentials,
          }),
         })
        })
  })