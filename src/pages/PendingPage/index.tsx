
import Cookies from 'js-cookie';
import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import "./index.scss"
import "./mobile.scss"
import "./tablet.scss"
const PagePending  = () => {
  const navigator = useNavigate();
  const checkToken = Cookies.get('token');

  useEffect(() => {
    if (!checkToken) {
      const timeOut = setTimeout(() => {
        navigator('/login');
      }, 1500);

      return () => {
        clearTimeout(timeOut)
      }
    }
  }, []);

  return (
    <div className='p-pending'>
      <Loading variant="fullScreen" isShow size="medium" />
    </div>
  );

}
export default PagePending;
