/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { log } from "console";

import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getCustomerFType,
  getCustomerLeads,
  getListCustomerPoints,
} from "services/api/point";
import {
  ResponseCustomerFType,
  ResponseCustomerLeads,
  ResponseCustomerPoints,
} from "services/api/point/types";

interface PointState {
  loadingPoint: boolean;
  responsePoint: ResponseCustomerPoints;
  loadingCustomerLeads: boolean;
  responseCustomerLeads: ResponseCustomerLeads;
  responseCustomerFType: ResponseCustomerFType;
  responseCustomerFTypeLoading: boolean;
}

const initialState: PointState = {
  loadingPoint: false,
  responsePoint: undefined as unknown as ResponseCustomerPoints,
  loadingCustomerLeads: false,
  responseCustomerLeads: undefined as unknown as ResponseCustomerLeads,
  responseCustomerFType: undefined as unknown as ResponseCustomerFType,
  responseCustomerFTypeLoading: false,
};

export const getListCustomerPoint = createAsyncThunk<
  ResponseCustomerPoints,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getListCustomerPointAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListCustomerPoints(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCustomerLeadsData = createAsyncThunk<
  ResponseCustomerLeads,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getCustomerLeadsDataAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerLeads(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCustomerFTypeByOwner = createAsyncThunk<
  ResponseCustomerFType,
  any,
  { rejectValue: any }
>("mapsReducer/getCustomerFTypeAction", async (data, { rejectWithValue }) => {
  try {
    const response = await getCustomerFType(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const pointSlice = createSlice({
  name: "PointReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getListCustomerPoint.pending, ($state) => {
        $state.loadingPoint = true;
      })
      .addCase(getListCustomerPoint.fulfilled, ($state, action) => {
        $state.loadingPoint = false;
        $state.responsePoint = action.payload;
      });
    builder
      .addCase(getCustomerLeadsData.pending, ($state) => {
        $state.loadingCustomerLeads = true;
      })
      .addCase(getCustomerLeadsData.fulfilled, ($state, action) => {
        $state.loadingCustomerLeads = false;
        $state.responseCustomerLeads = action.payload;
      });
    builder
      .addCase(getCustomerFTypeByOwner.pending, ($state) => {
        $state.responseCustomerFTypeLoading = true;
      })
      .addCase(getCustomerFTypeByOwner.fulfilled, ($state, action) => {
        $state.responseCustomerFTypeLoading = false;
        $state.responseCustomerFType = action.payload;
      });
  },
});

export const {} = pointSlice.actions;

export default pointSlice.reducer;
