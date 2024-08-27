/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */


import React from 'react';

import introDc from '../../assets/images/intro_dc.jpg';
import PublicLayout from '../../layouts/PublicLayout';
import "./index.scss"
export interface FormAddTodoStep {
  id: number;
  name: string;
  isDone: boolean;
}

const Dashboard: React.FC = () => {
  return (

      <div className="p-dashboard">
        <div className="p-dashboard_intro">
          <img src={introDc} />
        </div>
      </div>
    
  );
};
export default Dashboard;
