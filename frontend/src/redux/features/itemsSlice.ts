import { createSlice } from "@reduxjs/toolkit";
import { string } from "zod";


// Redux Slice
const itemsSlice = createSlice({
    name: 'items',
    initialState: { expandedFolders: [] as string[],folders:[] },
    reducers: {
      toggleFolder: (state, action) => {
        const folderId = action.payload;
        state.expandedFolders.includes(folderId)
          ? state.expandedFolders = state.expandedFolders.filter(id => id !== folderId)
          : state.expandedFolders.push(folderId);
      },

       setFoldersDataWithParent:(state,action)=>{
        state.folders = action.payload;
       }

    },
  });

  export const { toggleFolder ,setFoldersDataWithParent} = itemsSlice.actions;

  export default itemsSlice.reducer;