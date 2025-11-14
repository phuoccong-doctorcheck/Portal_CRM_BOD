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
import { getMBackup } from "store/monitor_backup";
import { BackupLog } from "services/api/monitor_backup/types";
import { postAddMonitorBackup } from "services/api/monitor_backup";
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
  items: ReportItems[];
};

type GroupedItem = {
  from_date: string;
  to_date: string;
  sum_result_value: number;
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
  console.log( validValues.reduce((sum, value) => sum + value, 0),validValues.length)
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
const MonitorBackup: React.FC = () => {
  const dispatch = useAppDispatch();
  const { makeCall } = useSip();

  const ThisYear = dayjs().year();
  const LastYear = dayjs().year() - 1;
  const savedData = JSON.parse(localStorage.getItem('adsAccounts') || '[]');
  const savedDataBT = JSON.parse(localStorage.getItem('dataMNBT') || '[]');
  const savedDataSN = JSON.parse(localStorage.getItem('dataMNSN') || '[]');
  const savedDataC = JSON.parse(localStorage.getItem('adsCri') || '[]');
  const [stateSaveData, setStateSaveData] = useState(savedData)
  // useEffect(() => {
  //   setStateSaveData(savedData)
  // },[stateSaveData])
  const defaultValues = [dayjs(`${LastYear}`, 'YYYY'), dayjs(`${ThisYear}`, 'YYYY')];
  const isLoadingStatistic = useAppSelector((state) => state.appointmentMaster.isLoadingStatistic);
  const storeStatistic = useAppSelector((state) => state.appointmentMaster.statistic);
  const storeisLoadingMBackup = useAppSelector((state) => state.MonitoringBackup.isLoadingMBackup);
  const storeReportMBackup = useAppSelector((state) => state.MonitoringBackup.listMBackup);

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

  const [listReportFBADSMasterAll, setListReportFBADSMasterAll] = useState(storeReportFBADSMasterAll.data);

  const [groupedReportFBADSMaster, setGroupedReportFBADSMaster] = useState<GroupedOutput[]>([]);
  const [stateMonitorBackup, setStateMonitoBackup] = useState<BackupLog[]>(storeReportMBackup.data);
  const [isError, setIsError] = useState(false)
  const [criteriaIds, setCriteriaIds] = useState<string[]>([]);

  useEffect(() => {

    setStateMonitoBackup(storeReportMBackup.data)
   

  }, [storeReportMBackup.data])
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
    check_date: moment(new Date()).format("YYYY-MM-DD"),
    performed_by: "admin",
    system_name: "",
    backup_type: "",
    target_name: "",
    target_path: "",
    backup_size_gb: "",
    restore_result: "success",
    notes:""
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
  
 
    dispatch(getMBackup({  from_date: dataFilter.from_date, to_date: dataFilter.to_date } as any));
    
    document.title = "Monitoring Backup";
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
   // if (!handleValidateA()) return;
    setDataAdd({
      ...dataAdd,
      isLoading: true,
    })
    const body = {
      check_date: dataAdd.check_date,
      backup_size_gb: parseFloat(dataAdd.backup_size_gb),
      performed_by: dataAdd.performed_by,
      system_name: dataAdd.system_name,
      backup_type: dataAdd.backup_type,
      target_name: dataAdd.target_name,
      target_path: dataAdd.target_path,
      restore_result: dataAdd.restore_result,
      notes: dataAdd.notes,
    }
    console.log(body)
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
    (data: any) => postAddMonitorBackup(data),
    {
      onSuccess: (data) => {
        if (data.status) {
           dispatch(getMBackup({  from_date:  dataFilter.from_date, to_date: dataFilter.to_date } as any));     
          setDataAdd({
            ...dataAdd,
            isLoading: false,
            openFormAdd: false,
             check_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
    performed_by: "admin",
    system_name: savedDataSN[0].system_name,
    backup_type: savedDataBT[0].backup_type,
    target_name: "",
    target_path: "",
    backup_size_gb: "",
    restore_result: "success",
    notes:""
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
  const columns = [
    {
      title: <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
        {otherItems?.map((item, index: number) => (
          <div key={item.id} style={{ fontSize: "14px", padding: "8px 12px", cursor: "pointer", background: index === stateIdArray ? "white" : "#f1f1f1", color: index === stateIdArray ? "#ff0000" : "#333", borderRight: "2px solid white" }} onClick={() => setStateIdArray(index)} >{item.item_label}</div>
        ))}
        {expenseItems?.length > 0 && <div style={{ fontSize: "14px", padding: "8px 12px", cursor: "pointer", background: "#f1f1f1", borderRight: "2px solid white" }}>Chi phí</div>}
      </div>,
      dataIndex: 'item_label',
      width: 600,
      key: 'item_label',
      rowScope: 'row',
      fixed: "left",
      //  render: (record: any, data: any) => (
      //     <div className="ant-table-column_item ss ss1" >
      //       <Typography  content={record} modifiers={[ 'right']} />
      //     </div>
      //   ),
      render: (text: any, record: any) => (
        <ExpandableTitle
          title={
            <div className="ant-table-column_item ss ss1">
              <Typography content={text} modifiers={['right']} />
            </div>
          }
          expanded={expandedKeys.includes(record.id)}
          onToggle={() => {
            handleExpand(!expandedKeys.includes(record.id), record)
          }}
          hasChildren={record.items && record.items.length > 0}
        />
      ),
    },

    ...columnsDate,
    ...columnsDate1
  ];

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
      title: <Typography content="Ngày Backup" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center",  }} />,
      dataIndex: 'check_date',
      align: 'center',
      width: 150,
      render: (record: any, data: any) => (
        <Typography content={moment(record)?.format("DD-MM-YYYY")} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "center", fontWeight: 500 ,  paddingTop:10, paddingBottom:10}} />
      ),
    },
    {
      title: <Typography content="Người tạo" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "left" }} />,
      dataIndex: 'performed_by',
      align: 'center',
      width: 150,
      render: (record: any, data: any) => (
        <div
        
        
        >

          <Typography content={record} modifiers={['13x18', '600', 'left']} styles={{ textAlign: "left" }} />
        </div>
      ),
    },
    {
      title: <Typography content="Tên hệ thống" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
      dataIndex: 'system_name',
      align: 'center',
      width: 150, 
      render: (record: any, data: any) => (
        <div >
          <Typography content={record} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "center" }} />
        </div>
      ),
    },
    {
      title: <Typography content="Loại Backup" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
      dataIndex: 'backup_type',
      align: 'center',
      width: 150, 
      render: (record: any, data: any) => (
        <div >
          {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
          <Typography content={record} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "center" }} />
        </div>
      ),
    },
     {
      title: <Typography content="Tên" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
      dataIndex: 'target_name',
      align: 'center',
      width: 150, 
      render: (record: any, data: any) => (
        <div >
          {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
          <Typography content={record} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "center" }} />
        </div>
      ),
    },
      {
      title: <Typography content="Đường dẫn" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "left" }} />,
      dataIndex: 'target_path',
      align: 'center',
      width: 150, 
      render: (record: any, data: any) => (
        <div >
          {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
          <Typography content={record} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "left" }} />
        </div>
      ),
    },
    //    {
    //   title: <Typography content="Dung lượng backup" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
    //   dataIndex: 'backup_size_gb',
    //   align: 'center',
    //   width: 150, 
    //   render: (record: any, data: any) => (
    //     <div >
    //       {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
    //       <Typography content={record.toString() + " GB"} modifiers={['13x18', '600', 'left']} styles={{ textAlign: "center" }} />
    //     </div>
    //   ),
    // },
     {
      title: <Typography content="Trạng thái backup" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "center" }} />,
      dataIndex: 'restore_result',
      align: 'center',
      width: 150, 
      render: (record: any, data: any) => (
        <div >
          {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
          <Typography content={record.toString()} modifiers={['13x18', '600', 'left','green']} styles={{ textAlign: "center" }} />
        </div>
      ),
    },
      {
      title: <Typography content="Ghi chú" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "left" }} />,
      dataIndex: 'notes',
      align: 'center',
      width: 250, 
      render: (record: any, data: any) => (
        <div >
          {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
          <Typography content={record.toString()} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "left" }} />
        </div>
      ),
    },
  ];
    const columns2 = [
    {
      title: <Typography content="Ngày" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "left" }} />,
      dataIndex: 'criteria_name',
      align: 'center',
      width: 300, fixed: "left",
      render: (record: any, data: any) => (
        <Typography content={record + ` (${data.target_unit})`} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "left", fontWeight: 600 }} />
      ),
    },
    {
      title: <Typography content="Mục tiêu: 30 ngày" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "right" }} />,
      dataIndex: 'target_value',
      align: 'center',
      width: 150,
      fixed: "left",
      className: 'ant-table-column_wrap',
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "end"}}
          onClick={() => {
            setDataUpdate({
              ...dataUpdate,
              target_id: data.target_id,
              openFormUpdate: true,
              name: data.criteria_name,
            });
          }}
        >

          <Typography content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString()} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "right" }} />
        </div>
      ),
    },
    {
      title: <Typography content="Trung bình/ngày" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "right" }} />,
      dataIndex: 'target_value',
      align: 'center',
      width: 150, fixed: "left",
      render: (record: any, data: any) => (
        <div >
          <Typography content={data.target_unit === "%" ? getPriceTB(data) + "%" : getPriceTB(data)} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "right" }} />
        </div>
      ),
    },
    {
      title: <Typography content="Hiện tại" modifiers={['12x18', '500', 'center', 'blueNavy']} styles={{ textAlign: "right" }} />,
      dataIndex: 'target_value',
      align: 'center',
      width: 100, fixed: "left",
      render: (record: any, data: any) => (
        <div >
          {/* <Typography  content={data.target_unit === "VND" ? record.toLocaleString("vn-VN") : data.target_unit === "%" ? record + "%" : record.toString() } modifiers={['13x18', '600', 'left','green']} styles={{ textAlign:"right"}}/> */}
          <Typography content={data.target_unit === "VND" ? Ex(data) : data.target_unit === "%" ? Ex(data) + "%" : Ex(data)} modifiers={['13x18', '500', 'left']} styles={{ textAlign: "right" }} />
        </div>
      ),
    },
   
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
  const TableMemory = useMemo(() => {
    return (
      <PublicTableBusiness
        column={columns1}
        isHideRowSelect
        listData={stateMonitorBackup}
        rowkey="id"
        isPagination={false}
        isExpandable
        showExpandColumn
        loading={storeisLoadingMBackup}
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
  }, [, stateMonitorBackup,storeReportMBackup,storeisLoadingMBackup, expandedKeys, example, dataReportDate, stateIdArray]);
   const TableMemoryAll = useMemo(() => {
    return (
      <PublicTableBusiness
        column={columns2}
        isHideRowSelect
        listData={listReportFBADSMasterAll.targets}
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
  }, [storeisLoadingReportFBADSMasterAll, listReportFBADSMasterAll]);
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
    [appointmentStatistic, storeStatistic.data, toDates, fromDates]
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
           dispatch(getMBackup({  from_date:  moment(from).format('YYYY-MM-DDT00:00:00'), to_date: moment(to).format('YYYY-MM-DDT23:59:59') } as any));       
            
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
      const from = dayjs(item.from_date).format('DD/MM');
      const to = dayjs(item.to_date).format('DD/MM');
      const titleLabel = `Từ ${from} đến ${to}`;

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
          const value = data[rowIndex]?.grouped?.[index]?.sum_result_value || 0;
          const DV = data[rowIndex].target_unit
          return (
            <div
              className="ant-table-column_item"
              style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
            >
              <Typography
                content={DV === "%" ? value.toString() + "%" : value.toLocaleString('vn-VN')}
                modifiers={['13x18', '600', 'right']}
              />
            </div>
          );
        },
      };
    });

    setColumns(newColumns);
  };
  const generateColumns1 = (dates: any[], data: any[]) => {
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
          const value = data[rowIndex]?.grouped?.[index]?.sum_result_value || 0;
          const DV = data[rowIndex].target_unit
          return (
            <div
              className="ant-table-column_item"
              style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
            >
<Typography
  content={
    DV === "%" 
      ? value.toString() + "%" 
      : Math.floor(value).toLocaleString('vi-VN')
  }
  modifiers={['13x18', '600', 'right']}
/>

            </div>
          );
        },
      };
    });

    setColumns1(newColumns);
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
            handleCleanFilter={() => {


            }}
            handleGetTypeSearch={() => { }}
            handleOnClickSearch={(data) => {

            }}
            isUseSearch
            isHideFilterMobile={false}
            handleClickFilterMobile={() => { }}

            listBtn={

              <div onClick={() => {
                setDataAdd({
                  ...dataAdd,
                  ads_account_id: dataFilter.ads_account_id,
                  openFormAdd: true,
                });
              }} className="p-booking_schedule_heading_button" style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginLeft: "7px", background: "#1976D2", gap: 5, borderRadius: "5px", boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }}>
                <svg width="17px" height="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle opacity="0.5" cx="12" cy="12" r="10" stroke="#fff" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#fffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                <div>Thêm mới</div>
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
            Thêm mới
          </div>
        }
      >
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 10 }}>
          <Typography content="Thời gian:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90 }} />
          <div style={{ width: "100%" }}>
            <CDatePickers
  handleOnChange={(date: any) => {
    setDataAdd(prev => ({
      ...prev,
      check_date: moment(date?.$d).format("YYYY-MM-DD")
    }));
  }}
  variant="simple"
  value={dataAdd.check_date as any}
  fomat="YYYY-MM-DD"
  isShowTime={false}
  placeholder="Chọn ngày muốn xem"
