// /* eslint-disable array-callback-return */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { PlusOutlined } from '@ant-design/icons';
// import { Progress ,List, Table } from 'antd';
// import { sendMessagetype } from 'assets/data';
// import Button from 'components/atoms/Button';
// import CDatePickers from 'components/atoms/CDatePickers';
// import CTooltip from 'components/atoms/CTooltip';
// import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
// import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
// import Icon from 'components/atoms/Icon';
// import Input from 'components/atoms/Input';
// import Typography from 'components/atoms/Typography';
// import FormAddMarketingCampaign, { AMOUNT_SMS, CampaignFormType } from 'components/molecules/FormAddMarketingCampaign';
// import PublicTable from 'components/molecules/PublicTable';
// import CDrawer from 'components/organisms/CDrawer';
// import CModal from 'components/organisms/CModal';
// import PublicHeader from 'components/templates/PublicHeader';
// import PublicLayout from 'components/templates/PublicLayout';
// import moment from 'moment';
// import React, { useLayoutEffect, useMemo, useState } from 'react';
// import { useMutation } from 'react-query';
// import { toast } from 'react-toastify';
// import { getCampaignLogs, getCampaigns, getSMSTemplates, postMakeOrUpdateCampaigns, postSendCampaign } from 'services/api/point';
// import { TemplateSMSItem } from 'services/api/point/types';
// import mapModifiers from 'utils/functions';
// import "./index.scss"


// const dataList = [
//   {
//     "group_client": "Khách Hàng F1",
//     "revenue": "100,000,000",
//     "customers": 100,
//     "successful_calls": 80
//   },
//   {
//     "group_client": "Khách Hàng F2",
//     "revenue": "200,000,000",
//     "customers": 200,
//     "successful_calls": 70
//   },
//   {
//     "group_client": "Khách Hàng F3",
//     "revenue": "300,000,000",
//     "customers": 300,
//     "successful_calls": 120
//   },
//   {
//     "group_client": "Khách Hàng WOM",
//     "revenue": "400,000,000",
//     "customers": 250,
//     "successful_calls": 100
//   },

// ]


// const data = [
//   'Doanh thu đạt 100.000.00',
//   'Có 300 khách hàng đặt lịch',
//   'Nhắn tin với 100 khách hành mới',
//   'Gọi 10 cuộc điện thoại thành công mỗi ngày',
//   'Chat lại 200 khách hàng cũ',
// ];
// const ManageKPIs: React.FC = () => {
//   const storageDoctoronline = localStorage.getItem("doctorOnline");
//     const [listDoctoronline, setListDoctoronline] = useState<DropdownData[]>(storageDoctoronline ? JSON.parse(storageDoctoronline || "") : []);
//   const [listCampaign, setListCampaign] = useState([]);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [listCampaignDetail, setListCampaignDetail] = useState([]);
//   const [roles, setRoles] = useState("Employees");

//   const [campaignDetail, setCampaignDetail] = useState<any>();
//   const [states, setStates] = useState({
//     isOpenDetailCampaign: false,
//     isLoadingGetDetailCampaign: 0,
//     isOpenDrawer: false,
//   })
//   const [campaign, setCampaign] = useState({
//     isOpen: false,
//     isOpenAddOrUpdate: false,
//     isUpdate: false,
//     nameCampaign: '',
//     statusCampaign: false,
//     id: 0,
//   })
//   const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
//   const [dataFromExcel, setDataFromExcel] = useState<CampaignFormType[]>([]);

//   const [sendSMS, setSendSMS] = useState({
//     openModal: false,
//     type: '',
//     listCS: [],
//     campaignType: sendMessagetype[0] as unknown as GroupRadioType,
//     template: undefined as unknown as DropdownData,
//     campaign: undefined as unknown as DropdownData,
//     content: '',
//     subject: '',
//   })

//   const [sendSMSEror, setSendSMSError] = useState({
//     subject: '',
//     template: '',
//     content: '',
//     campaign: ''
//   });

//   const [dataCampaign, setDataCampaign] = useState({
//     data: undefined as unknown as DropdownData[],
//     dropdown: undefined as unknown as DropdownData[],
//   });

