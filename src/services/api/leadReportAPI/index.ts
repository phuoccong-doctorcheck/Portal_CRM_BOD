/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import axiosInstance, { api1 } from "../common/instance";


export const postLoadLeadReportAPI = async (data: any) => {
  const response = await api1.post(`/leaddashboard/get-dashboards`, 
    data,
  );
  return response.data;
};
export const postLoadCSKHReportAPI = async (data: any) => {
  const response = await axiosInstance.post(`/reports/get-mtypes-dashboard`, 
    data,
  );
  return response.data;
};
export const postLoadLeadReportDayAPI = async (data: any) => {
  const response = await api1.post(`/leaddashboard/get-dashboards-days`, 
    data,
  );
  return response.data;
};

export const postVerifyAPI = async (data: any) => {
  const response = await api1.post(`/leaddashboard/verify`, 
    data,
  );
  return response.data;
};
