import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice';
import jobReducer from './job/jobSlice';
import claimReducer from './claim/claimSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        job: jobReducer,
        claim: claimReducer
    }
})

export default store;