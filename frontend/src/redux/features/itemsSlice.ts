import { createSlice } from "@reduxjs/toolkit";
import { string } from "zod";


// Redux Slice
const itemsSlice = createSlice({
    name: 'items',
    initialState: { expandedFolders: [] as string[],folders:[],assets:[],bucketRootFolder:{}},
    reducers: {
      toggleFolder: (state, action) => {
        const folderId = action.payload;
        state.expandedFolders.includes(folderId)
          ? state.expandedFolders = state.expandedFolders.filter(id => id !== folderId)
          : state.expandedFolders.push(folderId);
      },

       setFoldersDataWithParent:(state,action)=>{
        state.folders = action.payload;
       },

       setAssetsOfParticularFolder:(state,action)=>{
         state.assets = action.payload
       },
      setBucketRoootFolder:(state,action)=>{
        state.bucketRootFolder = action.payload;
      }
    },
  });
  

  export const { toggleFolder ,setFoldersDataWithParent,setAssetsOfParticularFolder,setBucketRoootFolder} = itemsSlice.actions;

  export default itemsSlice.reducer;