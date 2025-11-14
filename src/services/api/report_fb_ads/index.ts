/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";
// API danh sách đặt lịch theo ngày tháng
export const getReportFBDate = async (data: any) => {
 
  const response = await axiosInstance.post("/facebook-ads/reports-evaluation-criteria",data);
  return response.data;
};
// API danh sách đặt lịch theo ngày tháng
export const getReportFBDateAll = async (data: any) => {
 
  const response = await axiosInstance.post("/facebook-ads/reports-evaluation-criteria-v2",data);
  return response.data;
};
// API 
export const postUpdateHSEvu = async (data: any) => {
 
  const response = await axiosInstance.post("/facebook-ads/hide-or-show-evaluation-criterias",data);
  return response.data;
};

export const exportExcelReportDate = async (data: any) => {
  const response = await axiosInstance.post("/cashes/exportxls-cashes-by-date", data);
  const byteCharacters = atob(response.data.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.ms-excel' });

    // Tạo link tải và tự động bấm vào link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const filename = `CashReport_${data.date || 'export'}.xlsx`;
  link.download = filename;
    link.click();

    // Sau khi tải xong, giải phóng URL object
    URL.revokeObjectURL(link.href);
  return response.data;
};
export const exportExcelReportMonth = async (data: any) => {
  const response = await axiosInstance.post("/cashes/exportxls-cashes-by-month", data);
  const byteCharacters = atob(response.data.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.ms-excel' });

    // Tạo link tải và tự động bấm vào link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const filename =  `CashReport_${data.month}-${data.year || 'export'}.xlsx`;
  link.download = filename;
    link.click();

    // Sau khi tải xong, giải phóng URL object
    URL.revokeObjectURL(link.href);
  return response.data;
};
