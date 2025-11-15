/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Card, DatePicker, Empty, Radio, Spin, Tabs } from 'antd';
import { optionDate, optionDate2 } from "assets/data";
import {
  interactionHistoryType,
  OptionCustomerTask,
  OptionStatusAfterExams,
} from "assets/data";
import Button from 'components/atoms/Button';
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import YearSelector2 from 'components/atoms/RangeYear2';
import Typography from 'components/atoms/Typography';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from "components/templates/PublicLayout";
import dayjs from 'dayjs';
import useClickOutside from "hooks/useClickOutside";
import Cookies from "js-cookie";
import _ from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Edit, User, Tag, Users, Calendar, Clock ,Phone, MapPin,IterationCcw} from "lucide-react"
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { ApiResponse, DashboardResponse } from 'services/api/leadReportAPI/types';
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListLeadReport, getListLeadReportDay } from 'store/leadReport';
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, previewBlobPDFOpenLink } from "utils/functions";

import DashboardPageMobile from './DashboardPageMobile';

import logoS from 'assets/images/logoS.png';
import logo from 'assets/images/short_logo.svg';
const { RangePicker } = DatePicker;


// Bucket ưu tiên: lấy từ source, nếu không có thì thử chanel

const month = [
  { id: 0, label: 'Tháng 1', value: '01' },
  { id: 1, label: 'Tháng 2', value: '02' },
  { id: 2, label: 'Tháng 3', value: '03' },
  { id: 3, label: 'Tháng 4', value: '04' }, 
  { id: 4, label: 'Tháng 5', value: '05' },
  { id: 5, label: 'Tháng 6', value: '06' },
  { id: 6, label: 'Tháng 7', value: '07' },
  { id: 7, label: 'Tháng 8', value: '08' },
  { id: 8, label: 'Tháng 9', value: '09' },
  { id: 9, label: 'Tháng 10', value: '10' },
  { id: 10, label: 'Tháng 11', value: '11' },
  { id: 11, label: 'Tháng 12', value: '12' },
]
const brand = [
  { id: 0, label: 'Facebook - Tầm Soát Bệnh', value: '131869073337682' },
  { id: 1, label: 'Facebook - Trung Tâm Nội Soi', value: '556113784260055' },
]
const defaultBrand = {
  id: 0,
  label: "Facebook - Tầm Soát Bệnh",
  value: "131869073337682",
};
interface ApiTarget {
  id: number
  page_id: string
  target_key: string
  target_value: number
  target_description: string
  target_month: number
  target_year: number
  sequence: number
}

