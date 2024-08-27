import { Popover } from 'antd';
import "./index.scss"
import React from 'react';
import { Cplacement } from '../CTooltip';
import mapModifiers from '../../../utils/functions';
import Typography from '../Typography';
import Input from '../Input';


type TriggerPopoverType = 'hover' | 'focus' | 'click';
type Variant = 'normal' | 'padding';

interface CPopoverProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  title?: string;
  placement?: Cplacement;
  open?: boolean;
  handleOnChange?: (data: any) => void;
  triggerType?: TriggerPopoverType;
  className?: string;
  classNamePopover?: string;
  isHeightFit?: boolean;
  style?: Variant;
  popoverRef?: any;
  isSearch?: boolean;
  valueSearch?: string;
  handleOnChangeSearch?: (value: string) => void;
  handleSearch?: () => void
}

const CPopover: React.FC<CPopoverProps> = ({
  children, content, title, placement, open, handleOnChange, triggerType, className, isHeightFit, style,
  classNamePopover, popoverRef, isSearch, valueSearch, handleOnChangeSearch, handleSearch, ...props
}) => {
  return (
    <Popover
      open={open}
      placement={placement}
      title={(
        <div className={mapModifiers('o-popover_header', isSearch && 'search')}>
          <Typography content={title} modifiers={['16x28', 'blueNavy']} />
          {isSearch && (
            <Input
              id='search-booking'
              type="text"
              variant="simple"
              value={valueSearch}
              placeholder='Nhập tên tin nhắn nhanh...'
              onChange={(event: any) => { if (handleOnChangeSearch) handleOnChangeSearch(event.target.value); }}
              handleEnter={handleSearch}
              handleClickIcon={handleSearch}
              iconName='search'
            />
          )}
        </div>
      )}
      content={(<div className={className}>
        {content}
      </div>)}
      overlayClassName={mapModifiers("o-popover", isHeightFit ? 'fit' : '', style, classNamePopover)}
      arrow
      trigger={triggerType}
      ref={popoverRef}
      onOpenChange={handleOnChange}
      {...props}
    >
      {children}
    </Popover>
  );
}

CPopover.defaultProps = {
  children: undefined,
  triggerType: 'click',
  isHeightFit: false,

};

export default CPopover;
