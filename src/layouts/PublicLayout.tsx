import { ReactNode, useEffect, useState } from 'react'
import TopLoader from '../components/TopLoader';
import Layout from 'antd/es/layout/layout';
import Footer from './../components/Footer/index';
import HeaderNav from './../components/HeaderNav/index';
import Cookies from "js-cookie";
import "./index.scss"
import { Spin } from 'antd';
import logo from '../assets/images/short_logo.svg';
import { getUserMedia } from "./index.controller";
interface IProps {
    children: ReactNode;
}

const PublicLayout = ({children} : IProps) => {
  
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const checkToken = Cookies.get("token");
  const [loadingPage, setLoading] = useState<boolean>(true);
  useEffect(() => {
   
    if (!checkToken) {
      window.history.pushState(null, "", "/pending");
      window.location.reload();
    }
  }, []);
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
  return (
    <div>
      <TopLoader/>
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
              //  handleLogin={handleLogin}
                // handleClickLogo={() => {
                //   if (stateBreakPoint > 1280) {
                //     navigators('/conversion');
                //     sessionStorage.setItem('indexMenu', `2`)
                //   } else {
                //     setCollapsedSider(!collapsedSider)
                //   }
                // }}
              />
              {/* Đây là thanh SideNav kế bên   */}
              
                    {children}
                  <Footer/>
            </Spin>
          )}
       
        
       
      </div>
      </Layout>
    </div>
  )
}

export default PublicLayout