interface TableRow {
  keyMonthly: string;     // vd: "ibwpercent_month"
  keyDaily?: string;      // vd: "ibwpercent_day"
  label: string;
  valueMonthly?: number;  // giá trị tháng
  valueDaily?: number;    // giá trị ngày
  isEditable?: boolean;
}
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate(); 
};
interface TableSection {
  title: string
  rows: TableRow[]
}
const REPORT_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiNjUxYjg2YjUtODk1YS00MmMyLWI2MjgtN2Q3MTAwOGNlMDQ5IiwidCI6ImRiNzNmYWY2LTViYzMtNDkwZC1iMGQ4LTZlZWE1ZTU4YTQ0NiIsImMiOjEwfQ%3D%3D&pageName=e7454753d5ac9ac6daa9";
const AddAimDashboardPageMobile: React.FC = () => {
  const dispatch = useAppDispatch();
  const today = new Date();
  const todayStr = today.toLocaleDateString("vi-VN"); // 14/11/2025
  const now = new Date();
const currentMonthValue = String(now.getMonth() + 1).padStart(2, "0");
const currentYear = now.getFullYear().toString();

const defaultMonth = month.find((m) => m.value === currentMonthValue);
    const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
    const [loadingPage, setLoadingPage] = useState<boolean>(true);

  const [loading, setLoading] = useState(true)
  const [isLead, setIsLead] = useState(true);
  const storeLeadReport = useAppSelector((state) => state.leadReport.listLeadReport);
   const storeLeadReportDay = useAppSelector((state) => state.leadReport.listLeadReportDay);
  const storeLeadReportLoading = useAppSelector((state) => state.leadReport.isLoadingListLeadReport);
  const storagelistPhares = localStorage.getItem("listPharesBeforeExams");
  const storageCategories = localStorage.getItem("categories");
  const storageCSKH = localStorage.getItem("listCSKH");
  const storageTouchPointLogType = localStorage.getItem("TouchPointLogType");
  const getRoles = localStorage.getItem('roles');
  const employeeId = localStorage.getItem("employee_id");
  const storestepsprocesslead = localStorage.getItem("stepsprocesslead");
  const storeListUser = localStorage.getItem("list_users");
   const storageEmployeeTeams = localStorage.getItem('employeeTeams');
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [listPhares, setListPhares] = useState<DropdownData[]>(
    storagelistPhares ? JSON.parse(storagelistPhares) : ""
  );
  const [listUsers, setListUsers] = useState<DropdownData[]>(
    storeListUser ? JSON.parse(storeListUser) : ""
  );
  const [listCSKH, setListCSKH] = useState<any[]>(
    storageCSKH ? JSON.parse(storageCSKH) : []
  );
      const [listEmployeeTeams, setListEmployeeTeams] = useState<DropdownData[]>(storageEmployeeTeams ? JSON.parse(storageEmployeeTeams || '') : undefined as any);
  const [stepsprocesslead, setStepsprocesslead] = useState<any[]>(
    storestepsprocesslead ? JSON.parse(storestepsprocesslead) : []
  );
  const [listTouchPointLogType, setListTouchPointLogType] = useState<any[]>(
    storageTouchPointLogType ? JSON.parse(storageTouchPointLogType) : []
  );
  const [listCategories, setListCategories] = useState<any[]>(
    storageCategories ? JSON.parse(storageCategories) : []
  );
 




  const params = new URLSearchParams(window.location.search);


  const [isLoading, setIsLoading] = useState(false);

const [stateEmployeeId, setStateEmployeeId] = useState<any>(() => {
  try {
    return employeeId ? JSON.parse(employeeId) : "";
  } catch {
    return employeeId || "";
  }
});
   const [data, setData] = useState<ApiResponse>(storeLeadReport)


  const [filterData, setFilterData] = useState({
  brand:  undefined as unknown as DropdownData,
  month:  undefined as unknown as DropdownData,
  year:  "2025",
});
  console.log(data.data)
 
    const [tableLoading, setTableLoading] = useState(false);



  const [isOpenModal, setIsOpenModal] = useState(false);
  const [conversation, setConversation] = useState<any>({
    category_id: undefined as unknown as DropdownData,
    guid_title: '',
    guid_content: '',
    guid_suggest: '',
    guid_status: '',
    guid_u_id: employeeId,
    tags: [],
  });

  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    document.title = "Doctor Check- Hiệu quả đặt hẹn kênh Facebook Ads";
  }, []);
  useEffect(() => {
     setFilterData({
    month:  month.find((m) => m.value === currentMonthValue) || month[0],
    brand: defaultBrand,
    year: currentYear,
  });
  dispatch( getListLeadReport({
  PageId: "131869073337682",
  Month: new Date().getMonth() + 1,   // tháng hiện tại
  Year: new Date().getFullYear(),     // năm hiện tại
}))
  },[])
  useEffect(() => {
    if (storeLeadReport.status)
    {
       setLoadingPage(false)
    console.log("storeLeadReport", storeLeadReport)
   setData(storeLeadReport)
    }
   
  }, [storeLeadReport]);

