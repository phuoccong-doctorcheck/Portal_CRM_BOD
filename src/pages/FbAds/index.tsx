/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable import/order */
import {
  OptionTypeCustomer,
  exampleDataItemAppointmentView,
  optionCancelBooking,
  optionDate,
  optionDate3,
  optionNoteAppointmentView,
} from "assets/data";
import { MinusOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import CDatePickers from "components/atoms/CDatePickers";
import Button from "components/atoms/Button";
import CEmpty from "components/atoms/CEmpty";
import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon, { IconName } from 'components/atoms/Icon';

import { MessageOutlined } from '@ant-design/icons';
import Input from "components/atoms/Input";
import Loading from "components/atoms/Loading";
import TextArea from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import PublicTable from "components/molecules/PublicTable";
import CCollapse from "components/organisms/CCollapse";
import CModal from "components/organisms/CModal";
import PublicHeader from "components/templates/PublicHeader";
import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
import PublicLayout from "components/templates/PublicLayout";
import { useSip } from "components/templates/SipProvider";
import Cookies from "js-cookie";
import _, { divide, forInRight, set } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  postChangeMasterCare,
  postPrintAppointmentServicepoint,
} from "services/api/appointmentView";
import { AppointmentViewItem } from "services/api/appointmentView/types";
import { postNoteByID } from "services/api/beforeExams";
import { postCallOutCustomer } from "services/api/customerInfo";
import {
  getListAppointmentMaster,
  getStatisticAppointment,
} from "store/appointment_view";
import { getInfosCustomerById } from "store/customerInfo";
import { useAppDispatch, useAppSelector } from "store/hooks";
import mapModifiers, { downloadBlobPDF, exportDatatoExcel, handleRenderGUID, previewBlobPDFOpenLink } from "utils/functions";
import { stateAppointView } from "utils/staticState";
import { Col, DatePicker, MenuProps, Radio, RadioChangeEvent, Row, Select, Table, Button as ButtonANTD, Tag } from 'antd';
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { dataS, growthPercent, months } from "./dataS";
import PublicTableTotal from "components/molecules/PublicTableTotal";
import PublicTableBusiness from "components/molecules/PublicTableBusiness";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ExpandableConfig } from "antd/es/table/interface";
import { exportReportPlan, getReportPlan, getReportPlanMonth } from "store/report_plan_bussiness";
import { BusinessPlanReport, ReportItem } from "services/api/report_plan/types";
import { AddEvaluation, exportExcelReportDate, exportExcelReportMonth, getIDADS, updateEvaluation } from "services/api/report_plan";
import { getReportFBADS, getReportFBADSAll } from "store/report_fb_ads";
import RangeDate from "components/atoms/RangeDate";
import { da, fi } from "date-fns/locale";
import { name } from "sip.js";
import { isLoading } from "store/example";
import DropdownFb from "components/atoms/DropdownFb";
import { SOCKET_URL_FB } from "utils/constants";
import W3CWebSocket from "websocket";
import Dropdown3 from "components/atoms/Dropdown3";
import RangeDateD from "components/atoms/RangeDateD";
import { postUpdateHSEvu } from "services/api/report_fb_ads";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Option } = Select;
type ReportItems = {
  report_id: number;
  result_value: number;
  result_unit: string;
  report_date: string; // ISO 8601
  report_created_at: string;
};type TypeConnectSK = "connected" | "disconnect";
type InputData = {
  ads_account_id: string;
  target_id: number;
  target_value: number;
  target_unit: string;
  criteria_id: string;
  criteria_code: string;
  criteria_name: string;
  from_date: string;
  to_date: string;
  is_high_light: boolean;
  is_show: boolean;
  items: ReportItems[];
};

type GroupedItem = {
  from_date: string;
  to_date: string;
  sum_result_value?: number;
};

type GroupedOutput = {
  target_id: number;
  criteria_name: string;
  grouped: GroupedItem[];
};
function parseIntFromEuropeanFormat(str: any) {
  return parseInt(str.split(',')[0].replace(/\./g, '')) || 0;
}
function parseFloatCut2Decimals(value: any) {
  var str = String(value).replace(/\./g, '').replace(',', '.');
  var dotIndex = str.indexOf('.');
  if (dotIndex !== -1) {
    str = str.substring(0, dotIndex + 3); // cắt chuỗi
  }
  return Number(str); // ép về số thực
}
const listWeek = [
  { id: "1", value: "1", label: "Tuần 1" },
  { id: "2", value: "2", label: "Tuần 2" },
  { id: "3", value: "3", label: "Tuần 3" },
  { id: "4", value: "4", label: "Tuần 4" },
  { id: "5", value: "5", label: "Tuần 5" }
];
interface Symptom {
  label: string;
  value: string;
  is_show: boolean
}


type InputItem = {
  criteria_name: string;
  criteria_code: string;
};
function convertToSymptoms(data: any[]): Symptom[] {
  const uniqueMap = new Map<string, Symptom>();

  for (const item of data) {
    if (!uniqueMap.has(item.criteria_id)) {
      uniqueMap.set(item.criteria_id, {
        label: item.criteria_name,
        value: item.criteria_id,
        is_show: item.is_show
      });
    }
  }

  return Array.from(uniqueMap.values());
}
// export const groupItemsBy7Days = (data: InputData[]): GroupedOutput[] => {

//   const newData = data.slice(0, 20)
//   return newData.map((entry) => {
//     const sortedItems = [...(entry.items ?? [])].sort(
//       (a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
//     );
//     const grouped: GroupedItem[] = [];

//     for (let i = 0; i < sortedItems.length; i += 7) {
//       const chunk = sortedItems.slice(i, i + 7);
//       const from_date = chunk[0].report_date.slice(0, 10);
//       const to_date = chunk[chunk.length - 1].report_date.slice(0, 10);

//       const result_unit = chunk[0].result_unit; // giả định tất cả item trong chunk đều có cùng đơn vị
//       let sum = chunk.reduce((total, item) => total + item.result_value, 0);

//       let formatted_sum: number;

//       if (result_unit === '%') {
//         formatted_sum = parseFloat((sum / chunk.length).toFixed(2));
//       } else if (result_unit === 'SL') {
//         formatted_sum = Math.round(sum);
//       } else {
//         formatted_sum = parseFloat(sum.toFixed(5));
//       }

//       grouped.push({
//         from_date,
//         to_date,
//         sum_result_value: formatted_sum,
//       });
//     }

