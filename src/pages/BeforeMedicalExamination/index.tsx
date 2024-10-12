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
import { DatePicker } from 'antd';
import { optionDate, optionDate2 } from "assets/data";
import Button from "components/atoms/Button";
import CTooltip from "components/atoms/CTooltip";
import Checkbox from 'components/atoms/Checkbox';
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import GroupRadio from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Loading from "components/atoms/Loading";
import RangeDate from "components/atoms/RangeDate";
import TextArea from "components/atoms/TextArea";
import Transfer, {
  TransferItemType,
  TransferType,
} from "components/atoms/Transfer";
import Typography from "components/atoms/Typography";
import FloatFilter from "components/molecules/FloatFilter";
import FormAddCustomer from "components/molecules/FormAddCustomer";
import FormAddContact from "components/molecules/FormBooking";
import MultiSelect from "components/molecules/MultiSelect";
import PublicTable from "components/molecules/PublicTable";
import RichTextEditor from "components/molecules/RichTextEditor";
import CModal from "components/organisms/CModal";
import PublicHeader from "components/templates/PublicHeader";
import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
import PublicLayout from "components/templates/PublicLayout";
import dayjs from 'dayjs';
import useClickOutside from "hooks/useClickOutside";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { postPrintAppointmentServicepoint } from "services/api/appointmentView";
import {
  getCustomerById,
  postAssignedToID,
  postNoteByID,
  postObjectTag,
  postSaveCustomerBeforeExams,
} from "services/api/beforeExams";
import { PayloadGetBeforeExams } from "services/api/beforeExams/types";
import { getListToStoreBeforeExams } from "store/beforeExams";
import { getInfosCustomerById } from "store/customerInfo";
import { setShowNoteComponent } from "store/example";
import { useAppDispatch, useAppSelector } from "store/hooks";
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, previewBlobPDFOpenLink } from "utils/functions";
import { localeVN } from 'utils/staticState';

const { RangePicker } = DatePicker;

export type TicketType = {
  id?: number;
  ticket_name?: string;
  desc?: string;
  start?: Date;
  end?: Date;
  level?: string;
  type?: string;
  isDone?: boolean;
};