const inputRef = useRef<HTMLInputElement | null>(null);


    const [sections, setSections] = useState<TableSection[]>([])
  const [apiData, setApiData] = useState<ApiTarget[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{ key: string; col: "monthly" | "daily" } | null>(null);

  const [editValue, setEditValue] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => {
    // Chỉ select 1 lần khi input xuất hiện
   
      inputRef.current?.select();
    
  }, [editingCell]); // <- không có editValue trong dependency để tránh re-select khi nhập
  const handleUpdate = () => {
  console.log("sections", sections)
   setLoadingPage(true);
    // setFilterData({ date_from: from, date_to: to });
    console.log(filterData)
     dispatch(
      getListLeadReport({
        PageId:filterData.brand?.value,
        Month: filterData.month?.value,
        Year:filterData.year || 2025,
      }) as any
    );
  };
    const handleSeenDay = (WeekIndex:number) => {
  console.log("sections", sections)
   setLoadingPage(true);
    // setFilterData({ date_from: from, date_to: to });
    console.log(filterData)
     dispatch(
      getListLeadReportDay({
        PageId:filterData.brand?.value,
        Month: filterData.month?.value,
        Year: filterData.year || 2025,
        TableIndex: 1,
        WeekIndex:WeekIndex
      }) as any
    );
  };
  // cặp key: month ↔ day (nếu không có day, để undefined)
const KEY_PAIRS: Array<{ m: string; d?: string; label?: string }> = [
  { m: "investtotal_month", d: undefined, label: "Đầu tư" },
  { m: "ibprices_month", d: undefined, label: "Giá inbox (Đầu tư/inbox)" },
  { m: "ibwpercent_month", d: "ibwpercent_day", label: "%Inbox ấm / Inbox" },
  { m: "ibwbookpercent_month", d: "ibwbookpercent_day", label: "%Đặt hẹn / Inbox ấm" },
  { m: "checkinpercent_month", d: "checkinpercent_day", label: "%Đến khám / Đặt hẹn" },
  { m: "paymentpercent_month", d: "paymentpercent_day", label: "%Thực hiện DV / Đến khám" },
  { m: "revenueavg_month", d: "revenueavg_day", label: "Doanh thu trung bình" },
];
  // % helpers
const isPercentLabel = (label?: string) => !!label && label.includes("%");

// xác định 1 ô có phải tỷ lệ hay không theo vị trí trong bảng
const isPercentCell = (sectionIndex: number, row: TableRow) => {
  if (sectionIndex === 0) return isPercentLabel(row.label); // Bảng 1: chỉ khi label có '%'
  return true; // Bảng 2-6: luôn là tỷ lệ
};

const toDisplayValue = (val?: number | string, percent?: boolean) => {
  if (val === undefined || val === null || val === "") return "";
  const num = typeof val === "string" ? Number.parseFloat(val) : val;
  if (Number.isNaN(num)) return "";
  return percent ? num * 100 : num;
};

const fromInputValue = (val: string, percent?: boolean) => {
  const num = Number(val);
  if (Number.isNaN(num)) return undefined;
  return percent ? num / 100 : num;
};

// nhóm khác (không phải tổng quan): liệt kê theo sequence hoặc theo prefix
const SEQ_GROUP_2 = [8, 9, 10, 11]; // Inbox ấm → Đặt hẹn (day tỉ lệ)
const SEQ_GROUP_3 = [13, 14, 15];
const SEQ_GROUP_4 = [16, 17, 18, 19, 20, 21];
const SEQ_GROUP_5 = [22, 23, 25, 26, 27]; // dữ liệu bạn gửi có 25/26/27, không có 24
const SEQ_GROUP_6: string | any[] = []; // nếu có “Đến khám → Thực hiện DV (tổng)”, thêm vào đây

const toMapByKey = (arr: ApiTarget[]) =>
  arr.reduce<Record<string, ApiTarget>>((acc, it) => {
    // eslint-disable-next-line no-param-reassign
    acc[it.target_key] = it;
    return acc;
  }, {});

const toMapBySeq = (arr: ApiTarget[]) =>
  arr.reduce<Record<number, ApiTarget>>((acc, it) => {
    // eslint-disable-next-line no-param-reassign
    acc[it.sequence] = it;
    return acc;
  }, {});

// gọi trong useEffect khi `data.data` có
// const transformDataToSections = (raw: ApiTarget[]) => {
//   const byKey = toMapByKey(raw);
//   const bySeq = toMapBySeq(raw);

//   // Section 1: Tổng quan (ghép theo KEY_PAIRS)
//   const section1Rows: TableRow[] = KEY_PAIRS.map((pair) => {
//     const m = byKey[pair.m];
//     const d = pair.d ? byKey[pair.d] : undefined;

