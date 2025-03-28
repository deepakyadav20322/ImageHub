import { createSlice } from "@reduxjs/toolkit";
import { string } from "zod";


// Redux Slice
const folderSlice = createSlice({
    name: 'folder',
    initialState: { expandedFolders: [] as string[] },
    reducers: {
      toggleFolder: (state, action) => {
        const folderId = action.payload;
        state.expandedFolders.includes(folderId)
          ? state.expandedFolders = state.expandedFolders.filter(id => id !== folderId)
          : state.expandedFolders.push(folderId);
      },
    },
  });

  export const { toggleFolder } = folderSlice.actions;

  export default folderSlice.reducer;