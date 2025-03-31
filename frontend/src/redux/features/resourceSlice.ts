import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for a single resource
import { Resource } from "@/lib/types";

// Define the state type
interface ResourceState {
  resources: Resource[];
  bucket: Resource[];
  activeBucket:string;
  isResourceLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ResourceState = {
  resources: [],
  bucket: [],
  activeBucket:"",
  isResourceLoading: false,
  error: null,
};

// Create the slice
export const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setResourceLoading: (state, action: PayloadAction<boolean>) => {
      state.isResourceLoading = action.payload;
    },
    setResourceError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setResources: (state, action: PayloadAction<Resource[]>) => {
        state.bucket = action.payload;
        state.isResourceLoading = false;
        state.error = null;
    },
    setActiveBucket: (state, action) => {
      state.activeBucket = action.payload;
    }

    // addResource: (state, action: PayloadAction<Resource>) => {
    //     state.resources.push(action.payload);
    // },
    // updateResource: (state, action: PayloadAction<Resource>) => {
    //     const index = state.resources.findIndex(r => r.resourceId === action.payload.resourceId);
    //     if (index !== -1) {
    //         state.resources[index] = action.payload;
    //     }
    // },
    // deleteResource: (state, action: PayloadAction<string>) => {
    //     state.resources = state.resources.filter(r => r.id !== action.payload);
    // },
  },
});

// Export actions and reducer
export const { setResourceError, setResourceLoading, setResources,setActiveBucket } =
  resourceSlice.actions;

export default resourceSlice.reducer;