//     // label ưu tiên: cấu hình → mô tả tháng (fallback) → mô tả ngày (fallback) → key
//     const label =
//       pair.label ??
//       m?.target_description?.replace(/^Mục tiêu tháng -\s*/i, "") ??
//       d?.target_description?.replace(/^Mục tiêu\/ngày -\s*/i, "") ??
//       pair.m;

//     return {
//       keyMonthly: pair.m,
//       keyDaily: pair.d,
//       label,
//       valueMonthly: m?.target_value,
//       valueDaily: d?.target_value,
//       isEditable: true,
//     };
//   });

//   // Helper: build section rows từ danh sách sequence (không ghép cặp)
//   const buildRowsBySeq = (seqList: number[]): TableRow[] =>
//     seqList
//       .map((seq) => bySeq[seq])
//       .filter(Boolean)
//       .map((it) => ({
//         keyMonthly: it.target_key, // dùng key làm khóa ổn định
//         label: it.target_description,
//         valueMonthly: it.target_value,
//         isEditable: true,
//       }));

//   const newSections: TableSection[] = [
//     { title: "1. Tổng quan", rows: section1Rows },
//     { title: "2. Inbox ấm → Đặt hẹn", rows: buildRowsBySeq(SEQ_GROUP_2) },
//     { title: "3. Rào cản dài hạn", rows: buildRowsBySeq(SEQ_GROUP_3) },
//     { title: "4. Rào cản đặt hẹn thất bại", rows: buildRowsBySeq(SEQ_GROUP_4) },
//     { title: "5. Rào cản dài hạn khác", rows: buildRowsBySeq(SEQ_GROUP_5) },
//     ...(SEQ_GROUP_6.length
//       ? [{ title: "6. Đến khám → Thực hiện dịch vụ", rows: buildRowsBySeq(SEQ_GROUP_6) }]
//       : []),
//   ];

//   setSections(newSections);
// };

 
  const transformDataToSections = (data: ApiTarget[]) => {
   const stripPrefix = (desc: string) => {
    const patterns: RegExp[] = [
      /^Mục tiêu tháng\s*-\s*/i,
      /^Mục tiêu\/ngày\s*-\s*/i,
      /^Inbox ấm\s*(→|->)\s*Đặt hẹn\s*-\s*/i,
      /^Đặt hẹn\s*(→|->)\s*Đến khám\s*-\s*/i,
      /^Đến khám\s*(→|->)\s*Thực hiện dịch vụ\s*-\s*/i,
      /^Rào cản.*?-\s*/i,
    ];
    let out = desc?.trim() ?? "";
    for (const p of patterns) out = out.replace(p, "");
    return out;
  };

  // 👉 helper dùng cho các section 1 cột
  const toSingleColRows = (arr: ApiTarget[]): TableRow[] =>
    arr.map((i) => ({
      keyMonthly: i.target_key,
      label: stripPrefix(i.target_description), // ✅ bỏ prefix như "Rào cản... - ..."
      valueMonthly: i.target_value,
      isEditable: true,
    }));
  // Bảng 1: Mục tiêu tháng + ngày (sequence 1–12)
  const section1 = {
    title: "1. Tổng quan mục tiêu",
    rows: [] as TableRow[],
  };

  const monthlyTargets = data.filter((i) => i.target_description.startsWith("Mục tiêu tháng"));
  const dailyTargets = data.filter((i) => i.target_description.startsWith("Mục tiêu/ngày"));

  monthlyTargets.forEach((m) => {
    const metric = m.target_description.replace("Mục tiêu tháng - ", "").trim();
    const daily = dailyTargets.find((d) => d.target_description.includes(metric));
    section1.rows.push({
      keyMonthly: m.target_key,
      keyDaily: daily?.target_key,
      label: metric,
      valueMonthly: m.target_value,
      valueDaily: daily?.target_value,
      isEditable: true,
    });
  });

  // Bảng 2: Inbox ấm → Đặt hẹn (target_description chứa "Inbox ấm")
  const section2 = {
    title: "2. Inbox ấm → Đặt hẹn",
    rows:toSingleColRows(data.filter(i => i.target_description.includes("Inbox ấm"))),
  };

  // Bảng 3: Rào cản đặt hẹn thất bại (target_description chứa "Rào cản")
  const section3 = {
    title: "3. Rào cản đặt hẹn thất bại",
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Rào cản"))),
  };
  const section4 = {
    title: "4. Đặt hẹn -> Đến khám",
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Đặt hẹn -> Đến khám"))),
  };
  const section5 = {
    title: "5. Rào cản đặt hẹn mà không đến",
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Rào cản đặt hẹn mà không đến"))),
  };
  const section6 = {
    title: "6. Đến khám -> Thực hiện dịch vụ",  
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Đến khám -> Thực hiện dịch vụ"))),
  };
  const allSections: TableSection[] = [section1, section2, section3, section4, section5, section6];

// Ẩn section rỗng
const visible = allSections.filter(sec => sec.rows && sec.rows.length > 0);

setSections(visible);
};


   const handleEditEnd = () => {
    setEditingId(null)
    setEditValue("")
  }

