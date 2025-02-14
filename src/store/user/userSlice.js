import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 

import axiosInstance, { setAuthToken } from '../../lib/axios'; 
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode';

// Setting the initial state for authentication.
const initialState = {
    user: {},
    userList: [],
    loading: false,
    error: null,
};

export const refresh = createAsyncThunk('user/auth/refresh', async (token, { rejectWithValue }) => {
    let user = jwtDecode(token);
    setAuthToken(token);
    return user;
})

export const login = createAsyncThunk('user/auth/login', async ({username, password}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/api/login`, {username, password});
        window.localStorage.setItem(`token`, response.data.token);
        setAuthToken(response.data.token);
        return response.data;
    } catch (error) {
        message.warning(error.response.data.message);
        return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk('user/auth/register', async ({username, email, password, accountType}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/api/register`, {username, email, password, accountType});
        return response.data;
    } catch (error) {
        message.warning(error.response.data.message);
        return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      setAuthToken('');
      window.localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Storing the user data upon successful login.
      })
      .addCase(register.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.user = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
