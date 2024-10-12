/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getListBeforeExams } from "services/api/beforeExams";
import {
  ListBeforeExams,
  PayloadGetBeforeExams,
} from "services/api/beforeExams/types";

interface BeforeExamState {
  beforeExamsList: ListBeforeExams;
  loadingBefore: boolean;
}

const initialState: BeforeExamState = {
  beforeExamsList: {
    data: {
      count: {
        total_count: 0,
        contact_count: 0,
        lead_count: 0,
        customer_count: 0,
        qt_count: 0,
        cn_count: 0,
        csdt_count: 0,
        dh_count: 0,
        hl_count: 0,
      },
      data: [],
      paging: {
        page_number: 0,
        page_size: 0,
        total_count: 0,
        total_page: 0,
        has_previous_page: false,
        has_next_page: false,
      },
    },
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },
  loadingBefore: false,
};

export const getListToStoreBeforeExams = createAsyncThunk<
  ListBeforeExams,
  PayloadGetBeforeExams,
  { rejectValue: any }
>(
  "mapsReducer/getListBeforeExamsAction",
  async (data: PayloadGetBeforeExams, { rejectWithValue }) => {
    try {
      const response = await getListBeforeExams(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const BeforeExamSlice = createSlice({
  name: "beforeExamReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListToStoreBeforeExams.pending, ($state, action) => {
        $state.loadingBefore = true;
      })
      .addCase(getListToStoreBeforeExams.fulfilled, ($state, action) => {
        $state.loadingBefore = false;
        const newData = action.payload.data.data.map((item, index) => ({
          index: index + 1,
          ...item,
        }));

        $state.beforeExamsList = {
          ...action.payload,
          data: {
            ...action.payload.data,
            data: newData,
          },
        };
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
  },
});

export const {} = BeforeExamSlice.actions;

export default BeforeExamSlice.reducer;