const formatNumber = React.useCallback((v?: number | string) => {
  if (v === undefined || v === "") return "";
  const num = typeof v === "string" ? Number.parseFloat(v) : v;
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}, []);

// Tìm hàng theo key (keyMonthly hoặc keyDaily)
const findRowByKey = (key: string) => {
  for (let si = 0; si < sections.length; si += 1) {
    const r = sections[si].rows.find(
      (x) => x.keyMonthly === key || x.keyDaily === key
    );
    if (r) return { sectionIndex: si, row: r };
  }
  return null;
};

const startEdit = (key: string, col: "monthly" | "daily", value?: number | string) => {
  const found = findRowByKey(key);
  const percent = found ? isPercentCell(found.sectionIndex, found.row) : false;

  setEditingCell({ key, col });
  // hiển thị edit theo đơn vị người dùng thấy (nếu % thì *100)
  setEditValue(
    value !== undefined && value !== null ? String(toDisplayValue(value, percent)) : ""
  );
};

const commitEdit = () => {
  if (!editingCell) return;

  const { key, col } = editingCell;
  const found = findRowByKey(key);
  const percent = found ? isPercentCell(found.sectionIndex, found.row) : false;

  const newNumber = editValue === "" ? undefined : fromInputValue(editValue, percent);

  setSections((prev) =>
    prev.map((sec) => ({
      ...sec,
      rows: sec.rows.map((r) => {
        if (r.keyMonthly === key || r.keyDaily === key) {
          if (col === "monthly") return { ...r, valueMonthly: newNumber };
          return { ...r, valueDaily: newNumber };
        }
        return r;
      }),
    }))
  );

  setEditingCell(null);
  setEditValue("");
};

  // map dữ liệu gốc theo target_key để giữ id/sequence...

 



