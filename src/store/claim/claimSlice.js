import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../..//lib/axios";
import { message } from "antd";

const initialState = {
  claimList: [],
  loading: false,
  error: null
}

//Async Redux Action to call POST /api/jobs API to create a new job
export const createClaimByPilot = createAsyncThunk('claims/createClaimByPilot', async (claimData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/pilot/claim/new`, claimData);
    message.success(response.data.message);
    return response.data;
  } catch (error) {
    message.warning(error.response.data.message)
    return rejectWithValue('Failed to create job');
  }
});

export const getClaimListByClient = createAsyncThunk('claims/getClaimListByClient', async (clientId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/pilot/claims?clientId=${clientId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch claim list');
  }
})

const claimSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createClaimByPilot.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getClaimListByClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.claimList = action.payload.claims;
      })
  }
})

export default claimSlice.reducer;