//   useLayoutEffect(() => {
//     getCampaign();
//     getTemplateSMSOfCampaign();
//   }, [])

//   /* API */
//   const { mutate: getCampaign } = useMutation(
//     'post-footer-form',
//     () => getCampaigns(),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           setListCampaign(data?.data);
//           const newCampaign = await data?.data?.map((item: any) => {
//             return {
//               id: item.campaign_id,
//               label: item.campaign_name,
//               value: item.campaign_id,
//               active: item.is_active,
//             }
//           }).filter(Boolean);
//           setDataCampaign({
//             data: newCampaign,
//             dropdown: data?.data?.map((item: any) => {
//               if (!item.is_active) return;
//               return {
//                 id: item.campaign_id,
//                 label: item.campaign_name,
//                 value: item.campaign_id,
//                 active: item.is_active,
//               }
//             }).filter(Boolean)
//           });
//         }
//       },
//       onError: (error) => {
//         console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
//       },
//     },
//   );

//   const { mutate: getCampaignDetail } = useMutation(
//     'post-footer-form',
//     (body: any) => getCampaignLogs(body),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           setStates({ ...states, isOpenDetailCampaign: true, isLoadingGetDetailCampaign: 0 });
//           setListCampaignDetail(data?.data);
//         }
//       },
//       onError: (error) => {
//         console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
//       },
//     },
//   );

//   const { mutate: createOrUpdateCampaign } = useMutation(
//     'post-footer-form',
//     (body: any) => postMakeOrUpdateCampaigns(body),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           getCampaign();
//           setCampaign({
//             ...campaign,
//             isOpenAddOrUpdate: false,
//           })
//         }
//       },
//       onError: (error) => {
//         console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
//       },
//     },
//   );

//   const { mutate: getTemplateSMSOfCampaign } = useMutation(
//     'post-footer-form',
//     () => getSMSTemplates(),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           setTemplateSMS(data?.data?.map((item: TemplateSMSItem) => {
//             if (!item.is_used) return;
//             return {
//               id: item.id,
//               label: item.name,
//               value: item.content,
//               sms_count: item.sms_count,
//             }
//           }))
//         }
//       },
//       onError: (error) => {
//         console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
//       },
//     },
//   );

//   const { mutate: sendCampaign } = useMutation(
//     'post-footer-form',
//     (body: any) => postSendCampaign(body),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           toast.success(data?.message);
//           setSendSMS({
//             ...sendSMS,
//             openModal: false,
//             template: undefined as unknown as DropdownData,
//             campaign: undefined as unknown as DropdownData,
//             content: '',
//             subject: '',
//           })
//         } else {
//           toast.error(data?.message);
//           setSendSMS({
//             ...sendSMS,
//             openModal: false,
//             template: undefined as unknown as DropdownData,
//             campaign: undefined as unknown as DropdownData,
//             content: '',
//             subject: '',
//           })
//         }
//       },
//       onError: (error) => {
//         console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
//       },
//     },
//   );
//   /* API */

//   const handleAddOrUpdateCampaign = () => {
//     if (!campaign.nameCampaign.trim()) {
//       toast.error('Vui lòng nhập tên chiến dịch');
//       return;
//     }
//     const body = {
//       campaign_id: campaign.id,
//       campaign_name: campaign.nameCampaign,
//       is_active: campaign.statusCampaign,
//     }

//     createOrUpdateCampaign(body)
//   }

//   const handleValidateSendMessage = () => {
//     if (sendSMS.campaignType?.value === 'SMS') {
//       if (!sendSMS.subject.trim() || !sendSMS.template || !sendSMS.campaign) {
//         setSendSMSError({
//           ...sendSMSEror,
//           subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
//           template: !sendSMS.template ? 'Cần chọn template để gửi tin nhắn' : '',
//           campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : ''
//         })
//         return false;
//       }
//       return true;
//     } else {
//       if (!sendSMS.subject.trim() || !sendSMS.content?.trim()) {
//         setSendSMSError({
//           ...sendSMSEror,
//           campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : '',
//           subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
//           content: !sendSMS.content?.trim() ? 'Cần nhập nội dung tin nhắn để gửi tin nhắn' : ''
//         })
//         return false;
//       }
//       return true;
//     }
//   }