const statisticContent = useMemo(
  () => (
    <div
      style={{
        backgroundColor: "transparent",
        padding: "0px 5px",
        maxHeight: "83vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: 40,
      }}
    >
      <DashboardPageMobile dataRaw={data} handleSeenDay={handleSeenDay} dataFilter={ filterData} />
    </div>
  ),
  [data]
);
  


  return (
   <div style={{ paddingTop:10}}>
    
      <Spin
        spinning={loadingPage}
        size="large"
        indicator={
          <img
            className="loader"
            style={{ width: 70, height: 70, objectFit: "cover", backgroundColor: "transparent" }}
            src={logo}
          />
        }
      >
        <div >
          {/* Header filter của bạn vẫn giữ nguyên để dùng chung cả 2 tab (nếu muốn filter cho cả báo cáo) */}
         

          {/* ✅ Tabs chính */}
             <>
                    
             <div style={containerStyle}>
              {/* Header with Logo and Title */}
              <div style={{
                borderBottom: '3px solid #0d6abf',
                paddingBottom: '10px',
                
                display: 'grid',
                gridTemplateColumns: '1fr 1.6fr',
                
              }}>
               
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", }}>
                    <img src={logo} alt="" style={{
                  width:"60px"
                }} />
                 </div>
              
                
        
                
                  
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 0, }}>
                <div style={{maxWidth:"90%",minWidth:"90%"}}>
                  <Dropdown
                    variant="simple"
                      placeholder="-- Brand --"
                      defaultValue={{
                        id: 0,
                        label: 'Facebook - Tầm Soát Bệnh',
                        value: '131869073337682'
                      }}
                    dropdownOption={brand}
                    handleSelect={(item) => {
                      setFilterData({ ...filterData, brand: item });
                       setLoadingPage(true);
  
     dispatch(
      getListLeadReport({
        PageId:item?.value,
        Month: filterData.month?.value,
        Year:filterData.year || 2025,
      }) as any
    );
                    }}
                  />
                      </div>
                       <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap:4,maxWidth:"90%", minWidth:"90%"}}>
                <div style={{ maxWidth: "50%" ,minWidth:"48%"}}>
                  <Dropdown
                    variant="simple"
                      placeholder="-- Tháng --"
                      defaultValue={month.find(m => m.value === currentMonthValue)}
                    dropdownOption={month}
                    handleSelect={(item) => {
                      setFilterData({ ...filterData, month: item });
                         setLoadingPage(true);
  
     dispatch(
      getListLeadReport({
        PageId:filterData.brand?.value,
        Month: item?.value,
        Year:filterData.year || 2025,
      }) as any
    );
                    }}
                  />
                </div>
                <div style={{ maxWidth: "50%",minWidth:"48%" }}>
                  <YearSelector2
                    onChange={(_, __, year) => {
                        setFilterData({ ...filterData, year: year.toString() });
                           setLoadingPage(true);
  
     dispatch(
      getListLeadReport({
        PageId:filterData.brand?.value,
        Month: filterData.month?.value,
        Year:year.toString()  || 2025,
      }) as any
    );
                    }}
                  />
                </div></div>
                
                  </div>
                
   
              </div>
              
     
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:10, marginTop:5,}}>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr",paddingRight:5,paddingLeft:5,justifyContent:"space-between"}}>
                  <span style={statLabelStyle}>Tháng <strong>{filterData?.month?.value}/{filterData?.year} ({getDaysInMonth(Number(filterData?.month?.value), Number(filterData?.year))} ngày)</strong></span>
                   <span style={statLabelStyle2}> <strong>Ngày xem:  {todayStr}</strong></span>
                </div>
                <div style={{ display: 'flex',justifyContent:"center",alignItems:"center"}}>
                   <span style={statLabelStyle3}>
            Hiệu quả đặt hẹn kênh Facebook Ads
          </span>
                </div>
                    </div>
      {/* Stats Section */}
      
    </div>
                    {/* Nếu chưa chọn filter thì vẫn hiển thị Empty như bạn đang làm */}
                 
               
                      {statisticContent}
                 
                  </>
        </div>
      </Spin>
    
  </div>
  );
};

 const containerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '0px 0px',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.95fr 1fr',
    alignItems: 'center',
    marginBottom: '0px',
    gap: '20px',
    
  };



  const titleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 'normal',
    fontStyle: 'normal',fontFamily:'wf_standard-font, helvetica, arial, sans-serif',
    color: '#333333',
    flex: 1,
  };



  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #cccccc',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#666666',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px',
  };



  const statsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '80px',
    width:"82vw",
    alignItems: 'center',
    paddingTop: '10px',
    marginBottom: '15px',
    paddingLeft:10
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const statLabelStyle: React.CSSProperties = {

    fontWeight: '700',
    textAnchor: "start",
    fill: "rgb(51, 51, 51)",
    fontSize: "15px",
    fontStyle: "normal",
    
};
    const statLabelStyle3: React.CSSProperties = {

    fontWeight: '700',
    textAnchor: "start",
    fill: "rgb(51, 51, 51)",
    fontSize: "17px",
    fontStyle: "normal",
    
  };
  const statLabelStyle2: React.CSSProperties = {

    fontWeight: '500',
    textAnchor: "end",
    fill: "rgb(51, 51, 51)",
    fontSize: "15px",
    fontStyle: "normal",
    textAlign:"right"
    
  };
  const statValueStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#333333',
    fontWeight: '600',
  };

export default AddAimDashboardPageMobile;