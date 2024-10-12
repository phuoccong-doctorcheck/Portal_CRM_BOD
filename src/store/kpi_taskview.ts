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
import { isLoading } from "store/example";

interface KPIViewState {
  listKPIDayC1: loadKPIDaysView;
  listKPIDayC2: loadKPIDaysView;
  listKPIDayC3: loadKPIDaysView;
  listKPIDay: loadKPIDaysType;
  isLoadingKPIMaster: boolean;
  statistic: StatisticAppointmentCustomize;
  isLoadingStatistic: boolean;
}

const initialState: KPIViewState = {
  isLoadingKPIMaster: false,
  listKPIDayC1: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  listKPIDayC2: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  listKPIDayC3: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  listKPIDay: {
    employee_id: "",
    employee_name:"",
    list_kpis: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  statistic: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  isLoadingStatistic: false,
};

export const getKPIDays = createAsyncThunk<
  loadKPIDaysType,
  { rejectValue: any }
>(
  "mapsReducer/listKPIAction",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIDays(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getKPIDayC1 = createAsyncThunk<
  loadKPIDaysView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIC1Action",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIDays_C1(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getKPIDayC2 = createAsyncThunk<
  loadKPIDaysView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIC2Action",
  async (data, { rejectWithValue }) => {
    try {
      const response = await loadKPIDays_C2(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getKPIDayC3 = createAsyncThunk<
  loadKPIDaysView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIC3Action",
  async (data, { rejectWithValue }) => {
    
    try {
      const response = await loadKPIDays_C3(data);
      console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getStatisticAppointment = createAsyncThunk<
  StatisticAppointment,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getStatisticAppointmentAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getStatisticAppointmentView(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const KPIDayViewSlice = createSlice({
  name: "appointmentViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
     builder
      .addCase(getKPIDays.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
      })
      .addCase(getKPIDays.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIDay = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
    builder
      .addCase(getKPIDayC1.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
      })
      .addCase(getKPIDayC1.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIDayC1 = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });

     builder
      .addCase(getKPIDayC2.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
      })
      .addCase(getKPIDayC2.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIDayC2 = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
     builder
      .addCase(getKPIDayC3.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
      })
      .addCase(getKPIDayC3.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIDayC3 = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
    builder
      .addCase(getStatisticAppointment.pending, ($state) => {
        $state.isLoadingStatistic = true;
      })
      .addCase(getStatisticAppointment.fulfilled, ($state, action) => {
        $state.isLoadingStatistic = false;
        const transformedData: any = {};
        const { data } = action.payload;

        data.forEach((item) => {
          if (!transformedData[item.id]) {
            transformedData[item.id] = {
              id: item.id,
              title: item.title.split(" - ")[0],
              child: [],
            };
          }

          transformedData[item.id].child.push({
            id: item.id,
            sequence: item.sequence,
            title: item.title,
            count: item.count,
          });
        });

        $state.statistic = {
          ...action.payload,
          data: [...Object.values(transformedData)] as any,
        };
      });
  },
});

export const {} = KPIDayViewSlice.actions;

export default KPIDayViewSlice.reducer;