//   const handleExcuteSendMessage = () => {
//     if (!handleValidateSendMessage()) return;
//     const to = listCampaignDetail
//       .filter((i: any) => i?.status !== "OK" && !!i.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/))
//       .map((i: any) => {
//         return { customer_ref: i?.customer_ref };
//       });

//     const body = {
//       send_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
//       campaign_id: sendSMS.campaign?.value,
//       method: sendSMS.campaignType.value,
//       template_id: sendSMS.template.id || '',
//       content: sendSMS.campaignType.value === "SMS" ? sendSMS.template.value?.replace('&', 'va') : sendSMS.content?.replace('&', 'va'),
//       to: to,
//     }
//     sendCampaign(body);
//   }

//   /* Column */
//   const memoryTableKPI = useMemo(() => {
//     return (
    
//         <div className={mapModifiers("p-managekpi_table_item")} style={{width:"200px", borderRadius: '12px', border: 'none', boxShadow:"none"}}>
       
       
//               <>
//                 <div className="p-managekpi_table_item_paragraph" style={{marginTop:"0px", height:"fit-content"}}>
//                   <Typography  content="Doanh thu đạt" modifiers={["12x18", "400", "center"]} styles={{color:"#7F7E7E", fontSize:"12px"}}/>
//                 </div>
               
//         </>
//         <>
//                 <div className="p-managekpi_table_item_paragraph" style={{marginTop:"7px",height:"fit-content"}}>
//                   <Typography  content="100.000.000" modifiers={["12x18", "600", "center",'blueNavy']} styles={{ fontSize:"20px"}}/>
//                 </div>
               
//         </>
//          <>
//                 <div className="p-managekpi_table_item_paragraph" style={{marginTop:"12px",height:"fit-content"}}>
//             <Typography content={`${((100000 / 500000) * 100).toLocaleString()}% của KPI tháng`}  modifiers={["12x18", "400", "center"]} styles={{color:"#7F7E7E", fontSize:"10px",fontWeight:"300"}}/>
//                 </div>
               
//         </>
//           <>
//                 <div className="p-managekpi_table_item_paragraph" style={{marginTop:"0px",height:"fit-content"}}>
//                  <Progress percent={(100000/500000)*100}   format={(percent:any) => `${(500000000).toLocaleString()} đ`}/>
//                 </div>
               
//         </>
          
//         </div>
     
//     )
//   }, [listCampaign, states])
//   const memoryAddTableKPI = useMemo(() => {
//     return (
    
//         <div className={mapModifiers("p-managekpi_table_item2")} style={{width:"100%", borderRadius: '12px', border: 'none', boxShadow:"none",height:"fit-content",background:"transparent"}}>
       
       
//               <>
//                <div className="p-managekpi_table_item2_paragraph" style={{marginTop:"7px",height:"fit-content"}}>
//                   <Typography  content="08/2024" modifiers={["12x18", "600", "center",'black']} styles={{ fontSize:"30px"}}/>
//                 </div>
               
//         </>
//         <>
//                 <div className="p-managekpi_table_item2_paragraph" style={{marginTop:"40px",height:"fit-content", }}>
//             <div className='p-managekpi_table_item2_headerTitle' style={{ borderRadius: '10px', padding: "10px 10px", border: "1px solid #d9d9d9",background:"white", paddingLeft: "20px", paddingRight: "20px", display: "flex", alignItems:"center"}} onClick={() => setOpenAdd(true)}>
//                     <PlusOutlined style={{ fontSize: '10px', color: 'black', border: "1px solid rgba(0, 0, 0, 0.88)", padding: "3px", borderRadius: "50%",marginRight:"20px" }} />
//                     <Typography  content="Thêm KPI" modifiers={["12x18", "600", "center",'black']} styles={{ fontSize:"15px"}}/>
//                   </div>
//                 </div>
               
