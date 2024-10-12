/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */

import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";

import axiosInstance from "../common/instance";

import { LaunchSourceTypes, LaunchSourceGroups } from "./../dashboard/types";
import { PayloadGetBeforeExams } from "./types";

/* Hành trình trước khám: beforexams */

export const getListBeforeExams = async (data: PayloadGetBeforeExams) => {
  const {
    processKeyId,
    launchSourceID,
    launchSourceGroup,
    launchSourceType,
    fromDay,
    toDay,
    keyWord,
    pages,
    limits,
    followStaffId,
  } = data;
  const response = await axiosInstance.post("/beforexams/list", {
    process_key_id: processKeyId || "all",
    launch_source_ids: launchSourceID || "all",
    launch_source_group_id: launchSourceGroup,
    launch_source_type_id: launchSourceType,
    follow_staff_id: followStaffId || "all",
    fromdate: !_.isNaN(fromDay)
      ? fromDay
      : moment(new Date()).format("YYYY-MM-DDT00:00:00"),
    todate: !_.isNaN(toDay)
      ? toDay
      : moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
    keyword: keyWord,
    page: pages || 1,
    limit: limits || 1000,
  });
  return response.data;
};
// API lưu thông tin khách hàng đặt lịch
export const postSaveCustomerBeforeExams = async (data: any) => {
  const response = await axiosInstance.post("/beforexams/save-customer", data);
  
  return response.data;
};

// API lấy khách hàng theo ID
export const getCustomerById = async (data: any) => {
  const body = {
    type: data?.type || "id",
    data: data?.customer_id,
  };
  const response = await axiosInstance.post("/cs/get-customer-info", body);
  return response.data;
};
export const postAssignedToID = async (id: string) => {
  const employeeId = Cookies.get("employee_id");
  const body = {
    lead_id: id,
    follow_staff_id: employeeId || Cookies.get("employee_id"),
  };
  const response = await axiosInstance.post("/cs/save-lead-assigned", body);
  return response.data;
};

export const postNoteByID = async (data: any) => {
  const response = await axiosInstance.post("/notes/save-cs-note", data);
  return response.data;
};

export const getNoteByCustomerID = async (data: any) => {
  const response = await axiosInstance.post("/notes/filter-cs-notes", data);
  return response.data;
};
export const getNoteByModule = async (data: any) => {
  const { id, type } = data;
  const body = {
    customer_id: id || "",
    cs_node_type: type || "cs",
  };
  const response = await axiosInstance.post("/notes/filter-cs-notes", body);
  return response.data;
};

export const getTagByObjectID = async (data: any) => {
  const body = {
    object_id: "",
    object_type: "cs",
  };
  const response = await axiosInstance.post("/tag/get-object-tags", body);
  return response.data;
};

export const postObjectTag = async (body: any) => {
  const response = await axiosInstance.post("/tag/add-object-tags", body);
  return response.data;
};

export const postRemoveObjectTag = async (data: any) => {
  const body = {
    object_id: "",
    object_type: "cs",
    tag_id: "",
  };
  const response = await axiosInstance.post("/tag/remove-object-tag", body);
  return response.data;
};

export const postChangeProcessId = async (body: any) => {
  const response = await axiosInstance.post(
    "/cs/change-process-id-before",
    body
  );
  return response.data;
};
