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
import { postLoadLeadReportAPI, postLoadLeadReportDayAPI } from "services/api/leadReportAPI";
import { ApiResponse } from "services/api/leadReportAPI/types";
import { isLoading } from "store/example";

interface AppointmentViewState {
  listLeadReport: ApiResponse;
  isLoadingListLeadReport: boolean;
    listLeadReportDay: ApiResponse;
  isLoadingListLeadReportDay: boolean;
}

const initialState: AppointmentViewState = {
  isLoadingListLeadReport: false,
  listLeadReport: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
 isLoadingListLeadReportDay: false,
  listLeadReportDay: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
};

export const getListLeadReport = createAsyncThunk<
  ApiResponse, any,
  { rejectValue: any }
>(
  "mapsReducer/listLeadReportMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postLoadLeadReportAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getListLeadReportDay = createAsyncThunk<
  ApiResponse, any,
  { rejectValue: any }
>(
  "mapsReducer/listLeadReportDayMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postLoadLeadReportDayAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const LeadReportViewSlice = createSlice({
  name: "leadReportViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListLeadReport.pending, ($state) => {
        $state.isLoadingListLeadReport = true;
      })
      .addCase(getListLeadReport.fulfilled, ($state, action) => {
        $state.isLoadingListLeadReport = false;
        $state.listLeadReport = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
       builder
      .addCase(getListLeadReportDay.pending, ($state) => {
        $state.isLoadingListLeadReportDay = true;
      })
      .addCase(getListLeadReportDay.fulfilled, ($state, action) => {
        $state.isLoadingListLeadReportDay = false;
        $state.listLeadReportDay = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
  
  },
});

export const {} = LeadReportViewSlice.actions;

export default LeadReportViewSlice.reducer;
