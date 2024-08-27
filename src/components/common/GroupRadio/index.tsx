/* eslint-disable @typescript-eslint/no-unused-vars */
import { Radio } from 'antd';
import React from 'react';
import "./index.scss"
import Typography from '../Typography';
import { handleRenderGUID } from '../../../utils/functions';

type LevelRadio = '1' | '2' | '3' | '4' | '5';

export interface GroupRadioType {
  id: number;
  label: string;
  value: string;
  color?: string;
  level?: LevelRadio;
  [x: string]: any;
}

interface GroupRadioProps {
  options: GroupRadioType[];
  handleOnchangeRadio?: (item: GroupRadioType) => void;
  defaultVal?: GroupRadioType;
  value?: GroupRadioType;
  isDisable?: boolean;
}

const GroupRadio: React.FC<GroupRadioProps> = ({
  options, handleOnchangeRadio, defaultVal, value, isDisable
}) => (
  <div className="a-group_radio">
    <Radio.Group
      onChange={(e: any) => {
        if (handleOnchangeRadio) {
          const data = options.find((ix) => ix.value === e.target.value);
          handleOnchangeRadio(data as GroupRadioType);
        }
      }}
      defaultValue={defaultVal?.value}
      disabled={isDisable}
      value={value?.value}
    >
      {options.length && options.map((item) => (
        <Radio key={`${item.id}-${handleRenderGUID()}`} value={item.value}>
          <Typography content={item.label} styles={{ color: item?.color || '#04566e' }} />
        </Radio>
      ))}
    </Radio.Group>
  </div>
);

GroupRadio.defaultProps = {
};

export default GroupRadio;
