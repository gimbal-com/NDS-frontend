import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice';
import jobReducer from './job/jobSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        job: jobReducer
    }
})

export default store;