//     return {
//       target_id: entry.target_id,
//       criteria_name: entry.criteria_name,
//       ads_account_id: entry.ads_account_id,
//       criteria_code: entry.criteria_code,
//       criteria_id: entry.criteria_id,
//       target_unit: entry.target_unit,
//       target_value: entry.target_value,
//       grouped,
//     };
//   });
// };
export const groupItemsBy7Days = (data: InputData[]): GroupedOutput[] => {
  const newData = data.slice(0, 20);
  return newData.map((entry) => {
    const sortedItems = [...entry.items].sort(
      (a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
    );
    const grouped: GroupedItem[] = [];

    for (let i = 0; i < sortedItems.length; i += 7) {
      const chunk = sortedItems.slice(i, i + 7);
      const from_date = chunk[0].report_date.slice(0, 10);
      const to_date = chunk[chunk.length - 1].report_date.slice(0, 10);

      const result_unit = chunk[0].result_unit; // giả định tất cả item trong chunk đều có cùng đơn vị
      let sum = chunk.reduce((total, item) => total + item.result_value, 0);

      let formatted_sum: number;

      if (result_unit === '%') {
        formatted_sum = parseFloat((sum / chunk.length).toFixed(2));
      } else if (result_unit === 'SL') {
        formatted_sum = Math.round(sum);
      } else {
        formatted_sum = parseFloat(sum.toFixed(5));
      }

      grouped.push({
        from_date,
        to_date,
        sum_result_value: formatted_sum,
      });
    }

    return {
      target_id: entry.target_id,
      criteria_name: entry.criteria_name,
      ads_account_id: entry.ads_account_id,
      criteria_code: entry.criteria_code,
      criteria_id: entry.criteria_id,
      target_unit: entry.target_unit,
      target_value: entry.target_value,
      is_high_light: entry.is_high_light,
      is_show: entry.is_show,
      grouped,
      
    };
  });
 
};
export const groupItemsBy1Day = (
  data: InputData[],
  weekIndex?: number // 1: tuần đầu, 2: tuần thứ 2, ...
): GroupedOutput[] => {
  const newData = data.slice(0, 20);

  // Lấy toàn bộ ngày từ data
  let allDates: string[] = [];
  newData.forEach(entry => {
    entry.items?.forEach(item => {
      if (item.report_date) {
        allDates.push(item.report_date.slice(0, 10));
      }
    });
  });

  if (allDates.length === 0) return [];

  // Sắp xếp ngày tăng dần
  const sortedDates = [...new Set(allDates)].sort(); // bỏ trùng và sort
  const firstDate = new Date(sortedDates[0]);
  const lastDate = new Date(sortedDates[sortedDates.length - 1]);

  // Tính số tuần trong khoảng ngày
  const totalDays = Math.floor(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  // Nếu không truyền weekIndex thì mặc định là tuần cuối
  const selectedWeek = weekIndex && weekIndex >= 1 && weekIndex <= totalWeeks
    ? weekIndex
    : totalWeeks;

  const weekStart = new Date(firstDate);
  weekStart.setDate(firstDate.getDate() + (selectedWeek - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startStr = weekStart.toISOString().slice(0, 10);
  const endStr = weekEnd.toISOString().slice(0, 10);

  return newData.map((entry) => {
    const sortedItems = [...(entry.items ?? [])].sort(
      (a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
    );

    const grouped: GroupedItem[] = sortedItems
      .filter(item => {
        const dateStr = item.report_date.slice(0, 10);
        return dateStr >= startStr && dateStr <= endStr;
      })
      .map((item) => {
        const report_date = item.report_date.slice(0, 10);
        const result_unit = item.result_unit;

        let formatted_sum: number;

        if (result_unit === '%') {
          formatted_sum = parseFloat(item.result_value.toFixed(2));
        } else if (result_unit === 'SL') {
          formatted_sum = Math.round(item.result_value);
        } else {
          formatted_sum = parseFloat(item.result_value.toFixed(5));
        }

        return {
          from_date: report_date,
          to_date: report_date,
          sum_result_value: formatted_sum,
        };
      });

    return {
      target_id: entry.target_id,
      criteria_name: entry.criteria_name,
      ads_account_id: entry.ads_account_id,
      criteria_code: entry.criteria_code,
      criteria_id: entry.criteria_id,
      target_unit: entry.target_unit,
      target_value: entry.target_value,
      is_high_light: entry.is_high_light,
       is_show: entry.is_show,
      grouped,
    };
  });
};

export const groupItemsBy1Days = (data: InputData[]): GroupedOutput[] => {
  const newData = data.slice(0, 20);

  // Tìm ngày lớn nhất (cuối cùng)
  let allDates: string[] = [];
  newData.forEach(entry => {
    entry.items?.forEach(item => {
      if (item.report_date) {
        allDates.push(item.report_date.slice(0, 10)); // YYYY-MM-DD
      }
    });
  });

  if (allDates.length === 0) return [];

  const sortedDates = allDates.sort();
  const maxDateStr = sortedDates[sortedDates.length - 1]; // ngày cuối cùng
  const maxDate = new Date(maxDateStr);
  const lastWeekStart = new Date(maxDate);
  lastWeekStart.setDate(maxDate.getDate() - ((maxDate.getDate() - 1) % 7)); // đầu tuần gần nhất
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6); // kết thúc tuần gần nhất

  const startStr = lastWeekStart.toISOString().slice(0, 10);
  const endStr = lastWeekEnd.toISOString().slice(0, 10);

  return newData.map((entry) => {
    const sortedItems = [...(entry.items ?? [])].sort(
      (a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
    );

    const grouped: GroupedItem[] = sortedItems
      .filter(item => {
        const dateStr = item.report_date.slice(0, 10);
        return dateStr >= startStr && dateStr <= endStr;
      })
      .map((item) => {
        const report_date = item.report_date.slice(0, 10); // YYYY-MM-DD
        const result_unit = item.result_unit;

        let formatted_sum: number;

        if (result_unit === '%') {
          formatted_sum = parseFloat(item.result_value.toFixed(2));
        } else if (result_unit === 'SL') {
          formatted_sum = Math.round(item.result_value);
        } else {
          formatted_sum = parseFloat(item.result_value.toFixed(5));
        }

        return {
          from_date: report_date,
          to_date: report_date,
          sum_result_value: formatted_sum,
        };
      });

    return {
      target_id: entry.target_id,
      criteria_name: entry.criteria_name,
      ads_account_id: entry.ads_account_id,
      criteria_code: entry.criteria_code,
      criteria_id: entry.criteria_id,
      target_unit: entry.target_unit,
      target_value: entry.target_value,
      is_high_light: entry.is_high_light,
       is_show: entry.is_show,
      grouped,
    };
  });
};

export const groupPrice = (data: any[], nameCri: string) => {
  const filtered = data.filter(item => item.criteria_code === nameCri);

  if (filtered.length === 0) return "0";

  const groupedItems = filtered.flatMap(item => item.grouped || []);

  const total = groupedItems.reduce((sum, item) => {
    const value = Number(item.sum_result_value);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  return Math.floor(total).toLocaleString("vi-VN");
};
export const groupAverage = (data: any[], nameCri: string) => {
  const filtered = data.filter(item => item.criteria_code === nameCri);

  if (filtered.length === 0) return "0";

  const groupedItems = filtered.flatMap(item => item.grouped || []);

  const validValues = groupedItems
    .map(item => Number(item.sum_result_value))
    .filter(value => !isNaN(value));

  if (validValues.length === 0) return "0";
  const average = validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
  return Math.floor(average).toLocaleString("vi-VN");
};

interface ExpandableTitleProps {
  title: any;
  expanded: boolean;
  onToggle: () => void;
  hasChildren: boolean
}
const ExpandableTitle: React.FC<ExpandableTitleProps> = ({ title, expanded, onToggle, hasChildren }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', }}>
      {hasChildren === true ? (<div

        onClick={onToggle}
        style={{ marginRight: 8 }}
      ><span
        style={{ padding: "8px" }}
        className={`custom-expand-icon icon-transition sI1 sI2 sI3 sI4 hoverButton ${expanded ? 'icon-expanded' : ''
          }`}
      >
          {expanded ? <MinusOutlined /> : <PlusOutlined />}
        </span></div>) : <div


          onClick={onToggle}
          style={{ marginRight: 8 }}
        > <span
          style={{ padding: "8px", background: "transparent", }}
          className={`custom-expand-icon icon-transition ${expanded ? 'icon-expanded' : ''
            }`}
        >

        </span></div>}
      <div className={hasChildren === false ? 'ST1 sI2 sI3 sI4' : ''}
      > {title}</div>

    </div>
  );
};
const FbAds: React.FC = () => {
  const dispatch = useAppDispatch();
  const { makeCall } = useSip();
  const [selectedTags, setSelectedTags] = useState<Symptom[]>([]);
  const [isOpenSeen,setIsOpenSeen] = useState(false)
  const isSelected = (symptom: Symptom) =>
    selectedTags.some((tag) => tag.value === symptom.value);

  const handleToggle = (symptom: Symptom) => {
    if (isSelected(symptom)) {
      setSelectedTags(selectedTags.filter((tag) => tag.value !== symptom.value));
    } else {
      setSelectedTags([...selectedTags, symptom]);
    }
  };

  const handleRemove = (value: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.value !== value));
  };
  const ThisYear = dayjs().year();
  const LastYear = dayjs().year() - 1;
  const savedData = JSON.parse(localStorage.getItem('adsAccounts') || '[]');
 
  const savedDataC = JSON.parse(localStorage.getItem('adsCri') || '[]');
  const [stateSaveData, setStateSaveData] = useState(savedData)
  // useEffect(() => {
  //   setStateSaveData(savedData)
  // },[stateSaveData])
  const defaultValues = [dayjs(`${LastYear}`, 'YYYY'), dayjs(`${ThisYear}`, 'YYYY')];
  const isLoadingStatistic = useAppSelector((state) => state.appointmentMaster.isLoadingStatistic);
  const storeStatistic = useAppSelector((state) => state.appointmentMaster.statistic);
  const storeisLoadingReportFBADSMaster = useAppSelector((state) => state.ReportFBADS.isLoadingReportFBADS);
  const storeReportFBADSMaster = useAppSelector((state) => state.ReportFBADS.listReportFBADS);

  const storeisLoadingReportFBADSMasterAll = useAppSelector((state) => state.ReportFBADS.isLoadingReportFBADSAll);
  const storeReportFBADSMasterAll = useAppSelector((state) => state.ReportFBADS.listReportFBADSAll);
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");

  const isLoadingReportPlan = useAppSelector((state) => state.ReportPlan.isLoadingReportPlan);
  const storeReportPlan = useAppSelector((state) => state.ReportPlan.listReportPlan);
  const [dataReportDate, setDataReportDate] = useState<ReportItem[]>(storeReportPlan?.data?.items || [])
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<
    DropdownData[]
  >(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<
    DropdownData[]
  >(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [listLaunchSources, setListLaunchSources] = useState<DropdownData[]>(
    storageLaunchSources ? JSON.parse(storageLaunchSources) : ""
  );
  const [appointmentStatistic, setAppointmentStatistic] = useState(storeStatistic.data);
  const [listReportFBADSMaster, setListReportFBADSMaster] = useState(storeReportFBADSMaster.data);

  const [listReportFBADSMasterAll, setListReportFBADSMasterAll] = useState(storeReportFBADSMasterAll.data);

  const [groupedReportFBADSMaster, setGroupedReportFBADSMaster] = useState<any[]>([]);
  const [isError, setIsError] = useState(false)
  const [criteriaIds, setCriteriaIds] = useState<string[]>([]);

  useEffect(() => {

    if (Array.isArray(storeReportFBADSMaster.data) && storeReportFBADSMaster.data.length !== 0 ) {
      const uniqueIds = [...new Set(storeReportFBADSMaster.data.map(item => item.criteria_id))];
      setCriteriaIds(uniqueIds);
      setGroupedReportFBADSMaster(groupItemsBy7Days(storeReportFBADSMaster.data));
        generateColumns( groupItemsBy7Days(storeReportFBADSMaster.data)[1]?.grouped,
        groupItemsBy7Days(storeReportFBADSMaster.data)
      );
      generateColumns1(
        groupItemsBy1Days(storeReportFBADSMaster.data)[1]?.grouped,
        groupItemsBy1Days(storeReportFBADSMaster.data)
      );
    }
   

  }, [storeReportFBADSMaster.data])
  useEffect(() => {
    setListReportFBADSMasterAll(storeReportFBADSMasterAll.data)
  },[storeReportFBADSMasterAll])
  const processedOptions = savedDataC.map((item: any) => ({
    ...item,
    disabled: criteriaIds.includes(item.criteria_id),
    value: item.criteria_id,  // cần để Select hoạt động đúng
    label: item.criteria_name // cần để hiển thị đúng
  }));
  const [isOpenDetailService, setIsOpenDetailService] = useState(false);
  const [listDetailService, setListDetailService] = useState();
  const [payment, setPayment] = useState(0);
  const nameCS = Cookies.get("signature_name");
  const [contentNote, setContentNote] = useState("");
  const [modeButton, setModeButton] = useState(false);
  const [isAddNote, setIsAddNote] = useState(false);
  const employeeId = localStorage.getItem("employee_id");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 500 });
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isOpenGrowth, setIsOpenGrowth] = useState(false)
  const [modeButtonExcel, setModeButtonExcel] = useState(true)
  const tableRefAppointment = useRef<HTMLDivElement>(null);
  const [dataFilter, setDataFilter] = useState({
    date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    from_date: moment().startOf("month").format("YYYY-MM-DDTHH:mm:ssZ"),
    to_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
    ads_account_id: "all",
    year: moment().format("YYYY"),
    month: moment().month() + 1,
    launchSourceId: undefined as unknown as DropdownData,
    launchSourceGroup: undefined as unknown as DropdownData,
    keyWord: "",
    target_value: "",
    target_id: "",


  });
  const getUsername = Cookies.get('username');
  const [dataUpdate, setDataUpdate] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DDTHH:mm:ssZ"),
    to_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
    username: getUsername,
    target_value: "",
    target_id: "",
    openFormUpdate: false,
    name: "",
    isLoading: false,
    criteria_id: "",
    ads_account_id: ""
  });
  const [dataAdd, setDataAdd] = useState({
    criteria_id: savedDataC[0]?.criteria_id,
    username: getUsername,
    target_value: "",
    openFormAdd: false,
    isLoading: false,
    ads_account_id: "",
    from_date: moment().startOf("month").format("YYYY-MM-DDTHH:mm:ssZ"),
    to_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
  });
  const [startMonth, setStartMonth] = useState<string>('01');
  const [endMonth, setEndMonth] = useState<string>('12');
  const [endMonth2, setEndMonth2] = useState<string>('Tháng 12');
  const [missingData, setMissingData] = useState<
    Array<{ month: string; growth_rate: string }>
  >([]);
  const [dataMonth, setDataMonth] = useState<
    Array<{ month: string }>
  >([]);
  const [yearChoose, setYearChoose] = useState("2024")
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = moment().year();
  const [mode, setMode] = useState<'date' | 'month' | 'year'>('date');
  const [columnsDate, setColumns] = useState<any[]>([]);
  const [columnsDate1, setColumns1] = useState<any[]>([]);
  const [columnsDate2, setColumns2] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<[Dayjs, Dayjs] | null>(
    null
  );
  const [infoCustomer, setInfoCustomer] = useState({
    name: "",
    date: "",
    masterId: '',
  });
  const [canceledReason, setCanceledReason] = useState({
    type: '',
    reason: '',
    item: undefined as unknown as GroupRadioType,
  });
  const [timer, setTimer] = useState("")
  const initial = {
    fromDate: dataFilter?.date
      ?? moment(new Date()).format("YYYY-MM-DDT00:00:00"),
    toDate: dataFilter?.date
      ?? moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
  };

  const propsData = {
    date: moment(dataFilter?.date).format("YYYY-MM-DDTHH:mm:ss"),
    launchSourceId: dataFilter?.launchSourceId?.value || 0,
    launchSourceGroupID: dataFilter?.launchSourceGroup?.value || 0,
    keyWord: dataFilter?.keyWord || "",
    pages: pagination?.page || 1,
    limits: pagination?.pageSize || 500,
  };

  const [filterColumn, setFilterColumn] = useState({
    company: [],
    launch_source: [],
    launch_source_type: [],
    partner: [],
    package: [],
    typeCustomer: [],
  });

  const [dataStatistic, setDataStatistic] = useState({
    pagination: undefined as any,
    filters: undefined as any,
    sorter: undefined as any,
    extra: undefined as any,
  });
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  
  useEffect(() => {
  
 
      dispatch(getReportFBADS({ ads_account_id: dataFilter.ads_account_id, from_date: dataFilter.from_date, to_date: dataFilter.to_date } as any));
    
    document.title = "Báo cáo Facebook ADS";
  }, []);

  const [loadExcel, setLoadExcel] = useState(false)
  const { mutate: postExportExcelReportDate } = useMutation(
    "post-footer-form",
    (data: any) => exportExcelReportDate(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setLoadExcel(false)
        }
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
   const { mutate: postUpdateHS } = useMutation(
    "post-footer-form",
    (data: any) => postUpdateHSEvu(data),
    {
      onSuccess: (data) => {
        if (data.status) {
            dispatch(getReportFBADS({ ads_account_id: dataFilter.ads_account_id, from_date: dataFilter.from_date, to_date: dataFilter.to_date } as any));
          setIsOpenSeen(false)
        }
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const handleUpdateHS = () => {


const result = selectedTags.map(item => item.value);

    const body = {
      criteria_ids: result,
      type_campaign: "fb_ads_nsdd"
    }
    postUpdateHS(body)
  }
  const [formDataErr, setFormDataErr] = useState({
    targetValue: '',

  });
  const [formDataErrA, setFormDataErrA] = useState({
    targetValue: '',

  });
  const handleValidateA = () => {
    if (!dataAdd.target_value.trim()) {
      setFormDataErrA({

        targetValue: dataAdd.target_value.trim() ? 'Mục tiêu là trường bắt buộc' : '',

      });
      return false;
    }
    return true;
  };
  const handleValidate = () => {
    if (!dataUpdate.target_value.trim()) {
      setFormDataErr({

        targetValue: dataUpdate.target_value.trim() ? 'Mục tiêu là trường bắt buộc' : '',

      });
      return false;
    }
    return true;
  };
  const handleUpdateEvaluation = () => {
    if (!handleValidate()) return;
    setDataUpdate({
      ...dataUpdate,
      isLoading: true,
    })
    const body = {
      criteria_id: dataUpdate.criteria_id,
      ads_account_id: dataUpdate.ads_account_id,
      target_value: parseInt(dataUpdate.target_value, 10),
      from_date: dataUpdate.from_date,
      to_date: dataUpdate.to_date,
      username: dataUpdate.username,
    }
    postUpdateEvaluation(body)
  }
  const handleAddEvaluation = () => {
    if (!handleValidateA()) return;
    setDataAdd({
      ...dataAdd,
      isLoading: true,
    })
    const body = {
      criteria_id: dataAdd.criteria_id,
      target_value: parseInt(dataAdd.target_value, 10),
      from_date: dataAdd.from_date,
      to_date: dataAdd.to_date,
      username: dataUpdate.username,
      ads_account_id: dataAdd.ads_account_id,
    }
    postAddEvaluation(body)
  }
  const { mutate: postUpdateEvaluation } = useMutation(
    "post-footer-form",
    (data: any) => updateEvaluation(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(getReportFBADS({ ads_account_id: dataFilter.ads_account_id, from_date: dataFilter.from_date, to_date: dataFilter.to_date } as any));
          setDataUpdate({
            ...dataUpdate,
            isLoading: false,
            openFormUpdate: false,
            target_value: "",
          })
        }
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const { mutate: postAddEvaluation } = useMutation(
    "post-footer-form",
    (data: any) => AddEvaluation(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(getReportFBADS({ ads_account_id: dataFilter.ads_account_id, from_date: dataFilter.from_date, to_date: dataFilter.to_date } as any));
          setDataAdd({
            ...dataAdd,
            isLoading: false,
            openFormAdd: false,
            target_value: "",
            criteria_id: "",
            ads_account_id: "",
          })
        }
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const handleExportDate = async () => {
    setLoadExcel(true)
    const body = {
      date: dataFilter.date
    };
    await postExportExcelReportDate(body);
  };
  const { mutate: postExportExcelReportMonth } = useMutation(
    "post-footer-form",
    (data: any) => exportExcelReportMonth(data),
    {
      onSuccess: (data) => {
        setLoadExcel(false)
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  // month: dataFilter.month.toString(),year:moment(dataFilter.year).format("YYYY") }
  const handleExportMonth = async () => {
    setLoadExcel(true)
    const body = {
      month: dataFilter.month.toString(),
      year: moment(dataFilter.year).format("YYYY")

    };
    await postExportExcelReportMonth(body);
  };
  const { mutate: postNoteCustomerById } = useMutation(
    "post-footer-form",
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        setIsAddNote(false);
        setContentNote("");
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const { mutate: printAppointmentServicepoint } = useMutation(
    "post-footer-form",
    (data: string) => postPrintAppointmentServicepoint(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          previewBlobPDFOpenLink(data?.data, data?.message);
        } else {
          toast.info(data?.message);
        }
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );


  const descriptionGrid = [
    { id: 0, color: '#fbf7aadb', title: 'Chưa đến', type: 'new' },
    { id: 1, color: '#c8ebfa', title: 'Đang phục vụ', type: 'inprogress' },
    { id: 2, color: '#98e0ad', title: 'Đã xong', type: 'done' },
  ];



  const formMergeCustomer = useMemo(() => (
    <div className="t-header_wrapper-merge_customer" style={{ border: "none" }}>
      {/* {missingData?.map((item: any, index: any) => ( */}
      <div className="t-header_wrapper-merge_customer_flex" style={{ marginBottom: "10px" }}>
        <div style={{ minWidth: "100px", height: "100%" }}> <Typography>Tháng dự đoán</Typography></div>
        <CDatePickers
          fomat="MM-YYYY"
          variant="simple"
          picker="month"
          ValDefault={dataFilter.date}
          value={new Date(dataFilter?.date)}
          handleOnChange={(date: any) => {
            const selectedDate = moment(date?.$d);
            const selectedYear = selectedDate.format("YYYY");

            // Kiểm tra xem tháng có phải trong tương lai không
            const currentDate = moment(); // Ngày hiện tại
            if (selectedDate.isAfter(currentDate, 'month')) {
              setFromDate(selectedYear);
              setYearChoose(selectedYear);
              setDataFilter({
                ...dataFilter,
                date: date?.$d,
              });
              setModeButton(true)
            } else {
              // Nếu tháng không phải là tương lai
              setModeButton(false)
              setFromDate(selectedYear);
              setYearChoose(selectedYear);
              setDataFilter({
                ...dataFilter,
                date: date?.$d,
              });

            }
          }}
        />
        <Select
          defaultValue="Mức tăng trưởng"
          style={{ width: 100 }}
          // onChange={handleChange}
          options={growthPercent}
          allowClear={false}
        />

      </div>
      <div className="t-header_wrapper-merge_customer_flex" style={{ marginBottom: "10px", justifyContent: "start" }}>
        <div style={{ minWidth: "100px", }}> <Typography>So với tháng</Typography></div>
        <CDatePickers
          fomat="MM-YYYY"
          variant="simple"
          picker="month"
          ValDefault={dataFilter.date}
          value={new Date(dataFilter?.date)}
          handleOnChange={(date: any) => {
            const selectedDate = moment(date?.$d);
            const selectedYear = selectedDate.format("YYYY");

            // Kiểm tra xem tháng có phải trong tương lai không
            const currentDate = moment(); // Ngày hiện tại
            if (selectedDate.isAfter(currentDate, 'month')) {
              setFromDate(selectedYear);
              setYearChoose(selectedYear);
              setDataFilter({
                ...dataFilter,
                date: date?.$d,
              });
              setModeButton(true)
            } else {
              // Nếu tháng không phải là tương lai
              setModeButton(false)
              setFromDate(selectedYear);
              setYearChoose(selectedYear);
              setDataFilter({
                ...dataFilter,
                date: date?.$d,
              });

            }
          }}
        />
      </div>
      {/* ))} */}


    </div>
  ), [missingData, selectedMonth])


  const expenseItems = dataReportDate?.filter(item => item.sequence >= 6 && item.sequence <= 8);
  const otherItems = dataReportDate?.filter(item => item.sequence < 6);
  const [stateIdArray, setStateIdArray] = useState(0)


  const Ex = (data: any) => {
    if (data.criteria_code === "doanh_thu_du_kien") {
      return groupPrice(groupedReportFBADSMaster, data.criteria_code)
    }
    else if (data.criteria_code === "dau_tu_tren_1_kh_thuc_te_den") {
      return groupAverage(groupedReportFBADSMaster, data.criteria_code)
    }
    else if (data.criteria_code === "doanh_thu_thuc_te_trong_ngay") {

      return groupPrice(groupedReportFBADSMaster, data.criteria_code)
    }
    else if (data.criteria_code === "dau_tu") {
      return groupPrice(groupedReportFBADSMaster, "dau_tu")
    }
    else if (data.criteria_code === "tong_tin_nhan") {
      return groupPrice(groupedReportFBADSMaster, data.criteria_code)
    }
    else if (data.criteria_code === "gia_tren_tin_nhan") {
     // return groupAverage(groupedReportFBADSMaster,"gia_tren_tin_nhan")
return Math.floor(
  parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "dau_tu")) /
  (parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "tong_tin_nhan")) || 1)
).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "tin_nhan_chat_luong") {
      return (groupPrice(groupedReportFBADSMaster, "tin_nhan_chat_luong"))
    }
    else if (data.criteria_code === "ti_le_tin_nhan_chat_luong") {
      return ((parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "tin_nhan_chat_luong")) / parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "tong_tin_nhan"))) * 100).toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "so_luong_dat_hen") {
      return (groupPrice(groupedReportFBADSMaster, "so_luong_dat_hen"))
    }
    else if (data.criteria_code === "ti_le_dat_hen_tren_tin_nhan_chat_luong") {
      return ((parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "so_luong_dat_hen")) / parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "tin_nhan_chat_luong"))) * 100).toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "so_luong_khach_hang_den_kham") {
      return (groupPrice(groupedReportFBADSMaster, "so_luong_khach_hang_den_kham"))
    }
    else if (data.criteria_code === "ti_le_den_tren_sl_dat_hen") {
      return ((parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "so_luong_khach_hang_den_kham")) / parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "so_luong_dat_hen"))) * 100).toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "so_luot_hoan_thanh_kham") {
      return (groupPrice(groupedReportFBADSMaster, "so_luot_hoan_thanh_kham"))
    }
    else if (data.criteria_code === "ti_le_hoan_thanh_tren_so_luong_den") {
      return ((parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "so_luot_hoan_thanh_kham")) / parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "so_luong_khach_hang_den_kham"))) * 100).toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "ti_le_hoan_thanh_kham_tren_sl_tin_nhan") {
      return ((parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "so_luot_hoan_thanh_kham")) / parseIntFromEuropeanFormat(groupPrice(groupedReportFBADSMaster, "tong_tin_nhan"))) * 100).toLocaleString("vi-VN")
    }
      else if (data.criteria_code === "gia_tri_kham_trung_binh_thuc_te") {
      return (groupAverage(groupedReportFBADSMaster, "gia_tri_kham_trung_binh_thuc_te"))
    }
    else {
      groupPrice(groupedReportFBADSMaster, data.criteria_code)
      let sum = data.grouped.reduce((total: any, item: any) => total + item.sum_result_value, 0);
      return sum.toLocaleString("vn-VN")
    }
  }
  const getPriceTB = (data: any) => {
    if (data.criteria_code === "doanh_thu_du_kien") {
      return parseFloat((data.target_value / 30).toFixed(2)).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "gia_tri_kham_trung_binh_thuc_te") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "dau_tu_tren_1_kh_thuc_te_den") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "doanh_thu_thuc_te_trong_ngay") {

      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "dau_tu") {
      return parseFloat((data.target_value / 30).toFixed(2)).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "tong_tin_nhan") {
      return parseFloat((data.target_value / 30).toFixed(2)).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "gia_tren_tin_nhan") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "tin_nhan_chat_luong") {
      return parseFloat((data.target_value / 30).toFixed(2)).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "ti_le_tin_nhan_chat_luong") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "so_luong_dat_hen") {
      return parseFloat((data.target_value / 30).toFixed(2)).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "ti_le_dat_hen_tren_tin_nhan_chat_luong") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "so_luong_khach_hang_den_kham") {
      return parseFloat((data.target_value / 30).toFixed(2)).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "ti_le_den_tren_sl_dat_hen") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "so_luot_hoan_thanh_kham") {
      return parseFloat((data.target_value / 30).toFixed(2)).toLocaleString("vi-VN");
    }
    else if (data.criteria_code === "ti_le_hoan_thanh_tren_so_luong_den") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else if (data.criteria_code === "ti_le_hoan_thanh_kham_tren_sl_tin_nhan") {
      return data.target_value.toLocaleString("vi-VN")
    }
    else {
      groupPrice(groupedReportFBADSMaster, data.criteria_code)
      let sum = data.grouped.reduce((total: any, item: any) => total + item.sum_result_value, 0);
      return sum.toLocaleString("vn-VN")
    }
  }
  
  const columns1 = [
    {
      title: <Typography content="Chỉ tiêu đánh giá" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "left", marginLeft:10 }} />,
      dataIndex: 'criteria_name',
      align: 'center',
      width: 300, fixed: "left",
      
      render: (record: any, data: any) => {
       
        return (
           <Typography content={record} modifiers={['13x18', '500', 'left']}styles={{
  textAlign: "left",
  fontWeight: 600,
  marginLeft: 10,
  color: data.is_high_light === true ? "#f20b50" : "#070707"
}} />
        )
      },
    },
    {
      title: <Typography content="Mục tiêu: 30 ngày" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
      dataIndex: 'target_value',
      align: 'center',
      width: 150,
      fixed: "left",
      render: (record: any, data: any) => (
        <div
        
          onClick={() => {
            setDataUpdate({
              ...dataUpdate,
              openFormUpdate: true,
              name: data.criteria_name,
              criteria_id: data.criteria_id, 
              ads_account_id: dataFilter.ads_account_id
            });
          }}
        >

          <Typography content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString()} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "right" }} />
        </div>
      ),
    },
    {
      title: <Typography content="Trung bình/ngày" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
      dataIndex: 'target_value',
      align: 'center',fixed: "left",
      width: 150, 
      render: (record: any, data: any) => (
        <div >
          <Typography content={data.target_unit === "%" ? getPriceTB(data) + "%" : getPriceTB(data)} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "right" }} />
        </div>
      ),
    },
    {
      title: <Typography content="Hiện tại" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
      dataIndex: 'target_value',
      align: 'center',fixed: "left",
      width: 150, 
      render: (record: any, data: any) => (
        <div >
          {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
          <Typography content={data.target_unit === "VND" ? Ex(data) : data.target_unit === "%" ? Ex(data) + "%" : Ex(data)} modifiers={['13x18', '600', 'left']} styles={{ textAlign: "right" ,  color: data.is_high_light === true ? "#f20b50" : "#070707"}} />
        </div>
      ),
    },
    ...columnsDate,
    ...columnsDate2,
    ...columnsDate1
  ];
  
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [recordInit, setRecordInit] = useState({
    items: [],
    id: 'C1'
  })
  const [expandInit, setExpandInit] = useState(true)



  const handleExpand = (expanded: boolean, record: any) => {
    const currentKey = record.id;
    if (expanded) {
      // Xử lý khi mở rộng
      const parentKey = getParentKey(currentKey);
      // Nếu là thẻ cha, đóng tất cả các thẻ cha khác cùng cấp
      if (parentKey === "") {
        const siblingKeys = findSiblingKeys(dataReportDate, parentKey);
        setExpandedKeys([...expandedKeys.filter(key => !siblingKeys.includes(key)), currentKey]);
      } else {
        // Nếu là thẻ con, đóng tất cả các thẻ con khác cùng cấp
        const siblingKeys = findSiblingKeys(dataReportDate, currentKey);
        setExpandedKeys([...expandedKeys.filter(key => !siblingKeys.includes(key)), currentKey]);
      }
    } else {
      // Khi thu gọn một dòng, loại bỏ key của dòng đó khỏi expandedKeys
      setExpandedKeys((prev) => prev.filter((key) => key !== currentKey));
    }
  };

  // Hàm để lấy key của phần tử cha
  const getParentKey = (key: string): string => {
    return key;
  };

  // Tìm tất cả các khóa (keys) của các dòng cùng cấp
  const findSiblingKeys = (items: any[], parentKey: string): string[] => {
    for (const item of items) {
      if (item.id === parentKey) {
        return item.items?.map((child: any) => child.id) || [];
      }
      if (item.items) {
        const result = findSiblingKeys(item.items, parentKey);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  };
  const [example, setExample] = useState(0)
  const expandIcon: ExpandableConfig<any>['expandIcon'] = ({ expanded, onExpand, record }) => (
    <span
      onClick={(e) => onExpand && onExpand(record, e)}
      className={`icon-transition custom-expand-icon ${expanded ? 'icon-expanded' : ''}`}
    >
      {expanded ? <MinusOutlined /> : <PlusOutlined />}
    </span>
  );
  const SYMPTOMS = convertToSymptoms(groupedReportFBADSMaster);
  const TableMemory = useMemo(() => {
    return (
      <PublicTableBusiness
        column={columns1}
        isHideRowSelect
      listData={groupedReportFBADSMaster.filter((item: any) => item.is_show !== false)}
        rowkey="id"
        isPagination={false}
        isExpandable
        showExpandColumn

        expandedRowKeys={expandedKeys}
        onExpand={handleExpand}
        // expandIcon={expandIcon}
        //  isbordered
        scroll={{ x: 'max-content', y: 400 }}
        tableRef={tableRefAppointment}
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
      />
    );
  }, [storeisLoadingReportFBADSMaster, groupedReportFBADSMaster, expandedKeys, example, dataReportDate, stateIdArray,columnsDate2]);
  const [fromDates, setFromDate] = useState("2024")
  const [toDates, setToDate] = useState("")
  const statisticHeader = useMemo(
    () => (
      <PublicHeaderStatistic
        title2={
          <div style={{ marginLeft: "10px" }}>
            <Icon iconName="report_crm-yellow" size="20x20" />

          </div>
        }
        title={``}
        //   title={`Kế hoạch kinh doanh Doctor Check <span style="color:#00556E;">${fromDates} - </span><span style="color:#00556E;">${toDates}</span>`}
        isSendRequest={isLoadingStatistic}
        handleClick={(data: any) => {

        }}
        isStatistic={false}
        valueRangeDate={{
          from: new Date(),
          to: new Date(),
        }}
      >
        {
          stateBreakPoint < 980 ?
            <ul className="p-appointment_view_description">
              {
                descriptionGrid.map((item) => (
                  <li key={item.id}>
                    <p style={{ backgroundColor: item.color }} />
                    <Typography content={item.title} />
                  </li>
                ))
              }
            </ul> : null
        }
      </PublicHeaderStatistic>
    ),
    [appointmentStatistic, storeStatistic.data, listReportFBADSMaster, toDates, fromDates]
  );


  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const currentYear = dayjs().year();
    const lastYear = currentYear - 1;
    const year = current.year();
    return year !== currentYear && year !== lastYear;
  };
  const generateMissingData = (
    selectedStartMonth: number,
    selectedEndMonth: number
  ) => {
    const data = [];
    for (let i = selectedStartMonth; i <= selectedEndMonth; i++) {
      if (i > currentMonth) {
        data.push({ month: months[i - 1].label, growth_rate: '' });
      }
    }
    return data;
  };
  const generateDataMonth = (
    selectedStartMonth: number,
    selectedEndMonth: number
  ) => {
    const data = [];
    for (let i = selectedStartMonth; i <= selectedEndMonth; i++) {

      data.push({ month: months[i - 1].label });

    }
    return data;
  };




  const handleStartMonthChange = (value: string) => {
    setStartMonth(value);
    if (endMonth && value > endMonth) {
      setEndMonth(value); // Reset end month nếu start month lớn hơn end month
    }

  };

  const handleEndMonthChange = (value: string) => {
    setEndMonth(value);

  };


  const yesterday = dayjs().subtract(1, 'day');
  const renderRangePicker = () => {
    const disabledDate = (current: dayjs.Dayjs): boolean => {
      // Can not select days after today
      return current && current > dayjs().endOf('day');
    };
    switch (mode) {
      case 'date':
        // return <RangePicker onChange={handleRangeChange} disabledDate={disabledDay} style={{width:"250px", boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff"}}/>;
        return <RangeDate

          variant="simple"
          handleOnChange={(from: any, to: any) => {
            setDataFilter({
              ...dataFilter,
              from_date: moment(from).format('YYYY-MM-DDT00:00:00'),  // giữ dưới dạng string
              to_date: moment(to).format('YYYY-MM-DDT23:59:59'),      // giữ dưới dạng string
            });

            dispatch(getReportFBADS({ from_date: moment(from).format('YYYY-MM-DDT00:00:00'), to_date: moment(to).format('YYYY-MM-DDT23:59:59'), ads_account_id: dataFilter.ads_account_id } as any));
          }}
          value={{
            from: dataFilter?.from_date,   // từ string
            to: dataFilter?.to_date,       // từ string (chỉnh lại đúng toDate thay vì toDay)
          }}
          fomat="DD/MM/YYYY"  // Sửa "fomat" thành "format"
        />
      case 'month':
        return <div style={{ display: "flex", alignItems: "center" }}>

          <div style={{ width: "200px", maxWidth: "200px" }}>

            <CDatePickers
              fomat="YYYY"
              variant="simple"
              picker="year"
              ValDefault={dataFilter.year}
              value={new Date(dataFilter?.year)}
              disabledDate={(current: any) => {
                // Disable dates after the current year
                return current && current.year() > moment().year();
              }}

              handleOnChange={(date: any) => {
                setModeButtonExcel(false)
                const selectedDate = moment(date?.$d);
                const selectedYear = selectedDate.format("YYYY");
                const currentYear = moment().format("YYYY");
                const currentDate = moment(); // Ngày hiện tại

                // Convert both to numbers for proper comparison
                if (Number(selectedYear) > Number(currentYear)) {
                  // Prevent selection of future years
                  alert("You cannot select a future year.");
                  return;
                }

                // If selected year is current, only allow months up to the current month
                setFromDate(selectedYear);
                setYearChoose(selectedYear);
                setDataFilter({
                  ...dataFilter,
                  year: date?.$d,
                });

                if (Number(selectedYear) === Number(currentYear) && selectedDate.isAfter(currentDate, 'month')) {
                  setModeButton(false);
                } else {
                  setModeButton(true);

                }
              }}
            />
          </div>

          <Select

            defaultValue={dataFilter.month} // Set to current month initially
            style={{ width: 150, marginLeft: "10px", boxShadow: "1px 1px 2px #c5c5c5, -1px -1px 2px #fff", borderRadius: "6px" }}
            value={dataFilter.month}
            onChange={(value) => setDataFilter({ ...dataFilter, month: Number(value) })} // Ensure 'value' is a number
            options={
              months
                .filter((month) => {
                  // Get current year and month
                  const currentYear = Number(moment().year());
                  const currentMonth = moment().month() + 1; // Month is 0-indexed, so add 1
                  const selectedYear = Number(yearChoose); // yearChoose is the selected year

                  if (selectedYear === currentYear) {
                    // Only allow months up to the current month for the current year
                    return month.value <= currentMonth;
                  }
                  // Allow all months for past years
                  return true;
                })
                .map((month) => ({
                  value: month.value, // 'month.value' is a number
                  label: month.label,
                }))
            }
            allowClear={false}
          />
        </div>



      // case 'year':
      //   return <RangePicker picker="month"  disabledDate={disabledDate} onChange={handleRangeChange} style={{width:"150px", boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff"}}/>
      default:
        return <RangePicker style={{ width: "250px", boxShadow: "1px 1px 2px #c5c5c5, -1px -1px 2px #fff" }} />;
    }
  };
  const renderRangePickerMonth = () => {
    return (
      <Row gutter={8} align="middle" style={{ flexFlow: "row", marginLeft: "10px" }}>
        <Col >
          <Select
            placeholder="Start Month"
            style={{ width: 100 }}
            onChange={handleStartMonthChange}
            value={startMonth === "01" ? "Tháng 1" : startMonth}
          >
            {months.map((month) => (
              <Option key={month.value} value={month.value} >
                {month.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <RightOutlined style={{ fontSize: '16px', color: '#dce0e6' }} />
        </Col>
        <Col>
          <Select
            placeholder="End Month"
            style={{ width: 100 }}
            onChange={handleEndMonthChange}
            value={endMonth === "12" ? "Tháng 12" : endMonth}
            disabled={!startMonth}
          >
            {months
              .filter((month) => !startMonth || month.value >= parseInt(startMonth)) // Chỉ hiển thị tháng >= start month
              .map((month) => (
                <Option key={month.value} value={month.value}>
                  {month.label}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>
    )
  }
  const generateColumns = (dates: any[], data: any[]) => {
  const newColumns = dates.map((item, index) => {
    // Kiểm tra xem có ít nhất một row có is_show === true
    const shouldIncludeColumn = data.some(row => row?.is_show === true && row.grouped?.[index]);
        

    if (!shouldIncludeColumn) return null; // Bỏ qua cột này nếu không có dòng nào được show

    const from = dayjs(item.from_date).format('DD/MM');
    const to = dayjs(item.to_date).format('DD/MM');
 const titleLabel = `Tuần ${index + 1}`; // ✅ Sửa thành "Tuần 1", "Tuần 2", ...

    return {
      title: (
        <Typography
          content={titleLabel}
          modifiers={['14x20', '800', 'center', 'uppercase']}
          styles={{ textAlign: 'right', marginRight: '6px' }}
        />
      ),
      dataIndex: `sum_result_value_${index}`,
      key: `sum_result_value_${index}`,
      width: 200,
      className: 'ant-table-column_wrap',
     render: (_: any, row: any, rowIndex: number) => {
  if (!row?.is_show) return null; // ✅ Chỉ hiển thị nếu dòng đang xét có is_show = true

  const value = row?.grouped?.[index]?.sum_result_value || 0;
  const DV = row?.target_unit;
  const color = row?.is_high_light;

  return (
    <div
      className="ant-table-column_item"
      style={{ display: 'flex', justifyContent: 'right' }}
    >
      <Typography
        content={
          DV === "%" 
            ? `${value}%` 
            : Math.floor(value).toLocaleString('vi-VN')
        }
        modifiers={['13x18', '600', 'right']}
        styles={{
          color: color ? "#f20b50" : "#070707"
        }}
      />
    </div>
  );
}

    };
  }).filter(Boolean); // Xoá cột null

  setColumns(newColumns);
};

  const generateColumns1 = (dates1: any[], data: any[]) => {
    console.log(dates1)
    const newColumns = dates1.map((item, index) => {
      const shouldShowColumn = data.some(row1 => row1?.is_show === true && row1?.grouped?.[index]);
      if (!shouldShowColumn) return null;
      
      const from = dayjs(item.from_date).format('DD/MM');
      const titleLabel = `Ngày ${from}`;
      
      return {
        title: (
          <Typography
            content={titleLabel}
            modifiers={['14x20', '800', 'center', 'uppercase']}
            styles={{ textAlign: 'center', marginRight: '6px' }}
          />
        ),
        dataIndex: `sum_result_value`,
        key: `sum_result_value`,
        width: 130,
        className: 'ant-table-column_wrap',
        render: (_: any, row: any, rowIndex: number) => {
          const filteredData = data.filter(item => item?.is_show === true);
          console.log(filteredData)
      
  if (!filteredData[rowIndex]?.is_show) return null; // ✅ Chỉ hiển thị nếu dòng đang xét có is_show = true

  const value = filteredData[rowIndex]?.grouped?.[index]?.sum_result_value || 0;
  const DV = filteredData[rowIndex]?.target_unit;
  const color = filteredData[rowIndex]?.is_high_light;


  return (
    <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'right' }}>
      <Typography
        content={DV === "%" ? value + "%" : Math.floor(value).toLocaleString('vi-VN')}
        modifiers={['13x18', '600', 'right']}
        styles={{ color: color ? "#f20b50" : "#070707" }}
      />
    </div>
  );
}

      };
    }).filter(Boolean);

    setColumns1(newColumns);
  };
    const generateColumns2 = (dates: any[], data: any[]) => {
    const newColumns = dates.map((item, index) => {
      const from = dayjs(item.from_date).format('DD/MM');
      const titleLabel = `Ngày ${from}`;

      return {
        title: (
          <Typography
            content={titleLabel}
            modifiers={['14x20', '800', 'center', 'uppercase']}
            styles={{ textAlign: 'center', marginRight: '6px' }}
          />
        ),
        dataIndex: `sum_result_value_${index}`,
        key: `sum_result_value_${index}`,
        width: 130,
        className: 'ant-table-column_wrap',
       render: (_: any, row: any, rowIndex: number) => {
          const filteredData = data.filter(item => item?.is_show === true);
          console.log(filteredData)
      
  if (!filteredData[rowIndex]?.is_show) return null; // ✅ Chỉ hiển thị nếu dòng đang xét có is_show = true

  const value = filteredData[rowIndex]?.grouped?.[index]?.sum_result_value || 0;
  const DV = filteredData[rowIndex]?.target_unit;
  const color = filteredData[rowIndex]?.is_high_light;


  return (
    <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'right' }}>
      <Typography
        content={DV === "%" ? value + "%" : Math.floor(value).toLocaleString('vi-VN')}
        modifiers={['13x18', '600', 'right']}
        styles={{ color: color ? "#f20b50" : "#070707" }}
      />
    </div>
  );
}
      };
    }).filter(Boolean);

    setColumns2(newColumns);
  };
  const dataFilterRef = useRef(dataFilter);

useEffect(() => {
  dataFilterRef.current = dataFilter;
}, [dataFilter]);

  const wsUrl = SOCKET_URL_FB;
    const [stateConnect, setStateConnect] = useState<TypeConnectSK>("disconnect");
    useEffect(() => {
      const socket = new W3CWebSocket.w3cwebsocket(wsUrl, "echo-protocol");
      socket.onopen = () => {
        setStateConnect("connected");
      };
      socket.onclose = () => {
        setStateConnect("disconnect");
      };
     
      socket.onmessage = (data: any) => {
        try {
          
          const currentDataFilter = dataFilterRef.current;
  dispatch(getReportFBADS({
    ads_account_id: currentDataFilter.ads_account_id,
    from_date: currentDataFilter.from_date,
    to_date: currentDataFilter.to_date,
  } as any));
          toast.success(JSON.parse(data.data).message)
         
         
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };
  
      socket.onerror = (error: any) => {
        setStateConnect("disconnect");
      };
  
      return () => {
        if (socket) {
          socket.close();
        }
      };
    }, [wsUrl]);

  return (
    <div className="p-business">
      <PublicLayout>
        <div className='p-business_header'>
          {/* {statisticHeader} */}
          <PublicHeader
            titlePage=""
            className="p-appointment_view_header_public"
            handleFilter={() => { }}
            isHideFilter
            isHideService
            isDial={false}
            isHideEmergency
            isClearFilter={storeisLoadingReportFBADSMaster}
            handleCleanFilter={() => {


            }}
            handleGetTypeSearch={() => { }}
            handleOnClickSearch={(data) => {

            }}
            isUseSearch
            isHideFilterMobile={false}
            handleClickFilterMobile={() => { }}

            listBtn={

              <div style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
                  <div onClick={() => {
                setIsOpenSeen(true);
              }} className="p-booking_schedule_heading_button" style={{ display: "flex", justifyContent: "center", backgroundColor:"#28a745",alignItems: "center", cursor: "pointer", marginLeft: "7px", background: "#1976D2", gap: 5, borderRadius: "5px", boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }}>
                <svg width="17px" height="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6C9 4.34315 7.65685 3 6 3H4C2.34315 3 1 4.34315 1 6V8C1 9.65685 2.34315 11 4 11H6C7.65685 11 9 9.65685 9 8V6ZM7 6C7 5.44772 6.55228 5 6 5H4C3.44772 5 3 5.44772 3 6V8C3 8.55228 3.44772 9 4 9H6C6.55228 9 7 8.55228 7 8V6Z" fill="#fff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 16C9 14.3431 7.65685 13 6 13H4C2.34315 13 1 14.3431 1 16V18C1 19.6569 2.34315 21 4 21H6C7.65685 21 9 19.6569 9 18V16ZM7 16C7 15.4477 6.55228 15 6 15H4C3.44772 15 3 15.4477 3 16V18C3 18.5523 3.44772 19 4 19H6C6.55228 19 7 18.5523 7 18V16Z" fill="#fff"></path> <path d="M11 7C11 6.44772 11.4477 6 12 6H22C22.5523 6 23 6.44772 23 7C23 7.55228 22.5523 8 22 8H12C11.4477 8 11 7.55228 11 7Z" fill="#fff"></path> <path d="M11 17C11 16.4477 11.4477 16 12 16H22C22.5523 16 23 16.4477 23 17C23 17.5523 22.5523 18 22 18H12C11.4477 18 11 17.5523 11 17Z" fill="#fff"></path> </g></svg>
                  <div>Ẩn hiện chỉ tiêu</div>
              </div>
                  <div onClick={() => {
                setDataAdd({
                  ...dataAdd,
                  ads_account_id: dataFilter.ads_account_id,
                  openFormAdd: true,
                });
              }} className="p-booking_schedule_heading_button" style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginLeft: "7px", background: "#1976D2", gap: 5, borderRadius: "5px", boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }}>
                <svg width="17px" height="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle opacity="0.5" cx="12" cy="12" r="10" stroke="#fff" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#fffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                <div>Thêm chỉ tiêu</div>
              </div>
            </div>
            }
            tabLeft={
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                <div className="p-appointment_view_filter" style={{ justifyContent: "flex-end", marginRight: "10px", marginBottom: "0px", alignItems: "end" }}>


                  <div>{renderRangePicker()}</div>
                  {/* <div>
                {
                  mode === 'month' ?   renderRangePickerMonth() : <></>
                }
              </div> */}

                  <div style={{ width: "400px", paddingLeft: "8px", paddingRight: "8px", display: "flex", justifyContent:"start", alignItems:"center" }}>

                 
                     <Dropdown3
  dropdownOption={savedData
   .filter((item: any) => item.is_use || item.value === "all")
    .map((account: any) => ({
      label: (
       <span>
    {account.ads_account_name === 'All' ? 'Tất cả' : account.ads_account_name}
    {account.ads_account_id !== 'all' && ` (${account.ads_account_id})`}
  </span>
      ),
      value: account.ads_account_id,
      value2: account,
      searchText: `${account.ads_account_name} - ${account.ads_account_id}`, // cho phép tìm kiếm theo tên hoặc id
    }))
  }
  defaultValue={savedData[0]?.ads_account_id}
  placeholder="Chọn ADS Account"
  handleSelect={(item: any) => {
    setDataFilter({
      ...dataFilter,
      ads_account_id: item.value, // hoặc item.value2.ads_account_id cũng được
    });
    dispatch(
      getReportFBADS({
        ads_account_id: item.value,
        from_date: dataFilter.from_date,
        to_date: dataFilter.to_date,
      } as any)
    );
  }}
                        variant="simple"
                       
                    />
                     <Dropdown3
                      dropdownOption={listWeek}
                      placeholder="Tuần"
                    
                      handleSelect={(item) => { 
                         generateColumns2(
        groupItemsBy1Day(storeReportFBADSMaster.data,parseInt(item.value))[1]?.grouped,
        groupItemsBy1Day(storeReportFBADSMaster.data,parseInt(item.value))
      );
                      }}
                      variant="simple"
                   //   values={(dataForm.gender as any) || undefined}
                    />

                    </div>
                  </div>

             



                {/* <CTooltip
                          placements="top"
                          title="Làm mới"
                          colorCustom="#04566e"
                        >       <div className="p-booking_schedule_heading_button" onClick={mode === "date" ? handleReportClick : handleGetMonthMiss} style={{display:"flex",justifyContent:"center", alignItems:"center" ,cursor:"pointer",marginRight:"7px",marginLeft:"7px",background:"#1976D2",boxShadow:"0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)"}}>
           <Icon iconName="clean_filter" size="20x20" style={{color:"white"}}/> 
                </div></CTooltip> */}

              </div>
            }
            isHideCleanFilter
          />
          <div className='p-business_body' style={{ display: "flex" }}>

            <div className='p-business_body_content' style={{ width: "100%", height: "calc(100vh - 150px)" }}>
{/*              
              {
                dataFilter.ads_account_id === "all" ?  TableMemoryAll : TableMemory
              } */}
              {
                TableMemory
              }
            </div>

          </div>
        </div>
      </PublicLayout>

      <CModal
        isOpen={dataUpdate.openFormUpdate}
        textOK="Cập nhật"
        confirmLoading={dataUpdate.isLoading}
        textCancel='Đóng'
        onOk={() => {
          // handleCheckInsurance();
          handleUpdateEvaluation()
        }}
        onCancel={() => {
          setDataUpdate({
            ...dataUpdate,

            openFormUpdate: false,
          })
        }}
        widths={500}
        title={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            Cập nhật mục tiêu: {dataUpdate.name}
          </div>
        }
      >
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 10 }}>
          <Typography content="Thời gian:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 70 }} />
          <RangeDateD

            variant="simple"
            handleOnChange={(from: any, to: any) => {
              setDataUpdate({
                ...dataUpdate,
                from_date: moment(from).format('YYYY-MM-DDT00:00:00'),  // giữ dưới dạng string
                to_date: moment(to).format('YYYY-MM-DDT23:59:59'),      // giữ dưới dạng string
              });


            }}
            value={{
              from: dataUpdate?.from_date,   // từ string
              to: dataUpdate?.to_date,       // từ string (chỉnh lại đúng toDate thay vì toDay)
            }}
            fomat="DD/MM/YYYY"  // Sửa "fomat" thành "format"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15 }}>
          <Typography content="Mục tiêu:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 70, marginTop: 5 }} />
          <div style={{ width: "100%" }}>
            <Input
              variant='simple'

              value={dataUpdate.target_value}
              onChange={(e: any) => {
                setDataUpdate({
                  ...dataUpdate,
                  target_value: e.target.value,
                })

              }}
              type="number"
              error={formDataErr.targetValue}
              isRequired
            />
          </div>
        </div>
      </CModal>
      <CModal
        isOpen={dataAdd.openFormAdd}
        textOK="Thêm mới"
        confirmLoading={dataAdd.isLoading}
        textCancel='Đóng'
        onOk={() => {
          // handleCheckInsurance();
          handleAddEvaluation()
        }}
        onCancel={() => {
          setDataAdd({
            ...dataAdd,
            isLoading: false,
            openFormAdd: false,
            target_value: "",
            criteria_id: "",
            ads_account_id: "",
          })
        }}
        widths={500}
        title={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            Thêm chỉ tiêu đánh giá
          </div>
        }
      >
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 10 }}>
          <Typography content="Thời gian:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90 }} />
          <div style={{ width: "100%" }}>
            <RangeDateD

              variant="simple"
              handleOnChange={(from: any, to: any) => {
                setDataAdd({
                  ...dataAdd,
                  from_date: moment(from).format('YYYY-MM-DDT00:00:00'),  // giữ dưới dạng string
                  to_date: moment(to).format('YYYY-MM-DDT23:59:59'),      // giữ dưới dạng string
                });


              }}
              value={{
                from: dataAdd?.from_date,   // từ string
                to: dataAdd?.to_date,       // từ string (chỉnh lại đúng toDate thay vì toDay)
              }}
              fomat="DD/MM/YYYY"  // Sửa "fomat" thành "format"
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15 }}>
          <Typography content="Loại chỉ tiêu:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 10 }} />
          <DropdownFb
            dropdownOption={processedOptions}
            defaultValue={processedOptions[0]}
            handleSelect={(item: any) => {
              setDataAdd({
                ...dataAdd,
                criteria_id: item.criteria_id,
              })

            }}
            variant="simple"

          />

        </div>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15, marginBottom: 10 }}>
          <Typography content="Mục tiêu:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 5 }} />
          <div style={{ width: "100%" }}>
            <Input
              variant='simple'

              value={dataAdd.target_value}
              onChange={(e: any) => {
                setDataAdd({
                  ...dataAdd,
                  target_value: e.target.value,
                })

              }}
              type="number"
              error={formDataErrA.targetValue}
              isRequired
            />
          </div>

        </div>


      </CModal>
      <CModal
        isOpen={isError}
        textOK="Đóng"
        isHideCancel
        onOk={() => {
          // handleCheckInsurance();
          setIsError(false)
        }}

        widths={500}

      >

        <Typography content="Dữ liệu không có sẵn!" modifiers={['14x20', '500', 'left', 'cg-red']} styles={{ textAlign: "center", minWidth: 90, fontSize: 30, marginTop: 20 }} />






      </CModal>
        <CModal
        isOpen={isOpenSeen}
        textOK="Cập nhật"
        textCancel="Đóng"
        onOk={() => {
          // handleCheckInsurance();
          handleUpdateHS();
        }}
        onCancel={() => {
            setIsOpenSeen(false);
        }}
        widths={800}

      >

        <div style={{ display: 'flex', gap: 24, justifyContent:"center" }}>
      {/* Left column */}
      <div style={{ width: '300px', border: '1px solid #ccc', padding: 12 }}>
       <h4>Các chỉ tiêu</h4>
        {SYMPTOMS.map((symptom) => (
          <div key={symptom.value} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>{symptom.label}</span>
            <button
              onClick={() => handleToggle(symptom)}
              style={{
                backgroundColor: isSelected(symptom) ? 'green' : 'red',
                color: 'white',
                border: 'none',
                width: 24,
                height: 24,
                borderRadius: 4,
              }}
            >
              {isSelected(symptom) ? '✓' : '+'}
            </button>
          </div>
        ))}
      </div>

      {/* Right column */}
      <div style={{  border: '1px solid #ccc', padding: 12 ,width: '300px',}}>
        <h4>Chỉ tiêu Đã Chọn</h4>
        {selectedTags.map((tag) => (
          <div
            key={tag.value}
            style={{
              backgroundColor: '#ffffcc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 12px',
              marginBottom: 4,
              borderRadius: 4,
            }}
          >
            <input type="checkbox" checked readOnly style={{ marginRight: 8 }} />
            <span style={{ flex: 1 }}>{tag.label}</span>
            <button
              onClick={() => handleRemove(tag.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'red',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>





      </CModal>
    </div>
  );
};

export default FbAds;


