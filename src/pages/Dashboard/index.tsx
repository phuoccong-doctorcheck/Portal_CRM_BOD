/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import PublicTableBusiness from 'components/molecules/PublicTableBusiness';
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { getIDADS } from 'services/api/report_plan';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getListMonitoring } from 'store/monitoring';
import { SOCKET_URL_FB, SOCKET_URL_MN } from 'utils/constants';
import W3CWebSocket from "websocket";
type TypeConnectSK = "connected" | "disconnect";

export interface FormAddTodoStep {
  id: number;
  name: string;
  isDone: boolean;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const savedDataST = JSON.parse(localStorage.getItem('dataMNST') || '[]');
  const savedDataC = JSON.parse(localStorage.getItem('dataMNC') || '[]');
   const isLoadingMonitor = useAppSelector((state) => state.Monitoring.isLoadingListMonitoring);
  const storeMonitoring = useAppSelector((state) => state.Monitoring.listMonitoring);
  const [stateDMonitor, setStateDMontor] = useState(storeMonitoring.data)
  const tableRefAppointment = useRef<HTMLDivElement>(null);
  const [dataAdd, setDataAdd] = useState({
    m_status_code: savedDataC[0]?.criteria_id,
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

  
  const { mutate: postCate } = useMutation(
    'post-footer-form',
    () => getIDADS(),
    {
      onSuccess: (data) => {
        if (data?.status) {

          console.log(data)
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀: error --> getCustomerByCustomerId:', error);
      },
    },
  );
  useEffect(() => {
     dispatch(getListMonitoring({ date: moment().format("YYYY-MM-DD"), m_type:"all"} as any));
      postCate()
        document.title = "Monitoring Services";
   }, [])
  useEffect(() => {
    setStateDMontor(storeMonitoring.data)
  }, [storeMonitoring.data])
  const columnTable = [
     {
      title: (<Typography content="STT" modifiers={['15x22', "600", "center"]} />),
      align: "center",
      dataIndex: "index",
      width: 40,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: any) => (
        <div className="ant-table-column_item">
          <Typography content={`${index + 1}`} modifiers={["15x22", "600", "center", "main"]} />
        </div>
      ),
    },
      {
        title: (<Typography content="Server" modifiers={["15x22", "600", "center", "capitalize"]} />),
        dataIndex: "server_ip_address",
        align: "center",
        width: 100,
        className: "ant-table-column_wrap",
        render: (record: any, data: any) => (
          <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
           <Typography content={record} modifiers={['15x22', '600', 'center', 'main']} />
          </div>
        ),
      },
      {
        title: (<Typography content="Loại Monitor" modifiers={["15x22", "600", "center", "capitalize"]} />),
        dataIndex: "m_type",
        align: "center",
           width: 100,
        className: "ant-table-column_wrap",
        render: (record: any, data: any) => (
          <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
           <Typography content={record} modifiers={['15x22', '600', 'center', 'main']} />
          </div>
        ),
    },
       {
        title: (<Typography content="Lần cuối thực hiện" modifiers={["15x22", "600", "center", "capitalize"]} />),
        dataIndex: "m_datetime",
        align: "center",
           width: 100,
        className: "ant-table-column_wrap",
        render: (record: any, data: any) => (
          <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
           <Typography content={moment(record).format("HH:mm DD/MM/YYYY")} modifiers={['15x22', '600', 'center', 'main']} />
          </div>
        ),
      },
      {
        title: (<Typography content="Note" modifiers={["15x22", "600", "left", "capitalize"]} styles={{marginLeft:"5px"}}/>),
        dataIndex: "m_note",
        align: "left",
           width: 600,
        className: "ant-table-column_wrap",
        render: (record: any, data: any) => (
          <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'start' }} >
           <Typography content={record} modifiers={['15x22', '600', 'center', 'main']} styles={{textTransform:"uppercase"}}/>
          </div>
        ),
      },
       {
        title: (<Typography content="Status Code" modifiers={["15x22", "600", "center", "capitalize"]} />),
        dataIndex: "m_status_code",
        align: "center",
           width: 150,
        className: "ant-table-column_wrap",
        render: (record: any, data: any) => (
          <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
         <Typography content={record} modifiers={['15x22', '600', 'center',  record === 200 ? 'green' : 'cg-red' ]} />
          </div>
        ),
      },
        {
        title: (<Typography content="Trạng thái" modifiers={["15x22", "600", "center", "capitalize"]} />),
        dataIndex: "m_status",
        align: "center",
           width: 150,
        className: "ant-table-column_wrap",
        render: (record: any, data: any) => (
          <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
           <Typography content={record} modifiers={['15x22', '600', 'center',  record === 'success' ? 'green' : 'cg-red' ]} />
          </div>
        ),
      },
  ];
    const wsUrl = SOCKET_URL_MN;
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
            
               dispatch(getListMonitoring({ date: moment().format("YYYY-MM-DD"), m_type:"all"} as any));

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
   const memoriesTable = useMemo(() => {

     
  
    
      return (
        <div className="m-form_add_customer-booking_box_table">
                <PublicTableBusiness
                  column={columnTable}
                  isHideRowSelect
                  listData={stateDMonitor}
                  rowkey="id"
                  isPagination={false}
                  isExpandable
                  showExpandColumn
                  loading={isLoadingMonitor}
                 
                  scroll={{ x: 'max-content', }}
                  tableRef={tableRefAppointment}
                  rowClassNames={(record: any, index: any) => {
                    return index % 2 === 0 ? 'bg-gay-blur' : ''
                  }}
                />
         
        </div>
      );
    }, [stateDMonitor, isLoadingMonitor]);
  return (
   
    <div style={{  width: "100%", height: "100vh", position:"relative" }}>
        <div className="" style={{
      background: "#00546e",
      width: "100%",
        height: "auto", padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <span style={{
          color:"white",
          fontSize: "20px",
          textAlign: "center",
          
          textTransform: "uppercase",
          fontWeight: "bold",
        }}>
           Danh sách monitor của các service trong ngày {moment().format("DD/MM/YYYY")}
      </span>
      </div>
    <div className='p-business_body' style={{ display: "flex" }}>

            <div className='p-business_body_content' style={{ width: "100%", height: "calc(100vh)" }}>
{/*              
              {
                dataFilter.ads_account_id === "all" ?  TableMemoryAll : TableMemory
              } */}
              {
                memoriesTable
              }
            </div>

      </div>
        <div className="p-booking_schedule_heading_button" style={{ display: "flex", position:"absolute",top:5, right:8,justifyContent: "center", alignItems: "center", cursor: "pointer", marginLeft: "7px", background: "#1976D2", gap: 5, borderRadius: "5px", boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }}>
                <svg width="17px" height="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle opacity="0.5" cx="12" cy="12" r="10" stroke="#fff" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#fffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                <div>Thêm mới</div>
              </div>
  </div>
    
  );
};
export default Dashboard;
