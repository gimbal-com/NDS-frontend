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

// //Async Redux Action to call GET /api/jobs API to get jobDetail
// export const getJobDetail = createAsyncThunk('jobs/getJobDetail', async (jobId: number, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`/api/client/jobs/${jobId}`);
//         return response.data;
//     } catch (error: any) {
//         return rejectWithValue('Failed to get job detail');
//     }
// });

// //Async Redux Action to call GET /api/jobs API to get Folder by JobId
// export const getFoldersByJobId = createAsyncThunk('jobs/getFoldersByJobId', async (jobId: number, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`/api/client/jobs/${jobId}/folders`);

//         return response.data;
//     } catch (error: any) {
//         return rejectWithValue('Failed to get folders');
//     }
// });

// //Async Redux Action to call POST /api/jobs API to create Folder by JobId
// export const createFolderByJobId = createAsyncThunk('jobs/createFolderByJobId', async ({ jobId, name }: { jobId: number, name: string }, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.post(`/api/client/jobs/${jobId}/folders`, { name });
//         toast({ description: response.data.message, variant: 'default' });
//         return response.data;
//     } catch (error: any) {
//         toast({ description: error.response.data.message, variant: 'destructive' });
//         return rejectWithValue('Failed to create folder');
//     }
// });

// //Async Redux Action to call GET /api/jobs API to get Files by JobId and FolderId
// export const getFilesByJobIdAndFolderId = createAsyncThunk('jobs/getFilesByJobIdAndFolderId', async ({ jobId, folderId }: { jobId: number, folderId: number }, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`/api/client/jobs/${jobId}/folders/${folderId}/files`);
//         return response.data;
//     } catch (error: any) {
//         return rejectWithValue('Failed to get files');
//     }
// });

// //Async Redux Action to call POST /api/jobs API to upload files
// export const uploadFiles = createAsyncThunk('jobs/uploadFiles', async ({ jobId, folderId, files }: { jobId: number, folderId: number, files: File[] }, { rejectWithValue }) => {
//     try {
//         const formData = new FormData();
//         files.forEach(file => {
//             formData.append('files', file);
//         });

//         const response = await axiosInstance.post(`/api/client/jobs/${jobId}/folders/${folderId}/files`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         toast({ description: response.data.message, variant: 'default' });
//         return response.data;
//     } catch (error: any) {
//         toast({ description: error.response.data.message, variant: 'destructive' });
//         return rejectWithValue('Failed to upload files');
//     }
// });

// export const getJobListByAdmin = createAsyncThunk('jobs/getJobListByAdmin', async (_, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`/api/admin/jobs`);
//         console.log(response.data);
        
//         return response.data;
//     } catch (err: any) {
//         return rejectWithValue(err);
//     }
// });

// export const getJobListByPilot = createAsyncThunk('jobs/getJobListByPilot', async (_, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`/api/pilot/jobs`);
//         console.log(response.data);
        
//         return response.data;
//     } catch (err: any) {
//         return rejectWithValue(err);
//     }
// });

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getJobList.fulfilled, (state, action) => {
                state.jobList = action.payload.jobs;
                state.loading = false;
                state.error = null;
            })
            // .addCase(getJobDetail.fulfilled, (state, action) => {
            //     state.jobDetail = action.payload.job;
            //     state.loading = false;
            //     state.error = null;
            // })
            // .addCase(createFolderByJobId.fulfilled, (state, action) => {
            //     state.folderList.push(action.payload.folder),
            //         state.loading = false;
            // })
            // .addCase(getFoldersByJobId.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.folderList = action.payload.folders;
            // })
            // .addCase(uploadFiles.fulfilled, (state, action) => {
            //     state.loading = false;
            // })
            // .addCase(getFilesByJobIdAndFolderId.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.fileList = action.payload.files;
            // })
            // .addCase(getJobListByAdmin.fulfilled, (state, action) => {
            //     state.jobList = action.payload.jobs;
            // })
            // .addCase(getJobListByPilot.fulfilled, (state, action) => {
            //     state.jobList = action.payload.jobs;
            // })
    }
})

export default jobSlice.reducer;