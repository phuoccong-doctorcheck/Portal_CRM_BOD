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
import { getReportFBDate, getReportFBDateAll } from "services/api/report_fb_ads";
import { ReportResponse, TargetResponse } from "services/api/report_fb_ads/types";
import { exportExcelReportDate, getReportDate, getReportMonth } from "services/api/report_plan";
import { BusinessPlanReport } from "services/api/report_plan/types";
import { isLoading } from "store/example";

interface ReportFBADSViewState {
 
  listReportFBADS: TargetResponse;
  isLoadingReportFBADS: boolean;
  listReportFBADSAll: ReportResponse;
  isLoadingReportFBADSAll: boolean;
}

const initialState: ReportFBADSViewState = {
  isLoadingReportFBADS: false,
  listReportFBADS: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  isLoadingReportFBADSAll: false,
  listReportFBADSAll: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
 
};

export const getReportFBADS = createAsyncThunk<
  TargetResponse,
  { rejectValue: any }
>(
  "mapsReducer/listReportFBADSAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getReportFBDate(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getReportFBADSAll = createAsyncThunk<
  ReportResponse,
  { rejectValue: any }
>(
  "mapsReducer/listReportFBADSAllAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getReportFBDateAll(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const exportReportPlan = createAsyncThunk<
  { rejectValue: any }
>(
  "mapsReducer/exportReportPlanDateAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await exportExcelReportDate(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const ReportFBADSViewSlice = createSlice({
  name: "listFBADSViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
     
     builder
      .addCase(getReportFBADS.pending, ($state) => {
        $state.isLoadingReportFBADS = true;
      })
      .addCase(getReportFBADS.fulfilled, ($state, action) => {
        $state.isLoadingReportFBADS = false;
        $state.listReportFBADS = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
   builder
      .addCase(getReportFBADSAll.pending, ($state) => {
        $state.isLoadingReportFBADSAll = true;
      })
      .addCase(getReportFBADSAll.fulfilled, ($state, action) => {
        $state.isLoadingReportFBADSAll = false;
        $state.listReportFBADSAll = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
  },
});

export const {} = ReportFBADSViewSlice.actions;

export default ReportFBADSViewSlice.reducer;
