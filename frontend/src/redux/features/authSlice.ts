import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    user:any,  // role is present in user info
    permissions:any,  //Todo: see the best possible way to store the permison ans access (also mentain for redis)
    isLogin:boolean
}

const initialState:AuthState = {
    user:{},
    permissions:{},
    isLogin:false
}

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{}
})




export default authSlice.reducer;
export const { } = authSlice.actions