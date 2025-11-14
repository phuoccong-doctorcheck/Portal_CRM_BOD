/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-const-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/button-has-type */
/* eslint-disable import/no-cycle */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { AnyAction } from "@reduxjs/toolkit";
import { Layout, Spin } from "antd";
import Typography from "components/atoms/Typography";
import MenuItem, { ItemMenu } from "components/molecules/MenuItem";
import UserDropdown from "components/molecules/UserDropdown";
import CDrawer from "components/organisms/CDrawer";
import Cookies from "js-cookie";
import _ from "lodash";
import React, { createContext, useEffect, useLayoutEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCustomerWhenCallIn,
  getPackagesDetail,
} from "services/api/dashboard";
import { UserCallAgent } from "services/types";
import { getInitAfterExams } from "store/afterexams";
import { getListResourceCRM } from "store/home";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListPageWithPancake } from "store/pancake";
import mapModifiers from "utils/functions";
import { MenuCRMMobile } from "utils/staticState";

import HeaderNav from "../HeaderNav";
import SideNav from "../SideNav";
import { CallConnect, useSip } from "../SipProvider";
import Telephone from "../Telephone";

import { getUserMedia, handleLogin } from "./index.controller";

//import imgUser from 'assets/images/icon_profile.svg'
import imgUser1 from "assets/images/profile.png"
import logo from 'assets/images/short_logo.svg';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

interface SoftPhoneProvider {
  handleOpenDial?: (any: CallConnect) => void;
}

interface PublicLayoutProps {
  children?: React.ReactNode;
  isLoadings?: boolean;
  isShowPopupChat?: boolean;
  isShowPopupTelephone?: boolean;
  widthScreen?: number;
}