//         </>
//           <>
//                 <div className="p-managekpi_table_item2_paragraph" style={{marginTop:"40px",height:"fit-content"}}>
//             <List
//               className="p-managekpi_table_item2_custom-list"
//     size="small"
//     header={<div>  <Typography  content="Danh sách các KPI đã thêm trong tháng" modifiers={["12x18", "600", "center",'main']} styles={{fontWeight:700, fontSize:"16px"}}/></div>}
//     bordered
//     dataSource={data}
//     renderItem={(item, index) => (
//       <List.Item   style={{
//           cursor: 'pointer',
//           transition: 'background-color 0.3s ease',
//         }}
//         onMouseEnter={(e:any) => {
//           const target = e.currentTarget as HTMLElement;
//           target.style.backgroundColor = '#f0f0f0';
//         }}
//         onMouseLeave={(e:any) => {
//            const target = e.currentTarget as HTMLElement;
//           target.style.backgroundColor = '';
//         }}>
//          <Typography  content={`${index + 1}. ${item}`} modifiers={["12x18", "600", "center",'blueNavy']} styles={{fontWeight:600, fontSize:"14px"}}/>
        
//       </List.Item>
//     )}
//   />
//                 </div>
               
//         </>
//         </div>
     
//     )
//   }, [listCampaign, states])
//   const columnTable = [
//     {
//       title: <Typography content="Nhóm khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"center", paddingBottom:"5px", paddingTop:"5px"}}/>,
//       dataIndex: 'group_client',
//       key: 'group_client',
//       render: (record: any, data: any) => (
//         <div className="ant-table-column_item" style={{ display: 'flex', flexDirection:"column", justifyContent:"center", alignItems:"center" , paddingBottom:"5px", paddingTop:"5px"}} >
//           <Typography content={record} modifiers={['14x20', '600', 'center', 'blueNavy', 'uppercase']} />
//         </div>
//       ),
//   },
//   {
  
//     title: <Typography content="KH Mục tiêu" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"14px"}}/>,
//     dataIndex: 'revenue',
//     key: 'revenue',
//     width:320,
//       render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
//          style={{ justifyContent:"start" }}
//         >
//           <Typography  content={record} modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"end",marginRight:"12px"}}/>
//         </div>
//       ),
//   },
//   {
//     title: <Typography content="KH Thực Tế" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"14px"}}/>,
//     dataIndex: 'customers',
//     key: 'customers',
//     width:320,
//      render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
//          style={{ justifyContent:"start" }}
//         >
//           <Typography  content={record} modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"end",marginRight:"12px"}}/>
//         </div>
//       ),
//   },
//   {
//     title: <Typography content="Doanh thu dự kiến" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"14px"}}/>,
//     dataIndex: 'successful_calls',
//     key: 'successful_calls',
//     width:320,
//      render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
//          style={{ justifyContent:"start" }}
//         >
//           <Typography  content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"end",marginRight:"12px"}}/>
//         </div>
//       ),
//   },
//     {
//      title: <Typography content="Doanh thu thực tế" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"14px"}}/>,
//     dataIndex: 'successful_calls',
//     key: 'successful_calls',
//     width:320,
//      render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
//          style={{ justifyContent:"start" }}
//         >
//           <Typography  content={record} modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"end",marginRight:"12px"}}/>
//         </div>
//       ),
//     },
//      {
//      title: <Typography content="Hoa hồng dự kiến" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"14px"}}/>,
//     dataIndex: 'successful_calls',
//     key: 'successful_calls',
//     width:320,
//      render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
//          style={{ justifyContent:"start" }}
//         >
//           <Typography  content={record} modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"end",marginRight:"12px"}}/>
//         </div>
//       ),
//   },
//   ];

//     const memoryTableSeenKPI = useMemo(() => {
//     return (
    
//         <div className={mapModifiers("p-managekpi_table_item3")} style={{width:"100%", borderRadius: '12px', padding:"0px",border: 'none', boxShadow:"none",height:"fit-content",background:"transparent"}}>
        
