/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { /* createAsyncThunk */PayloadAction, createSlice } from '@reduxjs/toolkit';

interface HomeState {
}

const initialState: HomeState = {
  itemInteract: undefined,
};

// export const getUserAction = createAsyncThunk<
//   User,
//   number,
//   { rejectValue: any }
// >('mapsReducer/getProjectAction', async (id, { rejectWithValue }) => {
//   try {
//     const response = await getUserInfo(id);
//     return response;
//   } catch (error) {
//     return rejectWithValue(error);
//   }
// });

export const dashboardSlice = createSlice({
  name: 'dashboardReducer',
  initialState,
  reducers: {

  },
  // extraReducers(builder) {
  //   builder.addCase(getUserAction.fulfilled, ($state, action) => {
  //     $state.infuser = action.payload;
  //   });

  // },
});

export const {
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
