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
import { exportExcelReportDate, getReportDate, getReportMonth } from "services/api/report_plan";
import { BusinessPlanReport } from "services/api/report_plan/types";
import { isLoading } from "store/example";

interface ReportPlanViewState {
 
  listReportPlan: BusinessPlanReport;
  isLoadingReportPlan: boolean;
}

const initialState: ReportPlanViewState = {
  isLoadingReportPlan: false,
  listReportPlan: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
 
};

export const getReportPlan = createAsyncThunk<
  BusinessPlanReport,
  { rejectValue: any }
>(
  "mapsReducer/listReportPlanAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getReportDate(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getReportPlanMonth = createAsyncThunk<
  BusinessPlanReport,
  { rejectValue: any }
>(
  "mapsReducer/listReportPlanMonthAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getReportMonth(data);
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
export const ReportPlanViewSlice = createSlice({
  name: "appointmentViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
     
     builder
      .addCase(getReportPlan.pending, ($state) => {
        $state.isLoadingReportPlan = true;
      })
      .addCase(getReportPlan.fulfilled, ($state, action) => {
        $state.isLoadingReportPlan = false;
        $state.listReportPlan = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
    builder
      .addCase(getReportPlanMonth.pending, ($state) => {
        $state.isLoadingReportPlan = true;
      })
      .addCase(getReportPlanMonth.fulfilled, ($state, action) => {
        $state.isLoadingReportPlan = false;
        $state.listReportPlan = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
  },
});

export const {} = ReportPlanViewSlice.actions;

export default ReportPlanViewSlice.reducer;