//         <Table dataSource={dataList} columns={columnTable} rowKey="name" pagination={false}  bordered  rowClassName={(record: any, index: any) => {
//           return index % 2 === 0 ? 'bg-gay-blur' : ''
//         }}
//            summary={() => (
//            <Table.Summary>
//               <Table.Summary.Row style={{background:"#f0f0f0"}}>
//                  <Table.Summary.Cell index={6}  className="ant-table-summary-cell">
//               <Typography content="Tổng" modifiers={['16x24', '600', 'center', 'cg-red']} />
//                  </Table.Summary.Cell>
//                    <Table.Summary.Cell index={6}  className="ant-table-summary-cell">
//               <Typography content="" modifiers={['13x18', '600', 'right', 'main']} />
//                  </Table.Summary.Cell>
//                    <Table.Summary.Cell index={6}  className="ant-table-summary-cell">
//               <Typography content="" modifiers={['13x18', '600', 'right', 'main']} />
//                  </Table.Summary.Cell>
//                    <Table.Summary.Cell index={6}  className="ant-table-summary-cell">
//               <Typography content="" modifiers={['13x18', '600', 'right', 'main']} />
//                  </Table.Summary.Cell>
//                    <Table.Summary.Cell index={6}  className="ant-table-summary-cell">
//               <Typography content="" modifiers={['13x18', '600', 'right', 'main']} />
//                  </Table.Summary.Cell>
//                    <Table.Summary.Cell index={6}  className="ant-table-summary-cell">
//               <Typography content="" modifiers={['13x18', '600', 'right', 'main']} />
//               </Table.Summary.Cell>
//              </Table.Summary.Row>
//             </Table.Summary>
//             )}
//         />
//         {/* <PublicTable
//         listData={dataList}
//        // loading={states.loading}
//         column={columnTable}
//         rowkey={'master_ref'}
//         isHideRowSelect={false}
//         showExpandColumn
//         isExpandable
//         scroll={{ x: 'max-content', y: 'calc(100vh - 210px)' }}
//         defaultExpandAllRow={false}
//       //  handleOnchange={checkYouHavePermissionApproveCommissions ? handleTableChange : handleTableChange1}
       
//         rowClassNames={(record: any, index: any) => {
//           return index % 2 === 0 ? 'bg-gay-blur' : ''
//         }}
      
//       /> */}
//         </div>
     
//     )
//   }, [listCampaign, states])
//   return (
//     <div className='p-managekpi'>
//       <PublicLayout>
//         <PublicHeader
//           titlePage={'Quản lý KPI'}
//           handleGetTypeSearch={() => { }}
//           handleFilter={() => { }}
//           handleCleanFilter={() => { }}
//           isHideFilter
//           isHideService
//           className='p-managekpi_header'
//           isDial={false}
//           isHideEmergency
//           isHideCleanFilter
//           tabLeft={
//               <>
//                 <div className="p-affiliate_header_item">
//                   <CDatePickers
//                     // handleOnChange={(date: any) => {
//                     //   setStates({ ...states, date: date?.$d })
//                     // }}
//                     variant="simple"
//                  //   value={states.date}
//                     fomat="DD/MM/YYYY"
//                     isShowTime={false}
//                     placeholder="Chọn tháng cần xem" picker="date"
//                   />
//                   <Button
//                  // onClick={handleGetAppointment}
//                 >
//                     <Typography content='Lọc' />
//                   </Button>
//                 </div>
               
//               </>
//             }
//           // listBtn={(
//           //   <>
//           //     <Button modifiers={['foreign']} onClick={() => {
//           //       setStates({
//           //         ...states, isOpenDrawer: true,
//           //       });
//           //     }}>
//           //       <Typography content='Gửi tin nhắn từ file' modifiers={['400']} />
//           //     </Button>
//           //     <Button onClick={() => {
//           //       setCampaign({
//           //         ...campaign,
//           //         isOpenAddOrUpdate: true,
//           //         isUpdate: false,
//           //         nameCampaign: '',
//           //         statusCampaign: false,
//           //       })
//           //     }}>
//           //       <Typography content='Thêm mới' modifiers={['400']} />
//           //     </Button>
//           //   </>
//           // )}
//         />
//         <div className='p-managekpi_table' style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", height:"fit-content"}}>
           
