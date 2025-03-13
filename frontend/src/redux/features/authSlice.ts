import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface AuthState {
//     user:any,  // role is present in user info
//     token:string | null,
//     permissions:any,  //Todo: see the best possible way to store the permison and access (also mentain for redis means always make redis call on every api to get the permission)
//     isAuthenticated:boolean
// }

interface AuthState {
  user: Record<string, any> | null;
  token: string | null;
  permissions: string[];  // Changed to array
  isAuthenticated: boolean;
  loading:boolean,
  error:any
}

const initialState:AuthState = {
    user:null,
    token:null,
    permissions:[],
    isAuthenticated:false,
    loading:false,
    error:null
}

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers: {
      startLoading: (state) => {
        state.loading = true;
        state.error = null; // Clear old errors when loading starts
      },

      setAuth: (
          state:AuthState,
          action: PayloadAction<{
              token: string;
              permissions: string[];  
              user: Record<string, any>;
          }>
      ) => {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.permissions = action.payload.permissions;  
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
      },

      logout: (state:AuthState) => {
          state.token = null;
          state.user = null;
          state.permissions = [];
          state.isAuthenticated = false;
          state.loading = false;
          state.error = null;
      },

      setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      },
  },
})




export default authSlice.reducer;
export const {setAuth,logout } = authSlice.actions