import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../..//lib/axios";
import { message } from "antd";

const initialState = {
  claimList: [],
  loading: false,
  error: null
}

//Async Redux Action to call POST /api/jobs API to create a new job
export const createClaimByPilot = createAsyncThunk('jobs/createClaimByPilot', async (claimData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/pilot/claim/new`, claimData);
    message.success(response.data.message);
    return response.data;
  } catch (error) {
    message.warning(error.response.data.message)
    return rejectWithValue('Failed to create job');
  }
});

const claimSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createClaimByPilot.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
  }
})

export default claimSlice.reducer;