const BeforeMedicalExamination: React.FC = () => {
  const dispatch = useAppDispatch();

  const listBeforeExams = useAppSelector((state) => state.beforeExams.beforeExamsList);
  const loadingBefore = useAppSelector((state) => state.beforeExams.loadingBefore);

  const storageTags = localStorage.getItem("tagsCustomer");
  const storagelistPhares = localStorage.getItem("listPharesBeforeExams");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const storageCSKH = localStorage.getItem("listCSKH");
  const getRoles = localStorage.getItem('roles');
  const employeeId = localStorage.getItem("employee_id");

  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [listPhares, setListPhares] = useState<DropdownData[]>(
    storagelistPhares ? JSON.parse(storagelistPhares) : ""
  );
  const [listeTags, setListeTags] = useState<TransferType[]>(
    storageTags ? JSON.parse(storageTags) : ""
  );
  const [listCSKH, setListCSKH] = useState<any[]>(
    storageCSKH ? JSON.parse(storageCSKH) : []
  );

  const [dataBeforeExam, setDataBeforeExam] = useState(listBeforeExams || []);
  const [countCustomer, setCountCustomer] = useState(listBeforeExams?.data?.count);

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isClosePopup, setIsClosePopup] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 0 });

  const [customerUpdate, setCustomerUpdate] = useState<any>();
  const [isUpdateCustomer, setIsUpdateCustomer] = useState(false);
  const [isStatisticMobile, setIsStatisticMobile] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isAddNote, setIsAddNote] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [isOpenFormContact, setIsOpenFormContact] = useState(false);

  const [isAddTag, setIsAddTag] = useState(false);
  const [dataUpdateTag, setDataUpdateTag] = useState<TransferItemType[]>();
  const [customerInfoAddTag, setCustomerInfoAddTag] = useState();

  const [contentNote, setContentNote] = useState("");
  const [isUpdateBeforeExams, setIsUpdateBeforeExams] = useState(false);
  const [filterData, setFilterData] = useState({
    fromDay: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    toDay: moment(new Date()).format('YYYY-MM-DDT23:59:59'),
    origin: undefined as unknown as DropdownData[],
    originGroup: undefined as unknown as DropdownData,
    originType: undefined as unknown as DropdownData,
    state: undefined as unknown as DropdownData,
    tag: undefined as unknown as DropdownData,
    key: "",
    yourCustomer: false,
  });

  const payloadBeforeExam: PayloadGetBeforeExams = {
    processKeyId: "all",
    launchSourceID: "all",
    launchSourceType: null,
    launchSourceGroup: null,
    followStaffId: filterData.yourCustomer ? employeeId as any : "all",
    fromDay: moment(new Date()).format("YYYY-MM-DDT00:00:00") as any,
    toDay: moment(new Date()).format("YYYY-MM-DDT23:59:59") as any,
    keyWord: "",
    pages: 1,
    limits: 500,
  };
  const bodyGetList = {
    processKeyId: filterData?.state?.value || "all",
    launchSourceID: filterData.origin?.map((i: any) => i?.id).join(","),
    launchSourceType: filterData.originType?.value,
    launchSourceGroup: filterData.originGroup?.value,
    followStaffId: filterData.yourCustomer ? employeeId as any : "all",
    keyWord: filterData?.key,
    pages: 1,
    limits: 1000,
    fromDay: moment(filterData?.fromDay).format("YYYY-MM-DDT00:00:00"),
    toDay: moment(filterData?.toDay).format("YYYY-MM-DDT23:59:59"),
  };

  const [filterColumn, setFilterColumn] = useState({
    employeeFollow: [],
  });

  const [currentItemOfTable, setCurrentItemOfTable] = useState(listBeforeExams.data.data || []);

  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(
      getListToStoreBeforeExams(
        payloadBeforeExam as unknown as PayloadGetBeforeExams
      )
    );
    setIsUpdateBeforeExams(false);
  }, []);

  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case 'follow_staff':
        uniqueValues = Array.from(new Set((listCSKH || [])?.map((item: any) => item?.label).filter(Boolean)));
        break;
      default: break;
    }

    return uniqueValues.map((value: any) => ({ text: value, value: value }));
  }

  useEffect(() => {
    setFilterColumn({
      ...filterColumn,
      employeeFollow: handleGetOptionFilterColumn('follow_staff'),
    });

  }, [dataBeforeExam, listBeforeExams]);

  useEffect(() => {
    setDataBeforeExam(listBeforeExams);
    setCurrentItemOfTable(listBeforeExams?.data?.data);
    setCountCustomer(listBeforeExams?.data?.count);
    document.title = "Chuyển đổi | CRM";
  }, [listBeforeExams]);

  /* CALL API */
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
  const { mutate: getCustomerIdToGetCurrentAppointment } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerById(data),
    {
      onSuccess: (data) => {
        console.log(data)
        if (data?.data?.master?.master_id) {
          console.log(data?.data?.master?.master_id)
          printAppointmentServicepoint(data?.data?.master?.master_id);
        }
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const { mutate: postSaveCustomer } = useMutation(
    "post-footer-form",
    (data: any) => postSaveCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setIsOpenFormContact(false);
          setTableLoading(false);
          getCustomerIdToGetCurrentAppointment({
            customer_id: data?.data,
            type: 'id',
          })
          dispatch(
            getListToStoreBeforeExams({
              ...payloadBeforeExam,
              processKeyId: "all",
              launchSourceID: "all",
              launchSourceType: null,
              launchSourceGroup: null,
              followStaffId: "all",
              fromDay: filterData?.fromDay
                ? moment(filterData.fromDay).format("YYYY-MM-DD 00:00:00")
                : (moment(new Date()).format("YYYY-MM-DDT00:00:00") as any),
              toDay: filterData?.toDay
                ? moment(filterData.toDay).format("YYYY-MM-DD 23:59:59")
                : (moment(new Date()).format("YYYY-MM-DDT23:59:59") as any),
              keyWord: filterData?.key || "",
              pages: pagination?.page || 1,
              limits: pagination?.pageSize | 30,
            } as unknown as PayloadGetBeforeExams)
          );
          toast.success(
            isUpdateCustomer
              ? "Cập nhật thông tin khách hàng thành công"
              : "Thêm khách hàng thành công"
          );
          setIsClosePopup(true);
          setIsOpenPopup(false);
        } else {
          toast.error(data.message);
          setIsClosePopup(true);
          setIsOpenPopup(false);
        }
      },
      onError: (e) => {
        toast.error("Đã có lỗi xảy ra ...!");
      },
    }
  );
  const { mutate: getCustomerByCustomerId } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerById(data),
    {
      onSuccess: (data) => {
        setCustomerUpdate(data.data);
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const { mutate: assignedToMe } = useMutation(
    "post-footer-form",
    (id: string) => postAssignedToID(id),
    {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: postTagCustomer } = useMutation(
    "post-footer-form",
    (data: any) => postObjectTag(data),
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        setIsAddTag(false);
        setTableLoading(false);
        dispatch(
          getListToStoreBeforeExams({
            processKeyId: "all",
            launchSourceID: "all",
            launchSourceType: null,
            launchSourceGroup: null,
            followStaffId: "all",
            fromDay: filterData?.fromDay
              ? moment(filterData.fromDay).format("YYYY-MM-DD 00:00:00")
              : (moment(new Date()).format("YYYY-MM-DDT00:00:00") as any),
            toDay: filterData?.toDay
              ? moment(filterData.toDay).format("YYYY-MM-DD 23:59:59")
              : (moment(new Date()).format("YYYY-MM-DDT23:59:59") as any),
            keyWord: filterData?.key || "",
            pages: pagination?.page || 1,
            limits: pagination?.pageSize | 30,
          } as unknown as PayloadGetBeforeExams)
        );
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: postNoteCustomerById } = useMutation(
    "post-footer-form",
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        setIsAddNote(false);
        dispatch(
          getListToStoreBeforeExams({
            ...payloadBeforeExam,
            processKeyId: "all",
            launchSourceID: "all",
            launchSourceType: null,
            launchSourceGroup: null,
            followStaffId: "all",
            fromDay: filterData?.fromDay
              ? moment(filterData.fromDay).format("YYYY-MM-DD 00:00:00")
              : (moment(new Date()).format("YYYY-MM-DDT00:00:00") as any),
            toDay: filterData?.toDay
              ? moment(filterData.toDay).format("YYYY-MM-DD 23:59:59")
              : (moment(new Date()).format("YYYY-MM-DDT23:59:59") as any),
            keyWord: filterData?.key || "",
            pages: pagination?.page || 1,
            limits: pagination?.pageSize | 30,
          } as unknown as PayloadGetBeforeExams)
        );
        setContentNote("");
        toast.success(data?.message);
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  /* END CALL API */

  const handleAddCustomer = async (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        setDataBeforeExam(undefined as any);
        setTableLoading(true);
        setIsClosePopup(true);
        postSaveCustomer(data);
        setIsOpenPopup(false);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleUpdateCustomer = (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        setTableLoading(true);
        postSaveCustomer(data);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleChangePagination = (pages: number, size: number) => {
    setPagination({ page: pages, pageSize: size });
    dispatch(
      getListToStoreBeforeExams({
        processKeyId: "all",
        launchSourceID: isUpdateBeforeExams
          ? filterData?.origin?.map((i: any) => i?.id).join(",")
          : "all",
        launchSourceType: filterData.originType?.value,
        launchSourceGroup: filterData.originGroup?.value,
        followStaffId: "all",
        fromDay: moment(filterData?.fromDay).format("YYYY-MM-DDT00:00:00"),
        toDay: moment(filterData?.toDay).format("YYYY-MM-DDT23:59:59"),
        keyWord: isUpdateBeforeExams ? filterData?.key : "",
        pages,
        limits: size || 30,
      } as unknown as PayloadGetBeforeExams)
    );
  };

  const handleFilterBeforeExams = (type: string, key: string, ValueField?: string) =>
    new Promise((resolve, reject) => {
      setIsUpdateBeforeExams(true);
      const body = {
        processKeyId: filterData?.state?.value || "all",
        launchSourceID: filterData?.origin?.map((i: any) => i?.id).join(","),
        launchSourceType: filterData.originType?.value,
        launchSourceGroup: filterData.originGroup?.value,
        followStaffId: type === "button" ? employeeId : "all",
        keyWord: filterData?.key || "",
        pages: 1,
        limits: 30,
      };
      try {
        switch (type) {
          case "button":
            if (
              !!filterData?.key ||
              !!filterData?.origin ||
              !!filterData?.fromDay
            ) {
              resolve(
                dispatch(
                  getListToStoreBeforeExams({
                    ...body,
                    fromDay: moment(filterData?.fromDay).format(
                      "YYYY-MM-DDT00:00:00"
                    ),
                    toDay: moment(filterData?.toDay).format(
                      "YYYY-MM-DDT23:59:59"
                    ),
                  } as unknown as PayloadGetBeforeExams)
                )
              );
            } else {
              resolve(
                dispatch(
                  getListToStoreBeforeExams({
                    ...body,
                    fromDay: moment(new Date()).format("YYYY-MM-DDT00:00:00"),
                    toDay: moment(new Date()).format("YYYY-MM-DDT23:59:59"),
                  } as unknown as PayloadGetBeforeExams)
                )
              );
            }
            break;
          default:
            resolve(
              dispatch(
                getListToStoreBeforeExams({
                  ...body,
                  fromDay: filterData?.fromDay
                    ? moment(filterData?.fromDay).format("YYYY-MM-DDT00:00:00")
                    : moment(new Date()).format("YYYY-MM-DDT00:00:00"),
                  toDay: filterData?.toDay
                    ? moment(filterData?.toDay).format("YYYY-MM-DDT23:59:59")
                    : moment(new Date()).format("YYYY-MM-DDT23:59:59"),
                  [key]: ValueField,
                } as unknown as PayloadGetBeforeExams)
              )
            );
            break;
        }
      } catch (error) {
        console.error("🚀 -> BeforeExams -> handleFilterBeforeExams -> 355:", error);
        reject(false);
      }
    });

  const handleUpdateTag = async (data: TransferItemType[]) => {
    return new Promise((resolve, reject) => {
      try {
        const newTag = data
          .filter((y: any) => y?.tag_group !== "htkh")
          ?.map((i: any) => i.tag_id);
        const tagHTKH = (customerInfoAddTag as any)?.tags
          ?.filter((y: any) => y?.tag_group === "htkh")
          ?.map((i: any) => i.tag_id);
        const body = {
          object_id: (customerInfoAddTag as any)?.is_customer_converted
            ? (customerInfoAddTag as any)?.customer_id
            : (customerInfoAddTag as any)?.lead_id,
          object_type: (customerInfoAddTag as any)?.is_customer_converted
            ? "customer"
            : "lead",
          tag_ids: [...newTag, ...tagHTKH],
        };
        setTableLoading(true);
        postTagCustomer(body);
        resolve(true);
      } catch (error) {
        console.error("🚀 ~ file: index.tsx:374:", error);
        reject(error);
      }
    });
  };

  const handleAddNoteCustomer = async () => {
    const { customer_id } = customerUpdate;
    const body = {
      customer_id,
      cs_node_type: "cs",
      cs_node_content: contentNote,
    };
    await postNoteCustomerById(body);
  };

  const handleFilterAllowStatistic = (type: string) => {
    dispatch(
      getListToStoreBeforeExams({
        processKeyId: type,
        launchSourceID:
          filterData?.origin?.map((i: any) => i?.id).join(",") || "all",
        launchSourceType: filterData.originType?.value,
        launchSourceGroup: filterData.originGroup?.value,
        followStaffId: "all",
        keyWord: filterData?.key || "",
        pages: 1,
        limits: 30,
        fromDay: isUpdateBeforeExams
          ? moment(filterData?.fromDay).format("YYYY-MM-DDT00:00:00")
          : moment(new Date()).format("YYYY-MM-DDT00:00:00"),
        toDay: isUpdateBeforeExams
          ? moment(filterData?.toDay).format("YYYY-MM-DDT23:59:59")
          : moment(new Date()).format("YYYY-MM-DDT23:59:59"),
        stausRes: "all",
      } as unknown as PayloadGetBeforeExams)
    );
  };

  const tableColumns = [
    {
      title: (<Typography content="STT" modifiers={["12x18", "500", "center", "main"]} />),
      align: "center",
      dataIndex: "index",
      width: 40,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: any) => (
        <div className="ant-table-column_item">
          < Typography content={`${index + 1}`} modifiers={['13x18', '600', 'center']} />
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày thêm KH" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "lead_conversion_date",
      align: "center",
      sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(),
      showSorterTooltip: false,
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography
            content={moment(record).format("HH:mm - DD/MM/YYYY")}
            modifiers={["13x18", "400", "center"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày đặt lịch" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "appointment_datetime",
      align: "center",
      sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(),
      showSorterTooltip: false,
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            sessionStorage.setItem("indexMenu", "101");
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography
            content={record ? moment(record).format("HH:mm - DD/MM/YYYY") : ''}
            modifiers={["13x18", "400", "center", 'green']}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Họ tên" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:"12px"}}/>),
      dataIndex: "customer_fullname",
      align: "center",
      filters: [
        { text: 'Customer (Đã đặt lịch)', value: 'customer' },
        { text: 'Lead (Để lại thông tin nhưng chưa đặt lịch)', value: 'lead' },
        { text: 'Contact (Chưa có thông tin)', value: 'contact' },
      ],
      onFilter: (value: any, record: any) => {
        if (value === 'customer' && record.is_customer_converted) {
          return record;
        }
        if (value === 'lead' && !record.is_customer_converted && record.customer_phone) {
          return record;
        }
        if (value === 'contact' && !record.is_customer_converted && !record.customer_phone) {
          return record;
        }
      },

      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            sessionStorage.setItem("indexMenu", "101");
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}
        style={{marginLeft:"13px"}}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "justify", "uppercase"]}
          />
          <Typography
            content={data.is_customer_converted ? "Customer" : !data.customer_id && !data.customer_phone ? "Contact" : "Lead (Chưa đặt lịch)"}
            modifiers={["12x18", "400", "justify", data.is_customer_converted ? "green" : !data.customer_id && !data.customer_phone ? "blueNavy" : "cg-red",]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Năm sinh" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "year_of_birth",
      align: "center",
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            sessionStorage.setItem("indexMenu", "101");
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Giới tính" modifiers={["14x20", "500", "center", "main"]} />),
      className: "ant-table-column_wrap",
      dataIndex: "gender_name",
      align: "center",
      width: 80,
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname } = data;
          if (customer_id) {
            sessionStorage.setItem("indexMenu", "101");
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record || "---"} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Số điện thoại" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "customer_phone",
      align: "center",
      width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            sessionStorage.setItem("indexMenu", "101");
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record ? record.replace(/^.{4}/, "0") : "---"} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Nguồn" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "lead_source_display",
      align: "center",
      width: 240,
      filters: filterColumn.employeeFollow?.map((group: any) => ({ text: group.text, value: group.value })),
      onFilter: (value: any, record: any) => {
        return record?.follow_staff?.name == value
      },
      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            sessionStorage.setItem("indexMenu", "101");
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={["14x20", "600", "center"]} />
          {data.follow_staff && (
            <Typography
              content={`Follow: ${data.follow_staff.name}`}
              modifiers={["12x18", "400", "left", "green"]}
            />
          )}
        </div>
      ),
    },
    {
      title: (<Typography content="Tags/ Ghi chú" modifiers={["14x20", "500", "center", "main"]} />),
      width: 360,
      dataIndex: "lead_note",
      align: "center",
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => {
        const { tags } = data;
        return (
          <div style={{ fontSize: 12 }} className="ant-table-column_item" onClick={() => {
            const { customer_id, customer_fullname, ...prevData } = data;
            if (customer_id) {
              sessionStorage.setItem("indexMenu", "101");
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}>
            <div className={mapModifiers("p-apointment_list_schedule_table_note")} >
              {!!tags.length &&
                tags.map((note: any) => {
                  if (note?.tag_group !== "htkh") {
                    return (
                      <div
                        className={mapModifiers(
                          "p-apointment_list_schedule_table_note_item"
                        )}
                        key={note?.cs_node_id}
                      >
                        {note?.tag_name}
                      </div>
                    );
                  }
                })}
            </div>
            {!data?.lead_note?.trim() ? null : (
              <RichTextEditor
                data={data?.lead_note}
                isDisabled
                typeText={"notuseHeaderCustom"}
              />
            )}
          </div>
        );
      },
    },
    {
      title: (<Typography content="Trạng thái" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "",
      align: "center",
      width: 170,
      filters: listPhares?.map((group: any) => ({ text: group.label, value: group.label })),
      onFilter: (value: any, record: any) => {
        const valueItem = listPhares?.find((i: any) => i?.label === value);
        return record?.process_key_id === valueItem?.value;
      },
      render: (record: any, data: any) => {
        const { process_key_id } = data;
        const valueItem = listPhares?.find((i: any) => i?.value === process_key_id);
        const check = ['TRKM', 'TRKQT', 'TRKTN'].includes((valueItem as any)?.id)
        return (
          <Typography content={valueItem?.label} modifiers={['400', 'uppercase', check ? 'blueNavy' : valueItem?.id === 'TRKDHL' ? 'cg-red' : 'green',]} />
        );
      },
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
        <CTooltip placements={"topLeft"} title={'Ghi chú'}>
          <div className={mapModifiers("p-appointment_view_column_pdf")} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Icon
              iconName={"note_crm"}
              isPointer
              onClick={() => {
                setIsAddNote(true);
                setCustomerUpdate(data);
              }}
            />
          </div>
        </CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
        <CTooltip placements={"topLeft"} title={'Tiếp nhận'}>
          <div className={mapModifiers("p-appointment_view_column_pdf")} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Icon
              iconName={"accept_crm_feild"}
              isPointer
              onClick={async () => {
                await assignedToMe(data?.lead_id);
              }}
            />
          </div>
        </CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
        <CTooltip placements={"topLeft"} title={'Gắn tags'}>
          <div className={mapModifiers("p-appointment_view_column_pdf")} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Icon
              iconName={"hook_tag"}
              isPointer
              onClick={() => {
                setCustomerInfoAddTag(data);
                setDataUpdateTag(
                  data.tags?.filter((i: any) => i?.tag_group !== "htkh")
                );
                setIsAddTag(true);
              }}
            />
          </div>
        </CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
        <CTooltip placements={"topLeft"} title={!data.is_customer_converted ? 'Cập nhật thông tin Lead' : 'Cập nhật thông tin khách hàng'}>
          <div className={mapModifiers("p-appointment_view_column_pdf")} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Icon
              iconName={"edit_crm"}
              isPointer
              onClick={() => {
                if (!data.is_customer_converted) {
                  setCustomerUpdate(data);
                  setIsClosePopup(false);
                  setIsUpdateCustomer(true);
                  setIsOpenPopup(true);
                } else {
                  getCustomerByCustomerId({ customer_id: data.customer_id, });
                  setIsClosePopup(false);
                  setIsUpdateCustomer(true);
                  setIsOpenPopup(true);
                }
              }}
            />
          </div>
        </CTooltip>
      ),
    },
  ];
  const tableBeforeExams = useMemo(
    () => (
      <PublicTable
        loading={loadingBefore || tableLoading}
        column={tableColumns}
        listData={dataBeforeExam?.data?.data}
        isHideRowSelect
        scroll={{
          x: dataBeforeExam?.data?.data.length ? 'max-content' : '100%',
          y: '400px',
        }}
        size="middle"
        rowkey="lead_id"
        isPagination={false}
        pageSizes={1000}
        rowClassNames={(record, index) => {
          if (
            _.isNull(record?.lead_convert_customer_date) &&
            _.isNull(record?.customer_phone)
          ) {
            return `p-apointment_list_row_item_contact ${index % 2 === 0 ? 'bg-gay-blur' : ''}`;
          }
          if (
            _.isNull(record?.lead_convert_customer_date) &&
            !_.isNull(record?.customer_phone)
          ) {
            return `p-apointment_list_row_item_lead ${index % 2 === 0 ? 'bg-gay-blur' : ''}`;
          }
          return `p-apointment_list_row_item_customer ${index % 2 === 0 ? 'bg-gay-blur' : ''}`;
        }}
        handleChangePagination={(page: any, pageSize: any) => {
          handleChangePagination(page, pageSize);
        }}
        totalItem={
          (listBeforeExams?.status &&
            listBeforeExams?.data?.paging?.total_count) ||
          0
        }
        handleOnchange={(pagination: any, filters: any, sorter: any, extra: any) => {
          if (Object.values(filters).every(value => value === null)) {
            setCurrentItemOfTable(listBeforeExams.data.data);
          } else {
            setCurrentItemOfTable(extra.currentDataSource);
          }
        }}
      />
    ),
    [dataBeforeExam?.data?.data, loadingBefore]
  );

  const statisticHeader = useMemo(
    () => (
      <PublicHeaderStatistic handleClick={(data: any) => { }} title="Chuyển đổi" isStatistic={false} valueRangeDate={{ from: new Date(), to: new Date(), }} >
        {
          stateBreakPoint > 924 ?
            <div className={mapModifiers("p-apointment_list_total")}>
              <div className={mapModifiers("p-apointment_list_total")}>
                <div className="p-apointment_list_total_item">
                  <span>
                    Tổng:{" "}
                    <strong style={{ color: "#f00" }}>
                      {dataBeforeExam?.data?.paging?.total_count}
                    </strong>
                  </span>
                </div>
                <div className="p-apointment_list_total_item">
                  <span>
                    Contact:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.contact_count}
                    </strong>
                  </span>
                </div>
                <div className="p-apointment_list_total_item">
                  <span>
                    Lead:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.lead_count}
                    </strong>
                  </span>
                </div>
                <div className="p-apointment_list_total_item">
                  <span>
                    Customer:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.customer_count}
                    </strong>
                  </span>
                </div>
                <div
                  className={mapModifiers("p-apointment_list_total_item", "hover")}
                >
                  <span>
                    Quan Tâm:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.qt_count}
                    </strong>
                  </span>
                </div>
                <div
                  className={mapModifiers("p-apointment_list_total_item", "hover")}
                >
                  <span>
                    Cân nhắc:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.cn_count}
                    </strong>
                  </span>
                </div>
                <div
                  className={mapModifiers("p-apointment_list_total_item", "hover")}
                >
                  <span>
                    Cho SĐT:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.csdt_count}
                    </strong>
                  </span>
                </div>
                <div
                  className={mapModifiers("p-apointment_list_total_item", "hover")}
                >
                  <span>
                    Đặt hẹn:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.dh_count}
                    </strong>
                  </span>
                </div>
                <div
                  className={mapModifiers("p-apointment_list_total_item", "hover")}
                >
                  <span>
                    Hủy lịch:{" "}
                    <strong style={{ color: "#f00" }}>
                      {countCustomer?.hl_count}
                    </strong>
                  </span>
                </div>
              </div>
            </div> : (
              <>
                <div onClick={() => {
                  setIsStatisticMobile(true)
                }}>
                  <Icon iconName="stats" isPointer />
                </div>
                <FloatFilter position="right" open={isStatisticMobile} headerTitle="Bộ lọc" handleClose={() => setIsStatisticMobile(false)}>
                  <div className={mapModifiers("p-apointment_list_total", isStatisticMobile && 'mobile')}>
                    <div className="p-apointment_list_total_item">
                      <span>
                        Tổng:{" "}
                        <strong style={{ color: "#f00" }}>
                          {dataBeforeExam?.data?.paging?.total_count}
                        </strong>
                      </span>
                    </div>
                    <div className="p-apointment_list_total_item">
                      <span>
                        Contact:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.contact_count}
                        </strong>
                      </span>
                    </div>
                    <div className="p-apointment_list_total_item">
                      <span>
                        Lead:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.lead_count}
                        </strong>
                      </span>
                    </div>
                    <div className="p-apointment_list_total_item">
                      <span>
                        Customer:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.customer_count}
                        </strong>
                      </span>
                    </div>
                    <div
                      className={mapModifiers("p-apointment_list_total_item", "hover")}
                      onClick={() => {
                        handleFilterAllowStatistic("TRKM");
                      }}
                    >
                      <span>
                        Quan Tâm:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.qt_count}
                        </strong>
                      </span>
                    </div>
                    <div
                      className={mapModifiers("p-apointment_list_total_item", "hover")}
                      onClick={() => {
                        handleFilterAllowStatistic("TRKQT");
                      }}
                    >
                      <span>
                        Cân nhắc:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.cn_count}
                        </strong>
                      </span>
                    </div>
                    <div
                      className={mapModifiers("p-apointment_list_total_item", "hover")}
                      onClick={() => {
                        handleFilterAllowStatistic("TRKTN");
                      }}
                    >
                      <span>
                        Cho SĐT:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.csdt_count}
                        </strong>
                      </span>
                    </div>
                    <div
                      className={mapModifiers("p-apointment_list_total_item", "hover")}
                      onClick={() => {
                        handleFilterAllowStatistic("TRKDDL");
                      }}
                    >
                      <span>
                        Đặt hẹn:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.dh_count}
                        </strong>
                      </span>
                    </div>
                    <div
                      className={mapModifiers("p-apointment_list_total_item", "hover")}
                      onClick={() => {
                        handleFilterAllowStatistic("TRKDHL");
                      }}
                    >
                      <span>
                        Hủy lịch:{" "}
                        <strong style={{ color: "#f00" }}>
                          {countCustomer?.hl_count}
                        </strong>
                      </span>
                    </div>
                  </div>
                </FloatFilter>
              </>
            )
        }
      </PublicHeaderStatistic>
    ),
    [countCustomer, isStatisticMobile, stateBreakPoint]
  );

  return (
    <div className="p-apointment_list">
      <PublicLayout widthScreen={stateBreakPoint}>
        <div className="p-apointment_list_schedule">
          {isLoading ? (
            <Loading variant="max_content" isShow size="medium" />
          ) : (
            <>
              <PublicHeader
                titlePage=""
                className="p-apointment_list_schedule_header_top_action"
                handleFilter={() => { }}
                isHideFilter
                isClearFilter={loadingBefore || tableLoading}
                handleGetTypeSearch={() => { }}
                handleCleanFilter={() => {
                  setIsUpdateBeforeExams(false);
                  dispatch(
                    getListToStoreBeforeExams(
                      payloadBeforeExam as unknown as PayloadGetBeforeExams
                    )
                  );
                  setFilterData({
                    ...filterData,
                    key: "",
                    fromDay: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
                    toDay: moment(new Date()).format('YYYY-MM-DDT23:59:59'),
                    origin: undefined as unknown as DropdownData[],
                    originGroup: undefined as unknown as DropdownData,
                    originType: undefined as unknown as DropdownData,
                    state: undefined as unknown as DropdownData,
                    tag: undefined as unknown as DropdownData,
                  });
                }}
                tabBottomRight={
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 8
                  }}>
                    {
                      (listRoles?.some((role: any) => role?.role_name === 'directer')) &&
                      <div className="p-apointment_list_filter_bottom_total">
                        <span>Tìm thấy: <strong style={{ color: '#f00' }}>{currentItemOfTable?.length || 0} </strong>Khách hàng</span>
                      </div>
                    }
                    <Checkbox
                      isCheckCustom
                      label="KH Tôi phụ trách"
                      className={filterData.yourCustomer ? 'active' : ''}
                      checked={filterData.yourCustomer}
                      onChange={(data: any) => {
                        setFilterData({
                          ...filterData,
                          yourCustomer: data?.target?.checked,
                        });
                        if (data?.target?.checked) {
                          handleFilterBeforeExams("button", "", "")
                        } else {
                          dispatch(
                            getListToStoreBeforeExams({
                              ...bodyGetList,
                              followStaffId: "all",
                            } as unknown as PayloadGetBeforeExams)
                          );
                        }
                      }} />
                  </div>
                }
                listBtn={
                  <>

                    {stateBreakPoint < 1024 ?
                      <Button
                        modifiers={["orange"]}
                        onClick={() => {
                          setIsOpenFormContact(true);
                        }}
                      >
                        {
                          stateBreakPoint < 1024 ?
                            <Icon iconName="add" size="20x20" />
                            :
                            <Typography
                              content="Thêm khách hàng"
                              modifiers={["400"]}
                            />
                        }
                      </Button> :
                      <Button
                        modifiers={["foreign"]}
                        onClick={async () => {
                          await setIsClosePopup(false);
                          setIsOpenPopup(true);
                        }}
                      >
                        {
                          stateBreakPoint < 1440 ?
                            <Icon iconName="add" size="20x20" />
                            :
                            <Typography
                              content="Thêm khách hàng"
                              modifiers={["400"]}
                            />
                        }
                      </Button>
                    }

                  </>
                }
                isHideFilterMobile={stateBreakPoint < 910}
                isHideService={stateBreakPoint < 910}
                handleClickFilterMobile={() => { }}
                tabLeft={
                  <div className="p-apointment_list_filter">
                    <RangeDate
                      variant='simple'
                      value={{
                        from: filterData?.fromDay,
                        to: filterData?.toDay,
                      }}
                      defaultValue={{
                        from: filterData?.fromDay,
                        to: filterData?.toDay,
                      }}
                      handleOnChange={(from: any, to: any) => {
                        setFilterData({ ...filterData, fromDay: from, toDay: to, });
                        dispatch(getListToStoreBeforeExams({ ...bodyGetList, fromDay: moment(from).format("YYYY-MM-DDT00:00:00"), toDay: moment(to).format("YYYY-MM-DDT23:59:59"), } as unknown as PayloadGetBeforeExams));
                      }}
                    />
                    {stateBreakPoint > 930 &&
                      <GroupRadio
                        options={optionDate2}
                        defaultVal={optionDate2.find((i) => new Date(i.value as any).valueOf() === new Date(filterData?.fromDay as any).valueOf())}
                        value={optionDate2.find((i) => new Date(i.value as any).valueOf() === new Date(filterData?.fromDay as any).valueOf())}
                        handleOnchangeRadio={(e) => {
                          setFilterData({
                            ...filterData,
                            fromDay: moment(e.value).format("YYYY-MM-DDT00:00:00"),
                            toDay: moment(e.value).format("YYYY-MM-DDT23:59:59"),
                          });
                          dispatch(
                            getListToStoreBeforeExams({
                              ...bodyGetList,
                              fromDay: moment(e.value).format("YYYY-MM-DDT00:00:00"),
                              toDay: moment(e.value).format("YYYY-MM-DDT23:59:59"),
                            } as unknown as PayloadGetBeforeExams)
                          );
                        }}
                      />
                    }
                    <Input
                      id="search-booking"
                      type="text"
                      variant="simple"
                      value={filterData.key}
                      placeholder="Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng"
                      onChange={(event: any) => {
                        setFilterData({
                          ...filterData,
                          key: event?.target?.value,
                        });
                      }}
                      handleEnter={() => {
                        dispatch(
                          getListToStoreBeforeExams({
                            ...bodyGetList,
                            keySearch: filterData.key,
                          } as any)
                        );
                      }}
                      handleClickIcon={() => {
                        dispatch(
                          getListToStoreBeforeExams({
                            ...bodyGetList,
                            keySearch: filterData.key,
                          } as any)
                        );
                      }}
                      iconName="search"
                    />
                  </div>}
                tabBottom={(
                  <div className="p-apointment_list_filter_bottom">
                    <Dropdown
                      dropdownOption={[
                        { id: "all", label: "Tất cả", value: "all" },
                        ...listPhares,
                      ]}
                      variant="simple"
                      isColor
                      placeholder="-- Chọn giai đoạn --"
                      values={filterData.state}
                      handleSelect={(item: any) => {
                        setFilterData({ ...filterData, state: item });
                        dispatch(
                          getListToStoreBeforeExams({
                            ...bodyGetList,
                            processKeyId: item?.value,
                          } as unknown as PayloadGetBeforeExams)
                        );
                      }}
                    />
                    <Dropdown
                      dropdownOption={stateLaunchSourceGroups}
                      variant="simple"
                      placeholder="-- Chọn nhóm nguồn --"
                      values={filterData.originGroup}
                      isColor
                      handleSelect={(item: any) => {
                        setFilterData({
                          ...filterData,
                          originGroup: item,
                        });
                        dispatch(
                          getListToStoreBeforeExams({
                            ...bodyGetList,
                            launchSourceGroup: item?.value,
                          } as unknown as PayloadGetBeforeExams)
                        );
                      }}
                    />
                    <MultiSelect
                      option={[
                        { id: 99, label: "Tất cả", value: null as any },
                        ...stateLaunchSource,
                      ]}
                      placeholder="-- Chọn nguồn --"
                      variant="simple"
                      // isColor
                      value={filterData.origin?.map((item: any) => item?.value)}
                      handleChange={(item: any) => {
                        dispatch(
                          getListToStoreBeforeExams({
                            ...bodyGetList,
                            launchSourceID: item
                              ?.map((i: any) => i?.id)
                              .join(","),
                          } as unknown as PayloadGetBeforeExams)
                        );
                        setFilterData({ ...filterData, origin: item });
                      }}
                    />
                    <Dropdown
                      dropdownOption={stateLaunchSourceTypes}
                      variant="simple"
                      isColor
                      placeholder="-- Chọn hình thức chuyển đổi --"
                      values={filterData.originType}
                      handleSelect={(item: any) => {
                        setFilterData({
                          ...filterData,
                          originType: item,
                        });
                        dispatch(
                          getListToStoreBeforeExams({
                            ...bodyGetList,
                            launchSourceType: item.value,
                          } as unknown as PayloadGetBeforeExams)
                        );
                      }}
                    />
                  </div>
                )}
              />
              <div className="p-apointment_list_statistic">
                {statisticHeader}
              </div>
              <div className="p-apointment_list_schedule_table">
                {tableBeforeExams}
              </div>
            </>
          )}
        </div>

        <CModal
          isOpen={isAddNote}
          widths={540}
          title="Cập nhật ghi chú về khách hàng"
          onCancel={() => {
            setIsAddNote(false);
          }}
          onOk={() => {
            if (contentNote.trim()) {
              handleAddNoteCustomer();
            } else {
              toast.error("Bạn không thể ghi chú mà không có nội dung");
            }
          }}
          textCancel="Hủy"
          textOK="Cập nhật"
        >
          <TextArea
            id="note_for_before_exams"
            readOnly={false}
            value={undefined}
            isResize
            defaultValue={undefined}
            handleOnchange={(e) => {
              setContentNote(e.target.value);
            }}
          />
        </CModal>
        <CModal
          isOpen={isOpenFormContact}
          widths={500}
          title="Thêm Khách Hàng Tiềm Năng"
          onCancel={() => {
            setIsOpenFormContact(false);
          }}
          zIndex={1}
          isHideFooter
        >
          <FormAddContact
            handleSubmitForm={(data) => handleUpdateCustomer(data)}
            handleClose={() => {
              setIsOpenFormContact(false);
            }}
            isCloseForm={!isOpenFormContact}
          />
        </CModal>
        {/* Update tag for customer */}
        <Transfer
          dataSource={listeTags}
          dataUpdate={dataUpdateTag}
          isOpen={isAddTag}
          widths={900}
          title="Cập nhật Tag"
          handleClose={() => setIsAddTag(false)}
          handleSubmit={(data) => {
            handleUpdateTag(data);
          }}
        />
      </PublicLayout>
      {isOpenPopup &&
        <FormAddCustomer
          isOpenPopup={isOpenPopup}
          positionDrawer="left"
          handleClosePopup={() => {
            setIsUpdateCustomer(false);
            setIsClosePopup(true);
            setIsOpenPopup(false);
          }}
          valUpdate={customerUpdate}
          isUpdate={isUpdateCustomer}
          isClose={isClosePopup}
          handleClose={() => {
            setIsUpdateCustomer(false);
            setIsClosePopup(true);
            setIsOpenPopup(false);
          }}
          handleAddCustomer={(data: any) =>
            isUpdateCustomer
              ? handleUpdateCustomer(data)
              : handleAddCustomer(data)
          }
          isHigh
        />
      }
    </div>
  );
};
export default BeforeMedicalExamination;