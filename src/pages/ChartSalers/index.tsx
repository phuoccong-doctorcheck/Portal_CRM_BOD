/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spin } from 'antd';
import { sendMessagetype } from 'assets/data';
import Button from 'components/atoms/Button';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Switchs from 'components/atoms/Switchs';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import FormAddMarketingCampaign, { AMOUNT_SMS, CampaignFormType } from 'components/molecules/FormAddMarketingCampaign';
import CDrawer from 'components/organisms/CDrawer';
import CModal from 'components/organisms/CModal';
import MemoizedResultCampaignSMS from 'components/organisms/ResultCampaignSms';
import PublicHeader from 'components/templates/PublicHeader';
import PublicLayout from 'components/templates/PublicLayout';
import moment from 'moment';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getCampaignLogs, getCampaigns, getSMSTemplates, postMakeOrUpdateCampaigns, postSendCampaign } from 'services/api/point';
import { TemplateSMSItem } from 'services/api/point/types';
import mapModifiers from 'utils/functions';

interface SalesData {
  name: string;
  revenue: number;
}

interface SalesBarChartProps {
  data: SalesData[];
  title: string;
}
const SalesBarChart: React.FC<SalesBarChartProps> = ({ data, title }) => {
  return (
    <div style={{ width: '100%', height: 280, marginBottom: 10, display:"flex", flexDirection:"column", alignItems:"center" }}>
      <h3 style={{ textAlign: 'center', fontSize: '16px', margin: '10px 0' }}>
        {title}
      </h3>
      <ResponsiveContainer width="80%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#0489dc" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const salesData1 = [
  { name: 'Kim Giang', revenue: 2400 },
  { name: 'Ái Trang', revenue: 3000 },
  { name: 'Thu Trang', revenue: 2000 },
  { name: 'Ngọc Châu', revenue: 2780 },
  { name: 'Hồng Phúc', revenue: 1890 },
];

const salesData2 = [
  { name: 'Kim Giang', revenue: 2400 },
  { name: 'Ái Trang', revenue: 3000 },
  { name: 'Thu Trang', revenue: 2000 },
  { name: 'Ngọc Châu', revenue: 2780 },
  { name: 'Hồng Phúc', revenue: 1890 },
];
const ChartSalers: React.FC = () => {
  const [listCampaign, setListCampaign] = useState([]);
  const [listCampaignDetail, setListCampaignDetail] = useState([]);
  const [campaignDetail, setCampaignDetail] = useState<any>();
  const [states, setStates] = useState({
    isOpenDetailCampaign: false,
    isLoadingGetDetailCampaign: 0,
    isOpenDrawer: false,
  })
  const [campaign, setCampaign] = useState({
    isOpen: false,
    isOpenAddOrUpdate: false,
    isUpdate: false,
    nameCampaign: '',
    statusCampaign: false,
    id: 0,
  })
  const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
  const [dataFromExcel, setDataFromExcel] = useState<CampaignFormType[]>([]);

  const [sendSMS, setSendSMS] = useState({
    openModal: false,
    type: '',
    listCS: [],
    campaignType: sendMessagetype[0] as unknown as GroupRadioType,
    template: undefined as unknown as DropdownData,
    campaign: undefined as unknown as DropdownData,
    content: '',
    subject: '',
  })

  const [sendSMSEror, setSendSMSError] = useState({
    subject: '',
    template: '',
    content: '',
    campaign: ''
  });

  const [dataCampaign, setDataCampaign] = useState({
    data: undefined as unknown as DropdownData[],
    dropdown: undefined as unknown as DropdownData[],
  });

  useLayoutEffect(() => {
    getCampaign();
    getTemplateSMSOfCampaign();
  }, [])

  /* API */
  const { mutate: getCampaign } = useMutation(
    'post-footer-form',
    () => getCampaigns(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setListCampaign(data?.data);
          const newCampaign = await data?.data?.map((item: any) => {
            return {
              id: item.campaign_id,
              label: item.campaign_name,
              value: item.campaign_id,
              active: item.is_active,
            }
          }).filter(Boolean);
          setDataCampaign({
            data: newCampaign,
            dropdown: data?.data?.map((item: any) => {
              if (!item.is_active) return;
              return {
                id: item.campaign_id,
                label: item.campaign_name,
                value: item.campaign_id,
                active: item.is_active,
              }
            }).filter(Boolean)
          });
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCampaignDetail } = useMutation(
    'post-footer-form',
    (body: any) => getCampaignLogs(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setStates({ ...states, isOpenDetailCampaign: true, isLoadingGetDetailCampaign: 0 });
          setListCampaignDetail(data?.data);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: createOrUpdateCampaign } = useMutation(
    'post-footer-form',
    (body: any) => postMakeOrUpdateCampaigns(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          getCampaign();
          setCampaign({
            ...campaign,
            isOpenAddOrUpdate: false,
          })
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getTemplateSMSOfCampaign } = useMutation(
    'post-footer-form',
    () => getSMSTemplates(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setTemplateSMS(data?.data?.map((item: TemplateSMSItem) => {
            if (!item.is_used) return;
            return {
              id: item.id,
              label: item.name,
              value: item.content,
              sms_count: item.sms_count,
            }
          }))
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: sendCampaign } = useMutation(
    'post-footer-form',
    (body: any) => postSendCampaign(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: '',
            subject: '',
          })
        } else {
          toast.error(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: '',
            subject: '',
          })
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  /* API */

  const handleAddOrUpdateCampaign = () => {
    if (!campaign.nameCampaign.trim()) {
      toast.error('Vui lòng nhập tên chiến dịch');
      return;
    }
    const body = {
      campaign_id: campaign.id,
      campaign_name: campaign.nameCampaign,
      is_active: campaign.statusCampaign,
    }

    createOrUpdateCampaign(body)
  }

  const handleValidateSendMessage = () => {
    if (sendSMS.campaignType?.value === 'SMS') {
      if (!sendSMS.subject.trim() || !sendSMS.template || !sendSMS.campaign) {
        setSendSMSError({
          ...sendSMSEror,
          subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
          template: !sendSMS.template ? 'Cần chọn template để gửi tin nhắn' : '',
          campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : ''
        })
        return false;
      }
      return true;
    } else {
      if (!sendSMS.subject.trim() || !sendSMS.content?.trim()) {
        setSendSMSError({
          ...sendSMSEror,
          campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : '',
          subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
          content: !sendSMS.content?.trim() ? 'Cần nhập nội dung tin nhắn để gửi tin nhắn' : ''
        })
        return false;
      }
      return true;
    }
  }

  const handleExcuteSendMessage = () => {
    if (!handleValidateSendMessage()) return;
    const to = listCampaignDetail
      .filter((i: any) => i?.status !== "OK" && !!i.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/))
      .map((i: any) => {
        return { customer_ref: i?.customer_ref };
      });

    const body = {
      send_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      campaign_id: sendSMS.campaign?.value,
      method: sendSMS.campaignType.value,
      template_id: sendSMS.template.id || '',
      content: sendSMS.campaignType.value === "SMS" ? sendSMS.template.value?.replace('&', 'va') : sendSMS.content?.replace('&', 'va'),
      to: to,
    }
    sendCampaign(body);
  }

  /* Column */
  const memoryTableCampaign = useMemo(() => {
    return (
      listCampaign?.map((item: any) => (
        <div className={mapModifiers("p-campaign_table_item", states.isLoadingGetDetailCampaign === item.campaign_id && 'loading')} key={item?.campaign_id} >
          <span className={mapModifiers('p-campaign_table_item_status', item?.is_active ? 'active' : 'disable')} ></span>
          {states.isLoadingGetDetailCampaign === item.campaign_id ?
            <Spin tip="Tải dữ liệu..." />
            : (
              <>
                <div className="p-campaign_table_item_paragraph" onClick={() => {
                    setCampaignDetail(item);
                    setStates({
                      ...states, isLoadingGetDetailCampaign: item.campaign_id,
                    })
                    const body = {
                      campaign_id: item?.campaign_id,
                      status: "ok",
                    }
                    getCampaignDetail(body);
                      }}>
                  <p>{item?.campaign_name}</p>
                </div>
                <div className="p-campaign_table_item_action">
                  <CTooltip placements="top" title="Danh sách KH đã gửi">
                    <div>
                      <Icon iconName={"detail_crm"} size="24x24" isPointer onClick={() => {
                    setCampaignDetail(item);
                    setStates({
                      ...states, isLoadingGetDetailCampaign: item.campaign_id,
                    })
                    const body = {
                      campaign_id: item?.campaign_id,
                      status: "ok",
                    }
                    getCampaignDetail(body);
                      }} />
                    </div>
                  </CTooltip> 
                  <CTooltip placements="top" title="Sửa chiến dịch">
                 <div> <Icon iconName="edit_crm" size="24x24" isPointer onClick={() => setCampaign({
                    ...campaign,
                      isOpenAddOrUpdate: true,
                      isUpdate: true,
                      nameCampaign: item.campaign_name,
                      statusCampaign: item?.is_active,
                      id: Number(item.campaign_id),
                      })} />
                    </div>
                  </CTooltip>  
                </div>
              </>
            )
          }
        </div>
      ))
    )
  }, [listCampaign, states])

  return (
    <div className='p-campaign'>
      <PublicLayout>
        <PublicHeader
          titlePage={'Biểu đồ'}
          handleGetTypeSearch={() => { }}
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          isHideFilter
          isHideService
          className='p-campaign_header'
          isDial={false}
          isHideEmergency
          isHideCleanFilter
          // listBtn={(
          //   <>
          //     <Button modifiers={['foreign']} onClick={() => {
          //       setStates({
          //         ...states, isOpenDrawer: true,
          //       });
          //     }}>
          //       <Typography content='Gửi tin nhắn từ file' modifiers={['400']} />
          //     </Button>
          //     <Button onClick={() => {
          //       setCampaign({
          //         ...campaign,
          //         isOpenAddOrUpdate: true,
          //         isUpdate: false,
          //         nameCampaign: '',
          //         statusCampaign: false,
          //       })
          //     }}>
          //       <Typography content='Thêm mới' modifiers={['400']} />
          //     </Button>
          //   </>
          // )}
        />
      <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '20px',
        justifyContent:"space-around"
        
      }}
    >
      <SalesBarChart data={salesData1} title="So sánh doanh thu" />
      <SalesBarChart data={salesData2} title="So sánh hoa hồng" />
      <SalesBarChart data={salesData1} title="Sales Revenue Comparison 3" />
      <SalesBarChart data={salesData2} title="Sales Revenue Comparison 4" />
    </div>
      </PublicLayout>
      <CDrawer
        isOpen={states.isOpenDetailCampaign}
        positon='bottom'
        height={'95vh'}
        handleOnClose={() => {
          setStates({
            ...states, isOpenDetailCampaign: false,
          });
          setCampaignDetail(undefined);
        }}
        titleHeader={`Kết quả: ${campaignDetail?.campaign_name}`}
        isHaveHeader
        isHaveHeaders
      >
        <div className='p-campaign_info'>
          <div className='p-campaign_info_header'>
            <div className='p-campaign_info_header_left'>
              <div className='p-campaign_info_header_item'>
                <span>Tin nhắn gửi thành công: </span>
                <p>{listCampaignDetail.filter((i: any) => i?.status === "OK")?.length}</p>
              </div>
              <div className='p-campaign_info_header_item'>
                <span>Tin nhắn gửi thất bại: </span>
                <p>{listCampaignDetail.filter((i: any) => i?.status !== "OK")?.length}</p>
              </div>
              <div className='p-campaign_info_header_item'>
                <span>Chi phí: </span>
                <p>{listCampaignDetail?.reduce((init: any, item: any) => init + item?.cost, 0)?.toLocaleString('vi-VN')}</p>
              </div>
            </div>
            <div className='p-campaign_info_header_right'>
              {listCampaignDetail.filter((i: any) => i?.status !== "OK")?.length > 0 &&
                <Button modifiers={['red']} onClick={() => {
                  setSendSMS({
                    ...sendSMS,
                    openModal: true,
                  })
                }}>
                  <Typography content='Tiếp tục với danh sách thất bại' />
                </Button>
              }
            </div>
          </div>
          <div className='p-campaign_info_table'>
            <MemoizedResultCampaignSMS
              listCampaignDetail={listCampaignDetail}
            />
          </div>
        </div>
      </CDrawer>
     
    </div>
  );
}

export default ChartSalers;
