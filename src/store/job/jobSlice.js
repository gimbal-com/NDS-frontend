import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../..//lib/axios";
import { message } from "antd";

const initialState = {
    jobList: [],
    jobDetail: {},
    folderList: [],
    fileList: [],
    loading: false,
    error: null
}

//Async Redux Action to call POST /api/jobs API to create a new job
export const createJobByClient = createAsyncThunk('jobs/createJobByClient', async (jobData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/api/client/jobs`, jobData);
        message.success(response.data.message);
        return response.data;
    } catch (error) {
        message.warning(error.response.data.message)
        return rejectWithValue('Failed to create job');
    }
});

//Async Redux Action to call GET /api/jobs API to get joblist
export const getJobListByClient = createAsyncThunk('jobs/getJobList', async (userId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/client/jobs?userId=${userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to get jobs');
    }
});

//Async Redux Action to call GET /api/jobs API to get jobDetail
export const getJobDetailByClient = createAsyncThunk('jobs/getJobDetailByClient', async (jobId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/client/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to get job detail');
    }
});

//Async Redux Action to call GET /api/jobs API to get Folder by JobId
export const getFoldersByJobId = createAsyncThunk('jobs/getFoldersByJobId', async (jobId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/client/jobs/${jobId}/folders`);
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to get folders');
    }
});

//Async Redux Action to call POST /api/jobs API to create Folder by JobId
export const createFolderByJobId = createAsyncThunk('jobs/createFolderByJobId', async ({ jobId, name }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/api/client/jobs/${jobId}/folders`, { name });
        message.success(response.data.message);
        return response.data;
    } catch (error) {
        message.error(error.response.data.message);
        return rejectWithValue('Failed to create folder');
    }
});

//Async Redux Action to call GET /api/jobs API to get Files by JobId and FolderId
export const getFilesByJobIdAndFolderId = createAsyncThunk('jobs/getFilesByJobIdAndFolderId', async ({ jobId, folderId }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/client/jobs/${jobId}/folders/${folderId}/files`);
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to get files');
    }
});

//Async Redux Action to call POST /api/jobs API to upload files
export const uploadJobFiles = createAsyncThunk('jobs/uploadFiles', async ({ jobId, folderId, files }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await axiosInstance.post(`/api/client/jobs/${jobId}/folders/${folderId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        message.success(response.data.message);
        return response.data;
    } catch (error) {
        toast({ description: error.response.data.message, variant: 'destructive' });
        return rejectWithValue('Failed to upload files');
    }
});

// export const getJobListByAdmin = createAsyncThunk('jobs/getJobListByAdmin', async (_, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`/api/admin/jobs`);
//         console.log(response.data);

//         return response.data;
//     } catch (err: any) {
//         return rejectWithValue(err);
//     }
// });

export const getJobListByPilot = createAsyncThunk('jobs/getJobListByPilot', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/pilot/jobs`);
        console.log(response.data);

        return response.data;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const getJobDetailByPliot = createAsyncThunk(`jobs/getJobDetailByPilot`, async (jobId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/pilot/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to get job detail');
    }
});

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createJobByClient.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getJobListByClient.fulfilled, (state, action) => {
                state.jobList = action.payload.jobs;
                state.loading = false;
                state.error = null;
            })
            .addCase(getJobDetailByClient.fulfilled, (state, action) => {
                state.jobDetail = action.payload.job;
                state.loading = false;
                state.error = null;
            })
            .addCase(createFolderByJobId.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getFoldersByJobId.fulfilled, (state, action) => {
                state.loading = false;
                state.folderList = action.payload.folders;
            })
            .addCase(getFilesByJobIdAndFolderId.fulfilled, (state, action) => {
                state.loading = false;
                state.fileList = action.payload.files;
            })
            .addCase(uploadJobFiles.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getJobListByPilot.fulfilled, (state, action) => {
                state.jobList = action.payload.jobs;
            })
            .addCase(getJobDetailByPliot.fulfilled, (state, action) => {
                state.jobDetail = action.payload.job;
                state.loading = false;
                state.error = null;
            })
            // .addCase(getJobListByAdmin.fulfilled, (state, action) => {
            //     state.jobList = action.payload.jobs;
            // })
    }
})

export default jobSlice.reducer;