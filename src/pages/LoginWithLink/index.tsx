/* eslint-disable @typescript-eslint/no-unused-vars */
import Loading from 'components/atoms/Loading';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginWithLink } from 'services/api/Login';
import { InfoUserType } from 'services/types';
import { isLoading, isLogined } from 'store/example';
import { setInfoUserAgent, setInforUser, setRoleUser, setShortName, setTokenUser } from 'store/home';
import { useAppDispatch } from 'store/hooks';

const LoginWithLink: React.FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const [isSendAPI, setIsSendAPI] = useState(true)

  const searchParams = new URLSearchParams(location.search);
  const usernames = searchParams.get('username');
  const auth = searchParams.get('auth');
  const urlRedirect = searchParams.get('returnUrl');

  const { mutate: loginCRM } = useMutation(
    'post-footer-form',
    (data: any) => loginWithLink(data),
    {
      onSuccess: (data) => {
        const {
          user_call_agent, roles, lastname, employee_signature_name, employee_id, fullname, employee_team_id, ...prevData
        } = data.data;
        Cookies.set('token', `DC${prevData.token}`);
        dispatch(setTokenUser(`DC${prevData.token}`));
        Cookies.set('islogin', `${true}`);
        Cookies.set('lastname', lastname);
        Cookies.set('fullname', fullname);
        Cookies.set('signature_name', employee_signature_name);
        localStorage.setItem('setResource', '1');
        Cookies.set('employee_id', employee_id);
        Cookies.set('employee_team', employee_team_id);
        localStorage.setItem('roles', JSON.stringify(roles));
        Cookies.set('roles', JSON.stringify(roles), { expires: 7 });
        localStorage.setItem('user_call_agent', JSON.stringify(user_call_agent));
        sessionStorage.setItem('indexMenu', '0')
        dispatch(isLogined(true));
        dispatch(isLoading(true));
        dispatch(setShortName(lastname));
        dispatch(setInfoUserAgent(user_call_agent));
        dispatch(setRoleUser(roles));
        dispatch(setInforUser(prevData as InfoUserType));
        if (urlRedirect) {
          navigator(urlRedirect);
        } else {
          const roles = Cookies.get('roles');

          // Kiểm tra nếu chuỗi không phải là `undefined` hoặc `null`, thì parse nó thành mảng
          const rolesArray = roles ? JSON.parse(roles) : [];
          console.log(rolesArray[0]?.role_name)
          if (rolesArray[0]?.role_name === "businessplan")
          {
               navigator('/bussiness-plan');
          }
          else if (rolesArray[0]?.role_name === "cashflow")
          {
            navigator('/cash-flow');
          }
          else {
            navigator('/');
          }
         
        }
      },
      onError: (error) => {
        toast.error(`Đăng nhâp thất bại`)
        navigator('/login');
      },
    },
  )

  const handleLogin = async () => {
    await loginCRM({ username: usernames, token: auth })
  }

  useEffect(() => {
    if (isSendAPI) {
     
      setIsSendAPI(false);
      handleLogin();
    }
  }, [isSendAPI]);

  return (
    <div className='p-login_link'>
      <Loading variant="fullScreen" isShow size="medium" />
    </div>
  );
}

export default LoginWithLink;
