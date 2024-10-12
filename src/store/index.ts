/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import afterExamsReducer from "./afterexams";
import appointmentMasterReducer from "./appointment_view";
import beforeExamReducer from "./beforeExams";
import bookingScheduleReducer from "./booking_schedule";
import cloudfoneReducer from "./cloudfone/index";
import infoCustomer from "./customerInfo";
import dashboardReducer from "./dashboard";
import exampleReducer from "./example";
import homeReducer from "./home";
import KPIDayViewReducer from "./kpi_taskview"
import messageReducer from "./message";
import misscallReducer from "./misscall";
import pancakeReducer from "./pancake/index";
import pointReducer from "./point";
import ReportPlanReducer from "./report_plan_bussiness"
import statisticReducer from "./statistics";

// Initialize config for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // List of reducers you want to store
};

const rootReducer = combineReducers({
  example: exampleReducer,
  user: dashboardReducer,
  message: messageReducer,
  afterExams: afterExamsReducer,
  home: homeReducer,
  beforeExams: beforeExamReducer,
  infosCustomer: infoCustomer,
  bookingSchedule: bookingScheduleReducer,
  appointmentMaster: appointmentMasterReducer,
  pancake: pancakeReducer,
  statistic: statisticReducer,
  misscall: misscallReducer,
  cloudfone: cloudfoneReducer,
  point: pointReducer,
  kpiday: KPIDayViewReducer,
  ReportPlan: ReportPlanReducer,

});

// Apply Redux Persist to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  devTools: process.env.NODE_ENV === "development",
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
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
