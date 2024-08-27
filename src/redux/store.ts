import {
    configureStore,
    ThunkAction,
    Action,
    // getDefaultMiddleware,
    combineReducers,
  } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loadingReducer from "./features/loadingSlice"


  // Initialize config for Redux Persist
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"], // List of reducers you want to store
};

const rootReducer = combineReducers({
  loading: loadingReducer,
  });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  devTools: process.env.NODE_ENV === "development",
  reducer: persistedReducer,
//   middleware: getDefaultMiddleware({
//     serializableCheck: false,
//   }),
});
// Create persistor to use for Redux Persist initialization
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;