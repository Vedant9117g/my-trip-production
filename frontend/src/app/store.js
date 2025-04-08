import {configureStore} from "@reduxjs/toolkit" 
import rootRedcuer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { mapApi } from "@/features/api/mapApi"; 

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware,mapApi.middleware)
});
