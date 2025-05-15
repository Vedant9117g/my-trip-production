import {configureStore} from "@reduxjs/toolkit" 
import rootRedcuer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { mapApi } from "@/features/api/mapApi"; 
import { conversationApi } from "@/features/api/conversationApi"; // Import conversationApi

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware,mapApi.middleware ,  conversationApi.middleware
    )
});
