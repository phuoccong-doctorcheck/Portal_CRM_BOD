/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useNavigate } from 'react-router-dom';

import imgErr from '../../assets/images/error.png';
import Typography from '../common/Typography';
import Button from '../common/Button';
import PublicLayout from '../../layouts/PublicLayout';
import "./index.scss"
const CommingSoon: React.FC = () => {
  const navigator = useNavigate();
  return (
    
      <div className="p-comming_soon">
        <div className="p-comming_soon_wrap">
          <div className="p-comming_soon_wrap_title">
            <Typography type="h2" content="Opps...! Page not found" />
            <Button onClick={() => navigator('/')}>
              <Typography type="p" content="Quay lại trang chủ" />
            </Button>
          </div>
          <div className="p-comming_soon_wrap_img">
            <img src={imgErr} alt="error" />
          </div>
        </div>
      </div>
   
  );
};

export default CommingSoon;