//           {/* <div style={{ display: "flex", justifyContent: "space-between", width: "100%", background: "rgb(245 245 245)",  borderRadius: '16px',height:"fit-content", padding:"30px 20px",   boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',}}> {memoryAddTableKPI}</div>  */}
          
         
//          {memoryTableSeenKPI}
//           {
//             roles === "Employeess" ?
//             <div style={{ display: "flex", justifyContent: "space-around", width: "100%", background: "rgb(245 245 245)", borderRadius: '16px', height: "fit-content", padding: "30px 20px", boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px', }}>
//           {memoryTableKPI}
//           {memoryTableKPI}
//           {memoryTableKPI}
//           {memoryTableKPI}
//           {memoryTableKPI}
//           </div> : <></>
//           }
         
//         </div>
//       </PublicLayout>
     
//       <CModal
//         isOpen={openAdd}
//         title={"Thêm mới KPI"}
//         onCancel={() => setOpenAdd(false)}
//         textCancel='Thoát'
//         textOK={campaign.isUpdate ? 'Cập nhật' : 'Thêm mới'}
//         onOk={handleAddOrUpdateCampaign}
//       >
//         <div style={{marginBottom:"10px"}}>
//           <Dropdown
//                           dropdownOption={listDoctoronline || []}
//                        //   defaultValue={valUpdate?.origin as DropdownData}
//                           label="Chọn loại khách hàng"
//                           placeholder="Chọn 1 bác sĩ"
//                           // handleSelect={(item) => {
//                           //   setDataForm({
//                           //     ...dataForm,
//                           //     serviceAllowTypeBooking1: item,
//                           //   });
//                           //   setErrorForm({ ...errorForm, bookingService1: "" });
//                           // }}
//                           variant="simple"
//                         //  values={dataForm.serviceAllowTypeBooking1}
//                         //  error={errorForm.bookingService1}
//           isRequired
        
//                         />
//         </div>
//         <div style={{marginBottom:"10px"}}>
//           <Dropdown
//                           dropdownOption={listDoctoronline || []}
//                        //   defaultValue={valUpdate?.origin as DropdownData}
//                           label="Chọn loại khách hàng"
//                           placeholder="Chọn 1 bác sĩ"
//                           // handleSelect={(item) => {
//                           //   setDataForm({
//                           //     ...dataForm,
//                           //     serviceAllowTypeBooking1: item,
//                           //   });
//                           //   setErrorForm({ ...errorForm, bookingService1: "" });
//                           // }}
//                           variant="simple"
//                         //  values={dataForm.serviceAllowTypeBooking1}
//                         //  error={errorForm.bookingService1}
//           isRequired
        
//                         />
//         </div>
//         <Input
//           isRequired
//           type='number'
//           label='Số KPI đạt được'
//           placeholder='Nhập sô KPI'
//           variant='simple'
//           value={campaign.nameCampaign}
//           onChange={(event) => setCampaign({
//             ...campaign,
//             nameCampaign: event.target.value
//           })}
//         />
       
//       </CModal>
//       <CDrawer
//         isOpen={states.isOpenDrawer}
//         positon='left'
//         widths={dataFromExcel?.length ? 1100 : 540}
//         handleOnClose={() => {
//           setStates({
//             ...states, isOpenDrawer: false,
//           });
//           setCampaignDetail(undefined);
//         }}
//       >
//         <FormAddMarketingCampaign
//           campaigns={listCampaign.map((i: any) => {
//             if (i?.is_active) {
//               return ({
//                 id: i.campaign_id,
//                 label: i.campaign_name,
//                 value: i.campaign_id,
//               })
//             }
//             return;
//           }).filter(Boolean) as DropdownData[]}
//           isClose={states.isOpenDrawer}
//           handleOnClose={() => {
//             setStates({
//               ...states, isOpenDrawer: false,
//             });
//           }}
//           templateSMS={templateSMS}
//           handleSubmit={() => {
//             toast.info('Tính năng này đang được phát triển!.');
//             setStates({
//               ...states, isOpenDrawer: false,
//             });
//           }}
//           dataOnChange={(data) => setDataFromExcel(data)}
//         />
//       </CDrawer>
//     </div>
//   );
// }

// export default ManageKPIs;


import React from 'react'

const ManageKPIs = () => {
  return (
    <div>index</div>
  )
}

export default ManageKPIs