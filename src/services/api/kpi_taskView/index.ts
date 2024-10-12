/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import axiosInstance from "../common/instance";

export const loadKPIDays_C1 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/employee/1",
    data
  );
  return response.data;
};
export const loadKPIDays_C2 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/employee/2",
    data
  );
  return response.data;
};
export const loadKPIDays_C3 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/employee/3",
    data
  );
  return response.data;
};
export const loadKPIDays = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-kpis-employee",
    data
  );
  return response.data;
};

// export const postChangeMasterCare = async (data: string) => {
//   const response = await axiosInstance.post(`/cs/change-master-care-status`, {
//     master_id: data,
//   });
//   return response.data;
// };
// // API in chỉ định phục vụ (In Bill)
// export const postPrintAppointmentServicepoint = async (data: string) => {
//   const response = await axiosInstance.post(
//     `/reports/print-appointment-servicepoint`,
//     { master_id: data }
//   );
//   return response.data;
// };

// export const getStatisticAppointmentView = async (data: any) => {
//   const body = {
//     fromdate: data?.fromDate || null,
//     todate: data?.toDate || null,
//   };
//   const response = await axiosInstance.post(
//     `/statistic/statistic-master-by-date`,
//     body
//   );
//   return response.data;
// };
