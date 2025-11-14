/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";
// API danh sách monmitor của services trong ngày
export const getLAPIistMonitoring = async (data: any) => {
 
  const response = await axiosInstance.post("/monitor-service/get-service-monitorings",data);
  return response.data;
};
