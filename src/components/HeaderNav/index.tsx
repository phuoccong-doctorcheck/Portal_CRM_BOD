import { useEffect, useState } from 'react'
import "./index.scss"
import mapModifiers from '../../utils/functions'
import logoActive from "../../assets/images/short_logo.svg"
import Input from '../common/Input'
import Icon from '../common/Icon'
import Typography from '../common/Typography'
import UserDropdown from '../common/UserDropdown'
import style from './../../../node_modules/dom-helpers/esm/css';
import { useAppDispatch } from '../../hooks/hooks'
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";
const OptionUser = [
  { id: 1, label: 'Trang cá nhân', value: '/profile', handleClick: () => { } },
  { id: 2, label: 'Kết nối Facebook', value: '/facebook', handleClick: () => {  } },
  { id: 3, label: 'đăng xuât', value: '/logout', handleClick: () => { } },
];
interface HeaderNavProps {
  handleClickMenuItem: () => void;
  handleLogin?: () => void;
  handleClickLogo?: () => void;
  isSortHeader?: boolean;
  currentWidth?: number;
}
const HeaderNav: React.FC<HeaderNavProps> = ({
  handleClickMenuItem, handleLogin, handleClickLogo, isSortHeader, currentWidth
}) => {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const getName = Cookies.get('fullname');
  const getUsername = Cookies.get('username');
  const getLastname = Cookies.get('lastname');

  const [name, setName] = useState("Nguyễn Phước Công");
  const getRoles = localStorage.getItem('roles');
  const [listRoles, setListRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [indexActive, setIndexActive] = useState(0);
  const storageIndexMenu = sessionStorage.getItem('indexMenu');
  
  const checkRoles = (roleNames: string[]) => {
    return listRoles && listRoles?.some((role: any) => roleNames?.some((i => i === role?.role_name || i === 'normal')));
  };

  useEffect(() => {
    if (storageIndexMenu) {
      setIndexActive(Number(storageIndexMenu));
    } else {
      setIndexActive(Number(sessionStorage.getItem('indexMenu')));
    }
  }, [])
  return (
    <div className={mapModifiers('t-header')}>
    <div className={mapModifiers('t-header_wrapper')} style={{paddingLeft:"7%"}}>
      {/* <div
        className={mapModifiers('t-header_wrapper_logo', 'active')}
        // onClick={handleClickLogo}
      >
        <img src={logoActive} alt="logo" />
      </div> */}
      <div className={mapModifiers('t-header_wrapper_nav', Number(currentWidth) < 600 && 'scale')}>
        {/* <div className="t-header_wrapper_nav_left">
          <Input
            variant="borderRadius"
            type="text"
            id=""
            isSearch
           // value={keySearch}
            placeholder='Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng'
           // onChange={(e) => { setKeySearch(e.target.value); }}
            // handleEnter={async () => {
            //   if (keySearch.trim()) {
            //     await getSearchByKey(keySearch);
            //     setIsLoading(true);
            //   }
            //   else {
            //     toast.error('Không thể tìm kiếm với một giá trị rỗng');
            //   }
            // }}
            iconName='search'
            isLoading={false}
          />
        </div> */}
        <div className={mapModifiers("t-header_wrapper_nav_right", isSortHeader && 'short')} >
        
           <div className="t-header_wrapper_nav_right_insurance"  
           style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}
          //  onClick={() => {
          //             setIsOpenPopup(true);
                  
          // }}
          >

           <div style={{marginBottom:"3px", marginRight:"5px"}}><Icon iconName="list_text" size="28x28" style={{marginRight:"5px",color:"#333"}}/></div> 
            {Number(currentWidth) > 900 &&
              <Typography  content={"Báo cáo doanh thu"}  modifiers={['12x18', '400', 'center','blueNavy']}/>
            }
          </div>
          {/* Button Báo cáo kênh */}
         
        
        
         
         
          {/* ===> Responsive chiều ngang càng nhỏ thì các button sẽ biến mất theo thứ tự đã code ở trên */}
        </div>
      </div> 
      <div style={{width:"15%"}}><UserDropdown optionsChild={OptionUser} name={name} iconLogo={logoActive} /></div> 
    </div>     
  </div>
  )
}

export default HeaderNav
