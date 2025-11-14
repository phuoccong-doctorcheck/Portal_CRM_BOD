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
import _, { divide, set } from "lodash";
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
import  dayjs, { Dayjs } from "dayjs";
import { dataS, growthPercent, months } from "./dataS";
import PublicTableTotal from "components/molecules/PublicTableTotal";
import PublicTableBusiness from "components/molecules/PublicTableBusiness";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ExpandableConfig } from "antd/es/table/interface";
import { exportReportPlan, getReportPlan, getReportPlanMonth } from "store/report_plan_bussiness";
import { BusinessPlanReport, ReportItem } from "services/api/report_plan/types";
import { exportExcelReportDate, exportExcelReportMonth } from "services/api/report_plan";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Option } = Select;
interface ExpandableTitleProps {
  title: any;
  expanded: boolean;
  onToggle: () => void;
  hasChildren:boolean
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
            style={{ padding: "8px",background:"transparent", }}
            className={`custom-expand-icon icon-transition ${expanded ? 'icon-expanded' : ''
              }`}
          >
           
        </span></div>}
      <div className={hasChildren === false ? 'ST1 sI2 sI3 sI4' : ''}
> {title}</div>
     
    </div>
  );
};
const BusinessPlan: React.FC = () => {
  const dispatch = useAppDispatch();
  const { makeCall } = useSip();

  const ThisYear = dayjs().year();
const LastYear = dayjs().year() - 1;

  const defaultValues = [dayjs(`${LastYear}`, 'YYYY'), dayjs(`${ThisYear}`, 'YYYY')];
  const isLoadingStatistic = useAppSelector((state) => state.appointmentMaster.isLoadingStatistic);
  const storeStatistic = useAppSelector((state) => state.appointmentMaster.statistic);
  const storeisLoadingAppointmentMaster = useAppSelector((state) => state.appointmentMaster.isLoadingAppointmentMaster);
  const storeAppointmentMaster = useAppSelector((state) => state.appointmentMaster.listAppointmentMaster);

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
  const [listAppointmentMaster, setListAppointmentMaster] = useState(storeAppointmentMaster);
  const [dataFinish, setDataFinish] = useState<AppointmentViewItem[]>(storeAppointmentMaster?.data?.data || [])
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
    year: moment().format("YYYY"),
    month:moment().month() + 1,
    launchSourceId: undefined as unknown as DropdownData,
    launchSourceGroup: undefined as unknown as DropdownData,
    keyWord: "",
  });

  const [startMonth, setStartMonth] = useState<string>('01');
  const [endMonth, setEndMonth] = useState<string>('12');
    const [endMonth2, setEndMonth2] = useState<string>('Tháng 12');
   const [missingData, setMissingData] = useState<
    Array<{ month: string; growth_rate: string }>
    >([]);
   const [dataMonth, setDataMonth] = useState<
    Array<{ month: string}>
    >([]);
  const [yearChoose, setYearChoose] = useState("2024")
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = moment().year();
  const [mode, setMode] = useState<'date' | 'month' | 'year'>('date');
  const [columnsDate, setColumns] = useState<any[]>([]);
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
  const [timer,setTimer] = useState("")
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
    dispatch(getReportPlan({ date: dataFilter.date } as any));
    generateColumns(dataFilter.date);
    document.title = "Kế hoạch kinh doanh";
  }, []);
  
  const [loadExcel,setLoadExcel] = useState(false)
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
  const handleExportDate = async () => {
    setLoadExcel(true)
    const body = {
      date:dataFilter.date
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
    <div className="t-header_wrapper-merge_customer" style={{border:"none"}}>
       {/* {missingData?.map((item: any, index: any) => ( */}
          <div className="t-header_wrapper-merge_customer_flex" style={{marginBottom:"10px"}}>
         <div style={{ minWidth: "100px", height:"100%" }}> <Typography>Tháng dự đoán</Typography></div>
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
       <div className="t-header_wrapper-merge_customer_flex" style={{ marginBottom: "10px", justifyContent:"start"}}>
         <div style={{minWidth: "100px", }}> <Typography>So với tháng</Typography></div>
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
  ), [missingData,selectedMonth])

 
  const expenseItems = dataReportDate?.filter(item => item.sequence >= 6 && item.sequence <= 8);
  const otherItems = dataReportDate?.filter(item => item.sequence < 6);
  const [stateIdArray,setStateIdArray] = useState(0)
  const columns = [
  {
    title:   <div style={{display:"flex", alignItems:"center", justifyContent:"start"}}>
      {otherItems?.map((item, index:number) => (
         <div key={item.id} style={{fontSize:"14px", padding:"8px 12px", cursor:"pointer",   background: index === stateIdArray ? "white" : "#f1f1f1", color: index === stateIdArray ? "#ff0000" : "#333", borderRight:"2px solid white"}} onClick={() => setStateIdArray(index)} >{item.item_label}</div> 
      ))}
       {expenseItems?.length >0 &&  <div  style={{fontSize:"14px", padding:"8px 12px", cursor:"pointer",background:"#f1f1f1", borderRight:"2px solid white"}}>Chi phí</div>}
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
       render: (text:any, record:any) => (
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
 
  ...columnsDate
  ];
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [recordInit, setRecordInit] = useState({
    items: [],
    id:'C1'
  })
  const [expandInit, setExpandInit] = useState(true)
  useEffect(() => {
    if (dataReportDate?.[0] !== undefined) {
       handleExpand(expandInit, dataReportDate?.[0]?.items?.[0])
    }
  }, [dataReportDate])
  useEffect(() => {
    setDataReportDate(storeReportPlan?.data?.items)
  }, [storeReportPlan])
  const handleExpand = (expanded: boolean, record: any) => {
     const currentKey = record.id;
     if (expanded) {
       // Xử lý khi mở rộng
      const parentKey = getParentKey(currentKey);
      // Nếu là thẻ cha, đóng tất cả các thẻ cha khác cùng cấp
       if (parentKey === "") {
        const siblingKeys = findSiblingKeys( dataReportDate, parentKey);
        setExpandedKeys([...expandedKeys.filter(key => !siblingKeys.includes(key)), currentKey]);
      } else {
         // Nếu là thẻ con, đóng tất cả các thẻ con khác cùng cấp
         const siblingKeys = findSiblingKeys(dataReportDate, currentKey);
         console.log(siblingKeys,dataReportDate)
        setExpandedKeys([...expandedKeys.filter(key => !siblingKeys.includes(key)), currentKey]);
      }
     } else {
      // Khi thu gọn một dòng, loại bỏ key của dòng đó khỏi expandedKeys
      setExpandedKeys((prev) =>  prev.filter((key) => key !== currentKey));
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
        console.log(item.items?.map((child: any) => child.id) )
        return item.items?.map((child: any) => child.id) || [];
      }
      if (item.items) {
        const result = findSiblingKeys(item.items, parentKey);
        if (result.length > 0) {
          console.log(result)
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
        column={columns}
        isHideRowSelect
        listData={dataReportDate?.[stateIdArray]?.items}
        rowkey="id"
        isPagination={false}
        isExpandable
        showExpandColumn
        expandedRender={(data) => {
              return (
              // <div  className="m-form_add_customer-booking_box_table_children">
               <div></div>
              // </div>
            )
          }}
        expandedRowKeys= {expandedKeys}
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
  }, [storeisLoadingAppointmentMaster, listAppointmentMaster?.data?.data, expandedKeys, example,dataReportDate,stateIdArray]);
    const [fromDates, setFromDate] = useState("2024")
  const [toDates, setToDate] = useState("")
  const statisticHeader = useMemo(
    () => (
      <PublicHeaderStatistic
         title2={
    <div style={{marginLeft:"10px"}}>
      <Icon iconName="report_crm-yellow" size="20x20" />
      
    </div>
  }
        title={`<span> <MessageOutlined style={{ fontSize: '16px', color: '#08c' }} /></span> Báo cáo kế hoạch kinh doanh Doctor Check ${fromDates !== "" ? ` ${fromDates}` : ""}`}
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
    [appointmentStatistic, storeStatistic.data, listAppointmentMaster?.data, toDates,fromDates]
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
     
        data.push({ month: months[i - 1].label});
     
    }
    return data;
  };

  const handleGetMonthMiss = () => {
    if (mode === "date") {
      setStateIdArray(0)
      dispatch(getReportPlan({ date: dataFilter.date } as any));
       generateColumns(dataFilter.date);
      setModeButtonExcel(true)
    }
    else {
      setStateIdArray(0)

      dispatch(getReportPlanMonth({ month: dataFilter.month.toString(), year: moment(dataFilter.year).format("YYYY") } as any));
         generateColumns(dataFilter.date);
        setModeButtonExcel(true)
      
    }
    // if (startMonth && endMonth) {
    //   const selectedStartMonth = parseInt(startMonth);
    //   const selectedEndMonth = parseInt(endMonth);
    //   if (selectedStartMonth <= selectedEndMonth) {
    //     const data = generateMissingData(selectedStartMonth, selectedEndMonth);
    //     const dataM = generateDataMonth(selectedStartMonth, selectedEndMonth)
    //     setMissingData(data);
    //     setDataMonth(dataM)
    //     if (data.length !== 0 && currentYear <= parseInt(yearChoose)) {
         
    //       setIsOpenGrowth(true)
    //     }
    //     else {
    //         setExample(example - 1)
    //         generateColumnsMonth(dataM)
    //         // setIsOpenGrowth(true)
    //     }
    //   }
    // }
  };
  const handleReportClick = () => {
    generateColumns(dataFilter.date);
     setExample(example + 1)
   }

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
          return  <CDatePickers
               //   onChange={handleRangeChange}
            variant="simple"
        
                  ValDefault={dataFilter.date}
                  value={new Date(dataFilter?.date)}
                  fomat="DD-MM-YYYY"
                  isShowTime={false}
                  placeholder="Chọn ngày muốn xem"
                  disabledDate={disabledDate}
            handleOnChange={(date: any) => {
                     setModeButtonExcel(false)
                  setTimer(moment(date?.$d).format("DD-MM-YYYY").toString())
                  setDataFilter({
                    ...dataFilter,
                    date:  moment(date?.$d).format("YYYY-MM-DD")
                  });
                  
                 
                  }}
                />
      case 'month':
        return <div style={{ display: "flex", alignItems:"center"}}>
          
          <div style={{width:"200px", maxWidth:"200px"}}>
            
             <CDatePickers
  fomat="YYYY"
  variant="simple"
  picker="year"
  ValDefault={dataFilter.year}
              value={new Date(dataFilter?.year)}
                disabledDate={(current:any) => {
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
  style={{ width: 150, marginLeft: "10px" ,boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff",borderRadius:"6px"}}
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
        return <RangePicker style={{width:"250px", boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff"}}/>;
    }
  };
  const renderRangePickerMonth = () => {
    return (
        <Row gutter={8} align="middle" style={{flexFlow:"row", marginLeft:"10px"}}>
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
  const handleModeChange = (e: RadioChangeEvent) => {
    setModeButtonExcel(false)
    setMode(e.target.value);
  };
const handlePrice = (data: any, i: any) => {
  // Check if item_value is null or undefined
  if (data.item_value == null) {
    return null; // Return null if item_value is null or undefined
  }
  
  // Format the item_value if it is a valid number
  return Math.floor(data.item_value).toLocaleString('vi-VN');
};
  const generateColumns = (dates: any) => {
  let newColumns = [];
   if (mode !== 'month') {
     for (let i = 0; i < 1; i++) {
       const currentDate = dates; // Only one date is provided
       const date = new Date(currentDate);
      console.log(dates)
       const day = date.getDate();
       const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
       const formattedDate = `${mode == "date" ? dataFilter.date : dataFilter.month + "-" + dataFilter.year}`;
       newColumns.push({
         title: ( 
           <Typography
             content={ "Ngày "+ dayjs(dataFilter.date ).format('DD-MM-YYYY')}
             modifiers={['14x20', '800', 'center', 'uppercase']}
             styles={{ textAlign: 'right', marginRight: '6px' }}
           />
         ),
         dataIndex: 'price',
         key: 'price',
         width: 200,
         className: 'ant-table-column_wrap',
         render: (record: any, data: any, index: any) => (
           <div
             className="ant-table-column_item"
             style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
           >
             <Typography content={handlePrice(data, i) as string} modifiers={['13x18', '600', 'right']} />
           </div>
         ),
       });
     }
   }
   else {
  
    for (let i = 0; i < 1; i++) {
       const currentDate = dates; // Only one date is provided
       const date = new Date(currentDate);
      console.log(dates)
       const day = date.getDate();
       const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
      // const formattedDate = `${mode == "date" ? dataFilter.date : dataFilter.month + "-" + dataFilter.year}`;
       newColumns.push({
         title: ( 
           <Typography
             content={"Tháng " + dataFilter.month + "-" + dataFilter.year}
             modifiers={['14x20', '800', 'center', 'uppercase']}
             styles={{ textAlign: 'right', marginRight: '6px' }}
           />
         ),
         dataIndex: 'price',
         key: 'price',
         width: 200,
         className: 'ant-table-column_wrap',
         render: (record: any, data: any, index: any) => (
           <div
             className="ant-table-column_item"
             style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
           >
             <Typography content={handlePrice(data, i) as string} modifiers={['13x18', '600', 'right']} />
           </div>
         ),
       });
     }
  }
  setColumns(newColumns);
};
 const generateColumnsMonth = (dataM:any) => {
  let newColumns = [];
  if (mode === 'month') {
    // Lặp qua mỗi tháng trong dataMonth
    for (let i = 0; i < dataM.length; i++) {

      const currentMonth = `${dataM[i].month}`
      newColumns.push({
        title: (
          <Typography
            content={currentMonth}
            modifiers={['14x20', '800', 'center', 'uppercase']}
            styles={{ textAlign: 'right', marginRight: '6px' }}
          />
        ),
        dataIndex: 'price',
        key: currentMonth,
        width: 200,
        className: 'ant-table-column_wrap',
        render: (record: any, data: any) => (
          <div
            className="ant-table-column_item"
            style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
          >
            <Typography content={handlePrice(data, i) as string} modifiers={['13x18', '600', 'right']} />
          </div>
        ),
      });
    }
  }

  setColumns(newColumns);
};



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
          isClearFilter={storeisLoadingAppointmentMaster}
          handleCleanFilter={() => {
           
       
          }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(data) => {
           
          }}
          isUseSearch
          isHideFilterMobile={false}
          handleClickFilterMobile={() => { }}
          tabLeft={
            <div className="p-appointment_view_filter">
               <Icon iconName="report_crm-yellow" size="24x24" />
              <Typography content={mode == "date" ? "Báo cáo kế hoạch kinh doanh Doctor Check ngày " + dayjs(dataFilter.date ).format('DD-MM-YYYY') : "Báo cáo kế hoạch kinh doanh Doctor Check tháng " + dataFilter.month + "-" + dataFilter.year } modifiers={['16x24', '600', 'center', 'blueNavy']} />
              
            </div>
          }
         
          listBtn={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                
                <div className="p-appointment_view_filter" style={{justifyContent:"flex-end", marginRight:"10px", marginBottom:"0px"}}>
             
              {stateBreakPoint > 600 &&
                <div className="a-group_radio"  style={{marginLeft:"0px", marginRight:"10px", height:"30px"}} >
                    <Radio.Group
                      onChange={handleModeChange}
                      // defaultValue={defaultVal?.value}
                      //disabled={isDisable}
                      value={mode}
                    >
                      <Radio key={`${handleRenderGUID()}`} value="date">
                        <Typography content="Theo ngày" styles={{ color: "#f00" }} />
                      </Radio>
                      <Radio key={`${handleRenderGUID()}`} value="month">
                        <Typography content="Theo tháng" styles={{ color: "#3471e4" }} />
                      </Radio>
                      {/* <Radio key={`${handleRenderGUID()}`} value="year">
                        <Typography content="Theo năm" styles={{ color: "#ffb301" }} />
                      </Radio> */}
                    </Radio.Group>
              </div>
              }
              <div>{renderRangePicker()}</div>
              {/* <div>
                {
                  mode === 'month' ?   renderRangePickerMonth() : <></>
                }
              </div> */}
             
                  <div style={{width:"130px",paddingLeft:"8px",paddingRight:"8px"}}>
                
                <CTooltip
                          placements="top"
                          title="Báo cáo"
                colorCustom="#04566e"
                
                >
                  {/* <div className="p-booking_schedule_heading_button" onClick={mode === "date" ? handleReportClick : handleGetMonthMiss} style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginLeft: "7px", background: "#1976D2", boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }}> */}
                     <div className="p-booking_schedule_heading_button" onClick={handleGetMonthMiss} style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginLeft: "7px", background: "#1976D2", borderRadius:"5px",boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }}>
                                 <Icon iconName="price-list" size="20x20" style={{ marginRight: "5px", color: "white" }} />  <div>Báo cáo</div>
                </div></CTooltip>
                  </div>
              </div>
              {
                modeButtonExcel === true && (
                    <div style={{width:"130px"}}>
             <CTooltip
                          placements="top"
                          title="Xuất Excel"
                          colorCustom="#04566e"
                        >  
                      <div
                        className="p-booking_schedule_heading_button"
                      style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginLeft: "7px", background: "#28a745", borderRadius:"5px",boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }}
                    onClick={() => {
                      if (mode === "date") {
                        handleExportDate()
                      }
                      else {
                        handleExportMonth()
                      }
                    
                    }}
                      >
                        {
                          loadExcel === true ?  <div className="loaderEx"></div> : <div style={{display:"flex"}}> <Icon iconName="excel" size="20x20" /> <div style={{fontSize:"12px", marginLeft:"10px"}}>Xuất Excel</div></div>
                      }
                   
                </div>
                  
                               

                </CTooltip>
                 </div>
                )
              }
                
          
              
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
         <div className='p-business_body'>
         
            <div className='p-business_body_content' style={{width:"calc(60vw)", height:"calc(100vh - 150px)"}}>
           {dataReportDate?.length === undefined ? <CEmpty description="Không có dữ liệu ...!" /> : TableMemory}
            </div>
            
        </div>
        </div>
      </PublicLayout>
      
    <CModal
        isOpen={isOpenGrowth}
        textOK="Tiếp tục"
        textCancel='Thoát'
        onOk={() => {
          // handleCheckInsurance();
          setIsOpenGrowth(false)
        }}
        onCancel={() => {
          setIsOpenGrowth(false)
        }}
        widths={500}
        title={
        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <span style={{color:"#27ACFD", fontSize:"14px", fontWeight:500, textTransform:"uppercase"}}>Dự đoán</span>
          <Select
            defaultValue="Chọn tháng"
            
              style={{ width: 100, marginLeft: "10px" }}
               onChange={(value) => setSelectedMonth(value)}
            // onChange={handleChange}
            options={months
        .filter((month) => month.value <= currentMonth) // Chỉ hiển thị các tháng <= tháng hiện tại
        .map((month) => ({
          value: month.value,
          label: month.label,
        }))}
            allowClear={false}
          />
        </div>
      }
      >
        {formMergeCustomer}
      </CModal>
    </div>
  );
};

export default BusinessPlan;


