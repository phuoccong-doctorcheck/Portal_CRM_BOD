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
import { getListMonitorBackup } from "services/api/monitor_backup";
import { BackupResponse } from "services/api/monitor_backup/types";
import { exportExcelReportDate, getReportDate, getReportMonth } from "services/api/report_plan";
import { BusinessPlanReport } from "services/api/report_plan/types";
import { isLoading } from "store/example";

interface  MBackupViewState {
 
  listMBackup: BackupResponse;
  isLoadingMBackup: boolean;
}

const initialState: MBackupViewState = {
  isLoadingMBackup: false,
  listMBackup: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
};

export const getMBackup = createAsyncThunk<
  BackupResponse,
  { rejectValue: any }
>(
  "mapsReducer/listMBackupAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListMonitorBackup(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const MBackupViewSlice = createSlice({
  name: "MBackupViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
     
   
    builder
      .addCase(getMBackup.pending, ($state) => {
        $state.isLoadingMBackup = true;
      })
      .addCase(getMBackup.fulfilled, ($state, action) => {
        $state.isLoadingMBackup = false;
        $state.listMBackup = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
  },
});

export const {} = MBackupViewSlice.actions;

export default MBackupViewSlice.reducer;
