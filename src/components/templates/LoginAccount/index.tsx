/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import Button from 'components/atoms/Button';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginWithAccount } from 'services/api/Login';
import { getIDADS } from 'services/api/report_plan';
import { InfoUserType } from 'services/types';
import { getMyTask } from 'store/customerInfo';
import { isLoading, isLogined } from 'store/example';
import {
  setInforUser,
  setInfoUserAgent,
  setRoleUser,
  setShortName,
  setTokenUser,
} from 'store/home';
import { useAppDispatch } from 'store/hooks';

interface FormLoginProps {
  children?: React.ReactNode;
}

const LoginAccount: React.FC<FormLoginProps> = () => {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const [dataLogin, setDataLogin] = useState({
    username: '', password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ username: '', password: '' });

  const { mutate: loginAccount } = useMutation(
    'post-footer-form',
    (data: any) => loginWithAccount(data),
    {
      onSuccess: (data: any) => new Promise((resolve, reject) => {
        try {
          setLoading(false);
          const {
            roles, shortname, employee_signature_name, employee_id, fullname, employee_team_id, username, department_id, mainscreen, erp_code, token, employee_group, user_call_agent, user_country_id, user_country_phone_prefix, pancakeToken, ...prevData
          } = data.data;
          Cookies.set('token', `DC${token}`);
          Cookies.set('repository', JSON.stringify({
            username: username,
            employee_id: employee_id,
            department_id: department_id,
            fullname: fullname,
            shortname: shortname,
            mainscreen: mainscreen,
            token: token,
            employee_group: employee_group,
            employee_team_id: employee_team_id,
            user_country_id: user_country_id,
            user_country_phone_prefix: user_country_phone_prefix,
            avatar: null
          }), { expires: new Date(new Date().getTime() + (20 * 60 * 60 * 1000)) }); // thời gian hết hạn là 20 giờ
          getIDADS().then((data) => {
const transformedData = data.data.dm_ads_accounts.map((item:any) => ({
  ...item,
  value: item.ads_account_id,
  label: item.ads_account_id,
}));

// Thêm object "all" vào đầu mảng
const finalData = [
  //  {
  //    ads_account_id: "all",
  //    ads_account_name: null,
  //    ads_account_type: "fb",
  //    value: "all",
  //    label: "Tất cả"
  //  },
  ...transformedData
];

            localStorage.setItem('adsAccounts', JSON.stringify(finalData));
            const transformedDataC = data.data.dm_evaluation_criterias.map((item:any) => ({
  ...item,
  value: item.criteria_id,
  label: item.criteria_name,
}));

// Thêm object "all" vào đầu mảng
const finalDataC = [
 
  ...transformedDataC
];

            localStorage.setItem('adsCri', JSON.stringify(finalDataC));
            //
            const transformedDataMonitorSN = data.data.dm_system_backup_type.map((item:any) => ({
  ...item,
  value:  item.system_name + item.backup_type,
  label: item.system_name + "(" + (item.backup_type) + ")",
}));

// Thêm object "all" vào đầu mảng
const finalDataSN = [
  //  {
  //    ads_account_id: "all",
  //    ads_account_name: null,
  //    ads_account_type: "fb",
  //    value: "all",
  //    label: "Tất cả"
  //  },
  ...transformedDataMonitorSN
];

            localStorage.setItem('dataMNSN', JSON.stringify(finalDataSN));
              //
            const transformedDataMonitorST = data.data.dm_monitor_service_type.map((item:any) => ({
              ...item,
              value:  item.name,
              label: item.name,
              is_show: item.is_show
            }));

// Thêm object "all" vào đầu mảng
const finalDataST = [
  //  {
  //    ads_account_id: "all",
  //    ads_account_name: null,
  //    ads_account_type: "fb",
  //    value: "all",
  //    label: "Tất cả"
  //  },
  ...transformedDataMonitorST
];

            localStorage.setItem('dataMNST', JSON.stringify(finalDataST));
            //
            const transformedDataMonitorC = data.data.dm_status_code.map((item:any) => ({
              ...item,
              value:  item.code,
              label: item.code,
            }));

// Thêm object "all" vào đầu mảng
const finalDataMC = [
  //  {
  //    ads_account_id: "all",
  //    ads_account_name: null,
  //    ads_account_type: "fb",
  //    value: "all",
  //    label: "Tất cả"
  //  },
  ...transformedDataMonitorC
];

            localStorage.setItem('dataMNC', JSON.stringify(finalDataMC));
              const transformedDataMonitorBT = data.data.dm_system_backup_type.map((item:any) => ({
  ...item,
  value: item.system_name + item.backup_type,
  label: item.backup_type + "(" + item.system_name + ")",
}));

// Thêm object "all" vào đầu mảng
const finalDataBT = [
  //  {
  //    ads_account_id: "all",
  //    ads_account_name: null,
  //    ads_account_type: "fb",
  //    value: "all",
  //    label: "Tất cả"
  //  },
  ...transformedDataMonitorBT
];

            localStorage.setItem('dataMNBT', JSON.stringify(finalDataBT));
          });
          
          const newRole: any[] = [
            ...roles,
            ["quocthinh.le"].includes(username) ? {
              role_name: "directer",
              role_display_name: "bot",
              menu_display_name: "bot",
              menu_display_icon: "fas fa-question-circle",
              menu_type: "all",
              menu_order_number: 10,
              module: "bot",
              is_default: false
            } :
              {
                role_name: "normal",
                role_display_name: "CS",
                menu_display_name: "CS",
                menu_display_icon: "fas fa-question-circle",
                menu_type: "all",
                menu_order_number: 3,
                module: "admincs",
                is_default: false
              },
            employee_team_id === "BOD" && {
              role_name: "BOD",
              role_display_name: "bot",
              menu_display_name: "bot",
              menu_display_icon: "fas fa-question-circle",
              menu_type: "all",
              menu_order_number: 10,
              module: "bot",
              is_default: false
            },
          ];
          dispatch(setTokenUser(`DC${prevData.token}`));
          dispatch(getMyTask({ task_status: 'inprogress', isAssignMe: false }));
          Cookies.set('islogin', `${true}`);
          Cookies.set('shortname', shortname);
          Cookies.set('username', username);
          Cookies.set('fullname', fullname);
          Cookies.set('signature_name', employee_signature_name);
          localStorage.setItem('setResource', '1');
          localStorage.setItem('employee_id', employee_id);
          Cookies.set('employee_team', employee_team_id);
          Cookies.set('user_call_agent', user_call_agent);
          Cookies.set('roles', JSON.stringify(roles), { expires: 7 }); // expires là số ngày cookie tồn tại
          localStorage.setItem('roles', JSON.stringify(newRole));
          sessionStorage.setItem('indexMenu', '0')
          localStorage.setItem('pancakeToken', pancakeToken)
          localStorage.setItem('erp_code', erp_code)
          dispatch(isLogined(true));
          dispatch(isLoading(true));
          dispatch(setShortName(shortname));
          dispatch(setRoleUser(newRole));
          dispatch(setInforUser(prevData as InfoUserType));
          const roles1 = Cookies.get('roles');
          console.log(shortname)
          // Kiểm tra nếu chuỗi không phải là `undefined` hoặc `null`, thì parse nó thành mảng
          const rolesArray = roles1 ? JSON.parse(roles1) : [];
          console.log(rolesArray[0]?.role_name)
        // if (rolesArray[0]?.role_name === "businessplan")
          // {
          //      navigator('/bussiness-plan');
          // }
          // else if (rolesArray[0]?.role_name === "cashflow")
          // {
          //   navigator('/cash-flow');
          // }
          // else {
          if (shortname === "Admin") {
             navigator('/monitor-backup');
          }
          else {
            navigator('/report-fb-ads');
          }
           
          // }
          resolve(true);
        } catch (err) {
          console.log("🚀 ~ file: index.tsx:96 ~ onSuccess: ~ err:", err)
          reject(err);
        }
      }),
      onError: () => {
        setError({ username: 'Tài khoản không chính xác !', password: 'Mật khẩu không chính xác !' });
        toast.error('Vui lòng kiểm tra lại tài khoản và mật khẩu');
        setLoading(false);
      },
    },
  );

  const handleValidate = () => {
    if (!dataLogin.username?.trim() || !dataLogin.password?.trim()) {
      if (!dataLogin.password.trim()) {
        setError({ ...error, password: !dataLogin.password?.trim() ? 'Mật khẩu là trường bắt buộc !' : '', username: !dataLogin.username?.trim() ? 'Tài khoản là trường bắt buộc !' : '' });
      }
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!handleValidate()) return;
    setError({ username: '', password: '' });
    setLoading(true);
    await loginAccount({ userName: dataLogin.username, passwords: dataLogin.password });
  };

  return (
    <div className="t-loginaccount">
      <form>
        <Input
          id="user_name"
          placeholder="Tài khoản đăng nhập"
          label="Tên đăng nhập"
          autoFocus
          onChange={(e) => {
            setDataLogin({ ...dataLogin, username: e.target.value });
            setError({ ...error, username: '' });
          }}
          error={error.username}
          handleEnter={onSubmit}
          variant="simple"
          value={dataLogin.username}
        />

        <Input
          id="_password"
          placeholder="Mật khẩu"
          label="Mật khẩu"
          type="password"
          isPassword
          onChange={(e) => {
            setDataLogin({ ...dataLogin, password: e.target.value });
            setError({ ...error, password: '' });
          }}
          error={error.password}
          handleEnter={onSubmit}
          variant="simple"
          value={dataLogin.password}
        />
        <div className="t-loginaccount_btn">
          <Button modifiers={['foreign']} isLoading={loading} disabled={loading} onClick={onSubmit}>
            <Typography
              content="đăng nhập"
              modifiers={['500', '18x32', 'capitalize', 'white']}
            />
          </Button>
        </div>
      </form>
    </div>
  );
};

LoginAccount.defaultProps = {
  children: undefined,
};

export default LoginAccount;