export const SoftPhoneContext = createContext<SoftPhoneProvider>({} as SoftPhoneProvider);

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children = undefined,
  widthScreen,
  isLoadings,
  isShowPopupChat = false,
  isShowPopupTelephone = false,
}) => {
  const dispatch = useAppDispatch();
  const navigators = useNavigate();

  const { connect, register, makeCall, transfer, hangupCall, AcceptCall, setExternalNumber, stateCall, externalNumber, stateConnect, handleSetStateConnect, handleSetStateCall, handleSetCustomerName } = useSip();
  const configAgent = localStorage.getItem('user_call_agent');
  const storeListPage = useAppSelector((state) => state.pancake.respListPage);

  const [configTele, setcConfigTele] = useState<UserCallAgent>(configAgent ? JSON.parse(configAgent) as unknown as UserCallAgent : undefined as any);
  const [loadingPage, setLoading] = useState<boolean>(true);
  const checkToken = Cookies.get("token");
  const getFullName = Cookies.get("fullname");
  const storageDms = localStorage.getItem('dms');
  const getRoles = localStorage.getItem('roles');
  const [listRoles, setListRoles] = useState(getRoles ? JSON.parse(getRoles) : '');

  const [collapsedSider, setCollapsedSider] = useState<boolean>(true);
  const [stateDms, setstateDms] = useState<string>(storageDms ? JSON.parse(storageDms) : null);
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);


  // Lắng nghe sự kiện lấy kích cỡ màn hình màn hình
  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, []);

  const [infoCommingPhone, setInfoCommingPhone] = useState({
    nameCustomer: "",
    type: "",
    launch_source: "",
  });

  useEffect(() => {
  
    // nếu mà dữ liệu phía server trả về mà trong listRoles có role_name nào mà là BOD thì return luôn
    if (listRoles && listRoles?.some((i: any) => i?.role_name === 'BOD')) return;
    // tiếp k return tiếp tục kiểm tra điều kiện listRoles và configTele có undefind không
    if (listRoles && !_.isUndefined(configTele)) {
      const configCall = {
        authorizationPassword: configTele?.phone_agent_password,
        authorizationUsername: configTele?.phone_agent,
        displayName: configTele?.display_phone_agent,
        domain: configTele?.sip_realm,
        protocolSip: configTele?.phone_server_type,
        sipPort: configTele?.phone_server_port,
        serverUrl: configTele?.sip_ws_url,
      }
      // truyền object được khởi tạo ở trên vào vào connect để set up cuộc gọi của thu viện SIP
      connect(configCall as any);
      // ở đây sẽ là đăng ký dịch vụ của SIP
      register();
    }
  }, [configAgent]);

  useEffect(() => {
    if (!externalNumber?.trim()) return;
    const timeout = setTimeout(() => {
      getCustomerByPhone(externalNumber);
    }, Number(Math.random() * 3) * 1000)
    return () => clearTimeout(timeout);
  }, [externalNumber]);


  const { mutate: getCustomerByPhone } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerWhenCallIn(data),
    {
      onSuccess: (data: any) => {
        const { name, launch_source, type, phonenumber } = data;
        setInfoCommingPhone({
          ...infoCommingPhone,
          nameCustomer: name !== 'unkown' ? name : phonenumber,
          type: type,
          launch_source: launch_source?.name,
        });
        handleSetCustomerName(name)
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  // call API lấy gói dịch vụ
  const { mutate: getPackageWithItems } = useMutation(
    "post-footer-form",
    () => getPackagesDetail(),
    {
      onSuccess: (data: any) => {
        localStorage.setItem('packagesItems', JSON.stringify(data?.data));
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  /* End handle connect server sip.js */

  // Hàm getUserMedia này sử dụng API getUserMedia của trình duyệt để yêu cầu quyền truy cập vào thiết bị âm thanh (microphone) của người dùng
  // const getUserMedia = async () => {
  //   try {
  //     navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  //       .then((stream) => {// Xử lý stream audio ở đây
  //       })
  //       .catch((error) => { // Xử lý lỗi nếu không thể truy cập thiết bị âm thanh
  //         return;
  //       });
  //   } catch (error) {    // Xử lý lỗi nếu có lỗi xảy ra trong quá trình gọi getUserMedia

  //     return;
  //   }
  // };



  useEffect(() => {
    if (loadingPage) {
      const timeOut = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [loadingPage]);

  useLayoutEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "5457254141009176",
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });

      window.FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
      let js;
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      (js as HTMLScriptElement).src =
        "https://connect.facebook.net/en_US/sdk.js";
      fjs?.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
    getUserMedia();
    if (localStorage.getItem("setResource") === "1") {
      getPackageWithItems();
      localStorage.setItem("setResource", "2");
      toast.success(
        <Typography
          content={`Đăng nhập thành công <br/> Xin chào ${getFullName}!`}
          modifiers={["400"]}
        />
      );

      // lấy data để đổ vào select box trang sau khi khám : Đã khám xong, tầm soát, chưa liên lạc được,...
      dispatch(getInitAfterExams() as unknown as AnyAction);
    }

    // nếu stateDms không có giá trị thì sẽ thực thi code
    // if (!stateDms) {
    //   // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập
    //   dispatch(getListResourceCRM());
    // }

  

    // nếu storeListPage.categorized có giá trị là null or undefind thì nó sẽ trả về true
    if (!storeListPage.categorized) {
      dispatch(getListPageWithPancake({}));
    }

  }, []);
  // kiếm tra có token hay không, không có token thì chuyển hướng đến pending và sau đó có sự kiện F5 để load lại trang => chuyển về trang login
  useEffect(() => {
   
    if (!checkToken) {
      window.history.pushState(null, "", "/pending");
      window.location.reload();
    }
  }, []);
  // Đây là action kết nối FB ở trên thanh header
  // const handleLogin = () => {
  //   window.FB.login((response: any) => {
  //     if (response.authResponse) {
  //       const userAccessToken = response.authResponse.accessToken;
  //       window.FB.api(`/me?fields=id,name,accounts&access_token=${userAccessToken}`, { access_token: userAccessToken }, (resp: any) => {
  //         console.log("🚀 ~ file: index.tsx:242 ~ window.FB.api ~ resp:", resp)
  //       });
  //     } else {
  //       console.log("Login cancelled");
  //     }
  //   });
  // };
    const OptionUser = [
    { id: 1, label: 'Đổi mật khẩu', value: '/profile', handleClick: () => { } },
    { id: 2, label: 'đăng xuât', value: '/logout', handleClick: () => { } },
  ];
    const username = useAppSelector((state) => state.home.shortName);
    const [name, setName] = useState(username);
     const [shortname, setshortname] = useState('');

  const getName = Cookies.get('fullname');
  const getUsername = Cookies.get('username');
  const getshortname = Cookies.get('shortname');
   useEffect(() => {
    
    if (getName) {
      setName(getName);
    } else {
      setName(username);
    }
    if (getshortname) {
      setshortname(getshortname);
    } else {
      setName(Cookies.get('shortname') || '');
    }
  }, [username, getshortname]);

  return (
    <div>
     <div style={{position:"absolute", top:"6px",right:"6px", zIndex:1000, fontSize:"14px"}}><UserDropdown optionsChild={OptionUser} name={getshortname} iconLogo={imgUser1} /></div> 
      <Layout>
        <div className="t-layouts">
          {checkToken && (
            <Spin
              spinning={loadingPage}
              size="large"
              indicator={
                <img
                  className="loader"
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: 'cover',
                    backgroundColor: 'transparent',
                  }}
                  src={logo}
                />
              } >
              {/* Thanh header */}
              <HeaderNav
                handleClickMenuItem={() => {
                  setLoading(true);
                }}
                // có nghĩa là khi mà truyền 1 số nhỏ hơn 1280 thì nó sẽ là true thì thực hiện 1 số tác vụ
                isSortHeader={Number(stateBreakPoint) <= 1280}
                 // có nghĩa là khi mà truyền 1 số để thực hiện login code bên thanh header
                currentWidth={Number(stateBreakPoint)}
                handleLogin={handleLogin}
                handleClickLogo={() => {
                  if (stateBreakPoint > 1280) {
                     const roles1 = Cookies.get('roles');

          // Kiểm tra nếu chuỗi không phải là `undefined` hoặc `null`, thì parse nó thành mảng
          const rolesArray = roles1 ? JSON.parse(roles1) : [];
          // console.log(rolesArray)
          // if (rolesArray[0]?.role_name === "businessplan")
          // {
          //      navigators('/bussiness-plan');
          // }
          // else if (rolesArray[0]?.role_name === "cashflow")
          // {
          //   navigators('/cash-flow');
          // }
          // else {
           navigators('/report-fb-ads');
          // }
                    sessionStorage.setItem('indexMenu', `2`)
                  } else {
                    setCollapsedSider(!collapsedSider)
                  }
                }}
              />
              {/* Đây là thanh SideNav kế bên   */}
              <div className="t-layouts_wrapper">
                {/* {
                  stateBreakPoint > 1280 &&
                  <SideNav widthNav={220} navCollapsed={collapsedSider} handleClickTelephone={() => {
                    handleSetStateConnect('dial');
                  }}
                    handleHoverSideNav={(value: boolean) => setCollapsedSider(value)}
                  />
                } */}
                <main className="t-layouts_main">
                  <SoftPhoneContext.Provider value={{
                    handleOpenDial: (value) => {
                      handleSetStateConnect(value)
                    },
                  }}>
                    {children}
                  </SoftPhoneContext.Provider>
                </main>
              </div>
            </Spin>
          )}
        </div>
      </Layout >
      {
        // Khi mà chiều dài màn hình nhỏ hơn 1280 thì CDrawer sẽ hiện ra ( nó là cái thanh SideNav), nó được mở khi bấm vào biểu logo Công ty
        stateBreakPoint <= 1280 &&
        <CDrawer
          isOpen={!collapsedSider}
          className="customize-menu-mobile"
          widths={260}
          positon="left"
          handleOnClose={() => {
            setCollapsedSider(!collapsedSider);
            }}

          >
            {/* MenuItem là menu phụ kia mà responsive */}
          <div className="t-layouts_menu_mobile">
            <MenuItem optionMenu={MenuCRMMobile as ItemMenu[]} handleClickItem={() => {
            }} />
          </div>
        </CDrawer>
      }

      {/* Đoạn code này là thư viện hiển thị cái điện thoại */}
      <div
        className={mapModifiers("t-layouts_wrapper_telephone-show",)}
      >
        <Telephone
          handleAccept={() => { AcceptCall(); }}
          handleHangUp={() => { hangupCall(); setExternalNumber(undefined as any); handleSetStateCall('none') }}
          customerNameRinging={infoCommingPhone.nameCustomer}
          customerInfo={`${infoCommingPhone.type === "customer" ? "Đã đặt lịch" : "Chưa đặt lịch"}`}
          phone={externalNumber}
          isOpen={!_.isUndefined('')}
          handleClosePhone={() => { handleSetStateConnect('connecting'); }}
          handleClickToCall={(val: string) => { makeCall(val); }}
          handleTranferToCall={(val: string) => { transfer(val, 'BLIND'); }}
          handleCallOutGoing={(phone: string) => {
            handleSetStateConnect('connected');
            handleSetStateCall('callout');
            makeCall(phone);
          }}
          stateCall={stateCall}
          stateConnect={stateConnect}
        />
      </div>
    </div >
  );
};

// PublicLayout.defaultProps = {
//   children: undefined,
//   isShowPopupChat: false,
//   isShowPopupTelephone: false,
// };

export default PublicLayout;