/>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15 }}>
          <Typography content="Loại Backup:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 10 }} />
          <DropdownFb
            dropdownOption={savedDataBT}
            
            handleSelect={(item: any) => {
              setDataAdd({
                ...dataAdd,
                backup_type: item.backup_type,
              })
             
            }}
            variant="simple"

          />

        </div>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15 }}>
          <Typography content="Tên hệ thống:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 10 }} />
          <DropdownFb
            dropdownOption={savedDataSN}
         
            handleSelect={(item: any) => {
              setDataAdd({
                ...dataAdd,
                system_name: item.system_name,
              })

            }}
            variant="simple"

          />

        </div>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15, marginBottom: 10 }}>
          <Typography content="Tên:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 5 }} />
          <div style={{ width: "100%" }}>
            <Input
              variant='simple'

              value={dataAdd.target_name}
              onChange={(e: any) => {
                setDataAdd({
                  ...dataAdd,
                  target_name: e.target.value,
                })

              }}
             
          //    error={formDataErrA.targetValue}
              isRequired
            />
          </div>

        </div>
               <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15, marginBottom: 10 }}>
          <Typography content="Đường dẫn:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 5 }} />
          <div style={{ width: "100%" }}>
            <Input
              variant='simple'

              value={dataAdd.target_path}
              onChange={(e: any) => {
                setDataAdd({
                  ...dataAdd,
                  target_path: e.target.value,
                })

              }}
             
          //    error={formDataErrA.targetValue}
              isRequired
            />
          </div>

        </div>
               <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15, marginBottom: 10 }}>
          <Typography content="Dung lượng:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 5 }} />
          <div style={{ width: "100%" }}>
            <Input
              variant='simple'

              value={dataAdd.backup_size_gb}
              onChange={(e: any) => {
                setDataAdd({
                  ...dataAdd,
                  backup_size_gb: e.target.value,
                })

              }}
             type="number"
          //    error={formDataErrA.targetValue}
              isRequired
            />
          </div>

        </div>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 10, marginTop: 15, marginBottom: 10 }}>
          <Typography content="Ghi chú:" modifiers={['14x20', '500', 'left']} styles={{ textAlign: "left", minWidth: 90, marginTop: 5 }} />
          <div style={{ width: "100%" }}>
            <Input
              variant='simple'

              value={dataAdd.notes}
              onChange={(e: any) => {
                setDataAdd({
                  ...dataAdd,
                  notes: e.target.value,
                })

              }}
          //    error={formDataErrA.targetValue}
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
    </div>
  );
};

export default MonitorBackup;


