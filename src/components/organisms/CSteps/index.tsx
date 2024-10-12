/* eslint-disable @typescript-eslint/no-unused-vars */
import { Steps } from 'antd';
import React, { useState } from 'react';

interface StepType {
  name: string;
  component: React.ReactNode;
}

interface CStepsProps {
  children?: React.ReactNode;
  active?: number;
  options: StepType[];
}

const CSteps: React.FC<CStepsProps> = ({
  children, active, options,
}) => {
  const [step, setStep] = useState(active);
  const items = options.map((item) => ({ key: item.name, title: item.name }));
  return (
    <div className="o-steps">
      <Steps current={active} items={items} />
      <div className="o-steps_component">{options[(Number(active))].component}</div>
      <div className="o-steps_btn">
        {/* 2 */}
      </div>
    </div>
  );
};

CSteps.defaultProps = {
  children: undefined,
};

export default CSteps;
