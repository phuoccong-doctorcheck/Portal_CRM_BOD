/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-async-promise-executor */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { exampleDataItemAppointmentView, interactionHistoryType } from 'assets/data';
import CTooltip from 'components/atoms/CTooltip';
import { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import CTabs, { TabItemType } from 'components/molecules/CTabs';
import CustomerInformation from 'components/molecules/CustomerInfomation';
import PublicTable from 'components/molecules/PublicTable';
import CategoriesCustomer from 'components/organisms/CategoriesCustomer';
import InteractionHistory from 'components/organisms/InteractionHistory';
import SurveyQuestionnaire from 'components/organisms/SurveyQuestionnaire';
import DetailResultPhysical from 'components/templates/DetailResultPhysical';
import FamilyMembers from 'components/templates/FamilyMembers';
import ListJobInteractCustomer from 'components/templates/ListJobInteractCustomer';
import PortraitCustomer from 'components/templates/PortraitCustomer';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postNoteByID } from 'services/api/beforeExams';
import { Appointment } from 'services/api/beforeExams/types';
import { getCardSurveyPortrait } from 'services/api/customerInfo';
import { getCustomerByKey } from 'services/api/dashboard';
import {
  getInfosCustomerById, getListNotes, getSurveyCustomer,
} from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers from 'utils/functions';

