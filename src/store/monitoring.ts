/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getStatisticAppointmentView,
  loadAppointmentMasters,
} from "services/api/appointmentView";
import {
  AppointmentViewResp,
  StatisticAppointment,
  StatisticAppointmentCustomize,
} from "services/api/appointmentView/types";
import { loadKPIDays, loadKPIDays_C1, loadKPIDays_C2, loadKPIDays_C3 } from "services/api/kpi_taskView";
import { loadKPIDaysView,loadKPIDaysType} from "services/api/kpi_taskView/types"
import { getLAPIistMonitoring } from "services/api/monitoring";
import { MonitorResponse } from "services/api/monitoring/types";
import { getReportFBDate, getReportFBDateAll } from "services/api/report_fb_ads";
import { ReportResponse, TargetResponse } from "services/api/report_fb_ads/types";
import { exportExcelReportDate, getReportDate, getReportMonth } from "services/api/report_plan";
import { BusinessPlanReport } from "services/api/report_plan/types";
import { isLoading } from "store/example";

interface MonitoringViewState {
 
  listMonitoring: MonitorResponse;
  isLoadingListMonitoring: boolean;
}

const initialState: MonitoringViewState = {
  isLoadingListMonitoring: false,
  listMonitoring: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
 
};

export const getListMonitoring = createAsyncThunk<
  MonitorResponse,
  { rejectValue: any }
>(
  "mapsReducer/listMonitoringAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getLAPIistMonitoring(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const listMonitoringViewSlice = createSlice({
  name: "listMNTRViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
     
     builder
      .addCase(getListMonitoring.pending, ($state) => {
        $state.isLoadingListMonitoring = true;
      })
      .addCase(getListMonitoring.fulfilled, ($state, action) => {
        $state.isLoadingListMonitoring = false;
        $state.listMonitoring = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
  
  },
});

export const {} = listMonitoringViewSlice.actions;

export default listMonitoringViewSlice.reducer;