const DetailCustomer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const { type, info, tab } = useParams();
  const service = localStorage.getItem('services');
  const infoCustomer = useAppSelector((state) => state.infosCustomer.respCustomerInfo);
  const isGetCustomerSuccess = useAppSelector((state) => state.infosCustomer.isGetCustomerSuccess);
  const isNotFoundCs = useAppSelector((state) => state.infosCustomer.notfound);
  const listNotesCustomer = useAppSelector((state) => state.infosCustomer.noteList);
  const infoSurvey = useAppSelector((state) => state.infosCustomer.responseSurvey);
  const [listServices] = useState(service ? JSON.parse(service) : '');
  const [listNode, setListNode] = useState(listNotesCustomer);
  const [listNodeLoading, setListNodeLoading] = useState(false);
  const [indexActive, setIndexActive] = useState('1');
  const [isCustomerRelate, setIsCustomerRelate] = useState(false);
  const [dataCustomerPortrait, setDataCustomerPortrait] = useState();
  const [listCustomerRelate, setListCustomerRelate] = useState<any[]>([])
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [typeNote, setTypeNote] = useState(interactionHistoryType[0]);
  const [payment, setPayment] = useState(0);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, [window.innerWidth]);

  const handleGetPortrait = async () => {
    await getCardSurveyPortraitByCustomer({ customerId: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id, survey_type: infoCustomer?.data?.customer?.portrait_survey_type });
  }

  useLayoutEffect(() => {
    if (listCustomerRelate.length >= 1) return;
    if (type === 'phone') {
      getCustomerByPhones(info);
    }
    if (!_.isEmpty(infoCustomer?.data?.customer?.customer_phone) && type !== 'phone') {
      getCustomerByPhones(infoCustomer?.data?.customer?.customer_phone?.replace('+84-', '0'));
    }
  }, [type, infoCustomer?.data?.customer]);

  useLayoutEffect(() => {
    dispatch(getInfosCustomerById({ type: type, customer_id: info }));
  }, []);

  useEffect(() => {
    const currentTab = OptionTab.find((tabinfo) => tabinfo.short === tab)
    if (currentTab) {
      setIndexActive(currentTab.key as any);
    }
    sessionStorage.setItem('indexMenu', '0');
  }, []);

  useEffect(() => {
    if (isNotFoundCs) {
      if (type === 'phone') {
        navigator(`/customer-not-found/${info}`)
      }
    }
  }, [isNotFoundCs]);

  useEffect(() => {
    if (isGetCustomerSuccess && _.isUndefined(infoCustomer.data)) {
      toast.error('Không tìm thấy thông tin khách hàng');
    }
  }, [isGetCustomerSuccess]);

  const { mutate: postNoteCustomerById } = useMutation(
    'post-footer-form',
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        dispatch(getListNotes({
          customer_id: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id,
          cs_node_type: typeNote?.value,
        }));
        setListNodeLoading(false)
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCustomerByPhones } = useMutation(
    'post-footer-form',
    (data: any) => getCustomerByKey(data),
    {
      onSuccess: (data) => {
        setListCustomerRelate(data);
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCardSurveyPortraitByCustomer } = useMutation(
    'post-footer-form',
    (id: any) => getCardSurveyPortrait(id),
    {
      onSuccess: (data) => {
        setDataCustomerPortrait(data?.data)
        setIndexActive('6');
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  const handleConvertInfoTolistService = (data: any) => {
    const groupedData: any[] = [];

    setPayment(_.sum(data.map((i: any) => i?.service_prices)));

    data?.forEach((item: any, index: any) => {
      const groupOrderNumber = item.service_group_order_number;
      const existingGroup = groupedData.find(
        (group) => group.service_group_order_number === groupOrderNumber
      );

      if (existingGroup) {
        existingGroup.child.push(item);
      } else {
        groupedData.push({
          id_group: index,
          name: item.service_group_name,
          service_group_order_number: groupOrderNumber,
          child: [item],
        });
      }
    });
    return groupedData;
  };
  const handleAddNote = async (data: any) => {
    const body = {
      ...data,
      customer_id: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any,
    };
    setListNodeLoading(true);
    setListNode(undefined as any);
    await postNoteCustomerById(body);
  };

   const ColumnTableDetailService = [
    {
      title: (
        <Typography content="Dịch vụ" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "service_name",
      render: (record: any) => (
        <Typography content={record} modifiers={["12x18", "600", "justify", "main"]} />
      ),
    },
    {
      title: (
        <Typography content="DVT" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "unit_name",
      width: 60,
      render: (record: any) => (
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: <Typography content="SL" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "quantity",
      width: 50,
      render: (record: any) => (
        <Typography content={"1"} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: (
        <Typography content="Đơn giá" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      width: 160,
      dataIndex: "service_prices",
      render: (record: any) => (
        <Typography
          content={record ? record?.toLocaleString("vi-VN") : "0.00"}
          modifiers={[
            "12x18",
            "400",
            "center",
            record === "Khách hàng mới" ? "blueNavy" : "jet",
          ]}
        />
      ),
    },
    {
      title: (
        <Typography
          content="Thành tiền"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "service_prices",
      width: 130,
      render: (record: any) => (
        <Typography
          content={record ? record?.toLocaleString("vi-VN") : "0.00"}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
  ];
    const memoriesTableSelected = useMemo(() => {
      var finalResult
      var totalAmount
      
      if (infoCustomer.data) {
        if (infoCustomer.data.appointment) {
          const idsArray = infoCustomer.data.appointment.ids.split(',');
          //       const idsArray:  any[] = [] 
          // Step 1: Find matching service_id and service_ref
          const matchedServices: any[] = [];

          listServices.forEach((group: any) => {
            group.children.forEach((service: any) => {
              if (idsArray.includes(service.service_id)) {
                matchedServices.push(service);
              }
            });
          });
          const groupedServices: { [key: string]: { service_group_id: string; service_group_name: string; service_group_items: any[] } } = {};

          matchedServices.forEach((service) => {
            if (!groupedServices[service.service_group_id]) {
              groupedServices[service.service_group_id] = {
                service_group_id: service.service_group_id,
                service_group_name: service.service_group_name,
                service_group_items: [],
              };
            }
            groupedServices[service.service_group_id].service_group_items.push(service);
          });
          const calculateTotalPrice = (services: any[]): number => {
            return services.reduce((total, service) => {
              return total + service.service_prices;
            }, 0);
          };
          finalResult = Object.values(groupedServices);
          totalAmount = calculateTotalPrice(matchedServices);
        }
} else {
  console.error("No appointment data available");
}
      return (
      <div style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
      <div>
            <div className="p-appointment_view_detail_service_heading">
              <PublicTable
                listData={exampleDataItemAppointmentView}
                isHideRowSelect
                column={ColumnTableDetailService}
                scroll={{
                  y: '100%'
                }}
                isSimpleHeader
                isNormal
                isbordered={false}
              />
            </div>
            <div className="p-appointment_view_detail_service_content">
              <PublicTable
                listData={finalResult}
                // loading={_.isEmpty(listDetailService)}
                isHideRowSelect
                isHideHeader
                defaultExpandAllRow
                rowkey="id_group"
                scroll={{ x: 'max-content' }}
                column={[
                  {
                    title: "",
                    align: "left",
                    dataIndex: "service_group_name",
                    render: (record: any, data: any) => (
                      <div className="p-booking_schedule_heading">
                        <Typography
                          content={`${record} (${data?.service_group_items?.length})`}
                          modifiers={["16x24", "600", "justify", "blueNavy"]}
                        />
                      </div>
                    ),
                  },
                ]}
                expandedRender={(data) => (
                  <PublicTable
                    isSimpleHeader
                    column={ColumnTableDetailService}
                    listData={data?.service_group_items}
                    size="small"
                    rowkey="service_id"
                    isbordered
                    isPagination={false}
                    isHideRowSelect
                    isHideHeader
                    handleOnDoubleClick={(item: any) => { }}
                    rowClassNames={(record, index) => ""}
                    scroll={{
                      x: 'max-content',
                      // y: '100%',
                    }}
                  />
                )}
                isExpandable
                // expandedRowKeys={Array?.from({ length: 50 }, (_, index) => index)}
              />
            </div>
            {!_.isEmpty(finalResult) && (
              <div className="p-appointment_view_detail_service_money">
                <span>Thành tiền:</span>
                <p>{totalAmount?.toLocaleString("vi-VN")} VNĐ</p>
              </div>
            )}
          </div></div>
     
      )
  },[infoCustomer])
  const OptionTab = [
    {
      key: '1',
      short: 'history-interaction',
      label: stateBreakPoint > 1280 ? 'Lịch sử tương tác' : <CTooltip placements={'right'} title={'Lịch sử tương tác'}> <Icon iconName="interactive" /> </CTooltip>,
      children: <InteractionHistory
        options={listNode?.data as any} id={type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any}
        loadingNote={listNodeLoading}
        handleChangeType={(item: GroupRadioType) => {
          setTypeNote(item);
          dispatch(getListNotes({
            customer_id: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id,
            cs_node_type: item.value,
          }));
        }}
        typeNote={typeNote}
      />,
      onClick: () => { }
    },
    {
      key: '2',
      short: 'category',
      label: stateBreakPoint > 1280 ? 'Kết quả gần đây' : <CTooltip placements={'right'} title={'Kết quả gần đây'}> <Icon iconName="recent_result" /> </CTooltip>,
      children: <CategoriesCustomer id={type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any} />,
      onClick: () => { }
    },
    //  {
    //   key: '6',
    //   short: 'category',
    //   label: stateBreakPoint > 1280 ? 'Đặt lịch gần nhất' : <CTooltip placements={'right'} title={'Kết quả gần đây'}> <Icon iconName="recent_result" /> </CTooltip>,
    //   children: infoCustomer && memoriesTableSelected,
    //   onClick: () => { }
    // },
    {
      key: '3',
      short: 'diary-medical',
      label: stateBreakPoint > 1280 ? 'Nhật ký' : <CTooltip placements={'right'} title={'Nhật ký'}> <Icon iconName="results" /> </CTooltip>,
      children: <DetailResultPhysical id={type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any} />,
      onClick: () => { }
    },
    {
      key: '4',
      short: 'job',
      label: stateBreakPoint > 1280 ? 'Công việc' : <CTooltip placements={'right'} title={'Công việc'}> <Icon iconName="task" /> </CTooltip>,
      children: <ListJobInteractCustomer customer_id={type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any} />,
      onClick: () => { }
    },

    {
      key: '5',
      short: 'question',
      label: stateBreakPoint > 1280 ? 'Bộ câu hỏi khảo sát' : <CTooltip placements={'right'} title={'Bộ câu hỏi khảo sát'}> <Icon iconName="faqs" /> </CTooltip>,
      children: <SurveyQuestionnaire />,
      onClick: () => {
        if (!infoSurvey.data) {
          dispatch(getSurveyCustomer({ customerId: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id, type: infoCustomer?.data?.master?.register_type_id || 'NS' }))
        }
      }
    },
    {
      key: '7',
      short: 'portrait-customer',
      label: stateBreakPoint > 1280 ? 'Chân dung khách hàng' : <CTooltip placements={'right'} title={'Chân dung khách hàng'}> <Icon iconName="portrait" /> </CTooltip>,
      children: <PortraitCustomer
        type={infoCustomer?.data?.customer?.portrait_survey_type}
        data={dataCustomerPortrait}
        customer_id={type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any}
      />,
      onClick: () => {
        if (_.isNull(infoCustomer?.data?.master)) {
          return toast.info(`Không tìm thấy chân dung khách hàng ${infoCustomer?.data?.customer?.customer_fullname}`);
        }
        return handleGetPortrait()
      }
    },
    // {
    //   key: '7',
    //   short: 'family-members',
    //   label: stateBreakPoint > 1280 ? 'Thành viên' : <CTooltip placements={'right'} title={'Thành viên gia đình'}> <Icon iconName="task" /> </CTooltip>,
    //   children: <FamilyMembers />,
    //   onClick: () => { }
    // },
  ];

  return (
    <PublicLayout >
      <div className={mapModifiers("p-detail_customer", stateBreakPoint < 1280 && 'tablet')}>
        {
          listCustomerRelate.length > 1 &&
          <div className={mapModifiers("p-detail_customer_relate", isCustomerRelate ? 'open' : 'hide')} style={{zIndex:"100"}}>
            {
              listCustomerRelate.length && isCustomerRelate ?
                <>
                  <div className={mapModifiers("p-detail_customer_relate_wrapper")}>
                    <div className="p-detail_customer_relate_title">
                      <Typography content="Khách hàng liên quan" />
                    </div>
                    <div className={mapModifiers("p-detail_customer_relate_content")}>
                      {
                        listCustomerRelate.length > 1 ? listCustomerRelate.filter((i) => i?.customer_id !== infoCustomer?.data?.customer?.customer_id)?.map((customer) => (
                          <div
                            key={customer?.customer_id}
                            className="p-detail_customer_relate_item"
                            onClick={() => {
                              window.open(
                                `/customer-info/id/${customer?.customer_id}/history-interaction`,
                                "_blank"
                              );
                            }}
                          >
                            <div className="p-detail_customer_relate_item_feild">
                              <span>Họ tên:</span><span>{customer?.customer_fullname}</span>
                            </div>
                            <div className="p-detail_customer_relate_item_feild">
                              <span>Ngày sinh:</span><span>{moment(customer?.birthday).format('DD/MM/YYYY')}</span>
                            </div>
                            <div className="p-detail_customer_relate_item_feild">
                              <span>Giới tính:</span><span>{customer?.gender_id === 'M' ? 'Nam' : 'Nữ'}</span>
                            </div>
                          </div>
                        )) : <Typography content='Không tìm thấy khách hàng liên quan' modifiers={['12x24', 'cg-red', 'italic', '400']} />
                      }
                    </div>
                    <div className="p-detail_customer_relate_close">
                      <Icon iconName='close' onClick={() => setIsCustomerRelate(false)} />
                    </div>
                  </div>
                </>
                : <Icon iconName="networking" isPointer onClick={() => setIsCustomerRelate(true)} size="20x20" />
            }
          </div>
        }
        <div className="p-detail_customer_left">
          <CustomerInformation handleAddNote={(data: any) => handleAddNote(data)} dataCustomerPortrait={dataCustomerPortrait} typeNoteCs={typeNote.value} />
        </div>
        <div className="p-detail_customer_right">
          <CTabs
            options={OptionTab as unknown as TabItemType[]}
            defaultActiveKey={indexActive}
            position={"top"}
            handleOnTabClick={(data: any) => {
              return new Promise((resolve, reject) => {
                console.log("🚀 ~ returnnewPromise ~ data?.short:", data?.short)
                try {
                  data?.onClick();
                  Cookies.set('tabName', data?.short);
                  setIndexActive(data?.id);
                  window.history.pushState(null, `${type}/customer-info/${type === 'id' ? info : infoCustomer?.data?.customer?.customer_id}/`, `${data?.short}`);
                  resolve(true);
                } catch (error) {
                  reject(error);
                }
              })
            }}
          />
        </div>
      </div>
    </PublicLayout>
  );
};

export default DetailCustomer;
