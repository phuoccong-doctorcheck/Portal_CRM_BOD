/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import mapModifiers from '../../../utils/functions';
import CEmpty from '../CEmpty';
import Typography from '../Typography';


// Định nghĩa kiểu dữ liệu
type TableLayoutType = 'auto' | 'fixed' | undefined;
type RowSelectType = 'checkbox' | 'radio';

interface PublicTableProps {
  listData: any;
  loading?: boolean;
  column: any;
  rowkey?: any;
  heightTable?: number | any;
  size?: SizeType;
  pageSizes?: number;
  tableLayout?: TableLayoutType;
  isPagination?: boolean;
  isbordered?: boolean;
  isNormal?: boolean;
  totalItem?: number;
  isExpandable?: boolean;
  expandedRowKey?: string[];
  rowSelectType?: RowSelectType;
  hideSelectAllRow?: boolean;
  isSimpleHeader?: boolean;
  isHideRowSelect?: boolean;
  isHideHeader?: boolean;
  textHeader?: string;
  className?: string;
  expandedRowKeys?: string[] | number[];
  isHideBody?: boolean;
  showExpandColumn?: boolean;
  defaultExpandAllRow?: boolean;
  virtual?: boolean;
  scroll?: object;
  tableRef?: React.RefObject<HTMLDivElement>;
  handleChangePagination?: (page: any, pageSize: any) => void;
  expandedRender?: (record: any, index: any, indent: any, expanded: any) => React.ReactNode;
  rowClassNames?: (record: any, index: any) => string;
  expandedRowClassNames?: (record: any, index: any, indent: any) => string;
  handleOnClick?: (event: any, record: any, rowIndex: any) => void;
  handleOnDoubleClick?: (event: any, record: any, rowIndex: any) => void;
  handleOnContextMenu?: (event: any, record: any, rowIndex: any) => void;
  handleOnClickHeaderRow?: (record: any) => void;
  handleOnchange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
  handleSelectRow?: (record: any, selected: any, selectedRows: any, nativeEvent: any) => void;
  handleSelectAllRow?: (selected: any, selectedRows: any, changeRows: any) => void;
  handleSelectMultiple?: (selected: any, selectedRows: any, changeRows: any) => void;
  onExpand?:(expanded:any, record:any) => void
}

const PublicTableTotal: React.FC<PublicTableProps> = ({
  listData, loading, column, rowkey, size, pageSizes, tableLayout, isPagination, heightTable, showExpandColumn, virtual,
  handleOnClick, handleOnDoubleClick, handleOnContextMenu, handleOnClickHeaderRow, isbordered, isNormal, className,
  handleChangePagination, totalItem, isExpandable, expandedRowKey, expandedRender, rowSelectType, hideSelectAllRow,
  isSimpleHeader, isHideRowSelect, isHideHeader, textHeader, isHideBody, rowClassNames, expandedRowClassNames,
  defaultExpandAllRow, scroll, handleOnchange, tableRef, handleSelectRow, handleSelectAllRow, expandedRowKeys, handleSelectMultiple,onExpand,
  ...props
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>();
  // myRowSelection định nghĩa các hành động khi chọn dòng hoặc chọn nhiều dòng.
  const myRowSelection = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
    },
    onSelectMultiple: (selected: boolean, selectedRows: any[], changeRows: any[]) => { },
  };
   const handleExpand = (expanded: boolean, record: any) => {
    if (onExpand) {
      onExpand(expanded, record);
    }
  };

 // const totalUnitPrice = listData.reduce((sum: number, item: any) => sum + item.unit_price, 0);
  function totalUnitPrice(listData:any) {
    let total = 0;

    listData.forEach((group:any) => {
      group.service_group_item.forEach((item:any) => {
        total += item.unit_price * item.quantity;
      });
    });

    return total;
  }
   function totalAmount(listData:any) {
    let total = 0;

    listData.forEach((group:any) => {
      group.service_group_item.forEach((item:any) => {
        total += item.total_amount * item.quantity;
      });
    });

    return total;
  }
   function totalCustomerRevenue(listData:any) {
    let total = 0;

    listData.forEach((group:any) => {
      group.service_group_item.forEach((item:any) => {
        total += item.customer_revenue * item.quantity;
      });
    });

    return total;
  }
  function totalCommissionValue(listData:any) {
    let total = 0;

    listData.forEach((group:any) => {
      group.service_group_item.forEach((item:any) => {
        total += item.commission_value * item.quantity;
      });
    });

    return total;
  }
 // const totalCommissionValue = listData.reduce((sum: number, item: any) => sum + item.commission_value, 0);
  return (
    <div className={mapModifiers('m-public_table', isNormal && 'small', isSimpleHeader && 'simple', isHideBody && 'hide_body', !textHeader?.trim() && 'hide_title')}>
      <Table
        columns={column}
        // dataSource sẽ là data hiển thị
        dataSource={listData}
        // loading kiểu như chờ load data 
        loading={loading}
        virtual={virtual}
        className={className}
        locale={{ emptyText: <CEmpty description="Không có dữ liệu ...!" /> }}
        rowKey={rowkey}
        
        showHeader={!isHideHeader}
        rowSelection={!isHideRowSelect ? {
          checkStrictly: true,
          selections: true,
          selectedRowKeys,
          hideSelectAll: hideSelectAllRow,
          type: rowSelectType,
          ...myRowSelection,
          onSelect: handleSelectRow,
          onSelectAll: handleSelectAllRow,
          onSelectMultiple: handleSelectMultiple,
        } : undefined}
        scroll={scroll}
        sticky={false}
        onRow={(record, rowIndex) => ({
          onClick: (event: any) => { event.preventDefault(); if (handleOnClick) handleOnClick(event, record, rowIndex) }, // one click row
          onDoubleClick: (event: any) => { if (handleOnDoubleClick) handleOnDoubleClick(event, record, rowIndex); }, // double click row
          onContextMenu: event => { if (handleOnContextMenu) handleOnContextMenu(event, record, rowIndex); },  // right button click row
        })}
        onHeaderRow={(columns, index) => ({
          onClick: handleOnClickHeaderRow, // click header row
        })}
        ref={tableRef as any}
        pagination={isPagination ? {
          position: ['bottomCenter'],
          pageSize: pageSizes,
          showSizeChanger: false,
          responsive: true,
          showQuickJumper: true,
          locale: { jump_to: 'Chuyển đến trang', page: '' },
          defaultCurrent: 1,
          defaultPageSize: 15,
          pageSizeOptions: ['10', '20', '50', '100'],
          total: totalItem,
          onChange: (page, pageSize) => { if (handleChangePagination) handleChangePagination(page, pageSize); },
        } : false}
        size={size || 'small'}
        onChange={handleOnchange}
        tableLayout={tableLayout as any}
        bordered={isbordered}
        rowClassName={rowClassNames}
        expandable={ {
          expandedRowKeys: expandedRowKeys,
          fixed: true,
          showExpandColumn: showExpandColumn,
          expandedRowClassName: expandedRowClassNames,
          expandedRowRender: expandedRender,
          defaultExpandAllRows: defaultExpandAllRow,
          expandRowByClick: false,
          rowExpandable: (record) => true,
          onExpand: handleExpand,
        }}
        title={() => (textHeader ? <Typography content={textHeader} modifiers={['16x24', '500', 'left']} /> : undefined)}
        summary={() => (
          <Table.Summary>
            {/* Note */}
            {/* <Table.Summary.Row> */}
            {/* <Table.Summary.Cell index={column.length - 1}  className="ant-table-summary-cell">
              <Typography content="Tổng tiền" modifiers={['13x18', '600', 'center', 'main']} />
           </Table.Summary.Cell> */}
            {/* <Table.Summary.Cell index={column.length}  className="ant-table-summary-cell">
              <Typography content="" modifiers={['13x18', '600', 'center', 'main']} />
           </Table.Summary.Cell> */}
            {/* <Table.Summary.Cell index={column.length}  className="ant-table-summary-cell">
              <Typography content="Tổng tiền" modifiers={['13x18', '600', 'center', 'main']} />
           </Table.Summary.Cell> */}
            {/* <Table.Summary.Cell index={1} colSpan={column.length } className="ant-table-summary-cell">
              <Typography content="Note" modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"start",paddingLeft:"8px",paddingRight:"8px"}}/>
           </Table.Summary.Cell> */}
           {/* <Table.Summary.Cell index={column.length - 1} className="ant-table-summary-cell">
           
             <Typography content={totalUnitPrice(listData)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"end",paddingLeft:"8px",paddingRight:"8px"}}/> 
            </Table.Summary.Cell>
            <Table.Summary.Cell index={column.length - 1} className="ant-table-summary-cell" >
             <Typography content={totalCommissionValue(listData)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} styles={{textAlign:"end",paddingLeft:"8px",paddingRight:"8px"}}/> 
            </Table.Summary.Cell> */}
            {/* </Table.Summary.Row> */}

            {/* Tổng tiền */}
             <Table.Summary.Row style={{background:"#f0f0f0"}}>
            {/* <Table.Summary.Cell index={column.length - 1}  className="ant-table-summary-cell">
              <Typography content="Tổng tiền" modifiers={['13x18', '600', 'center', 'main']} />
           </Table.Summary.Cell> */}
            <Table.Summary.Cell index={column.length}  className="ant-table-summary-cell">
              <Typography content="" modifiers={['13x18', '600', 'center', 'main']} />
           </Table.Summary.Cell>
            <Table.Summary.Cell index={column.length}  className="ant-table-summary-cell">
              <Typography content="Tổng tiền" modifiers={['13x18', '600', 'center', 'main']} />
           </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={column.length - 6} className="ant-table-summary-cell">
              <Typography content="" modifiers={['13x18', '600', 'center', 'main']} />
              </Table.Summary.Cell>
               <Table.Summary.Cell index={column.length - 1} className="ant-table-summary-cell">
             <Typography content={totalUnitPrice(listData)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'cg-red']} styles={{textAlign:"end",paddingLeft:"8px",paddingRight:"8px"}}/> 
            </Table.Summary.Cell>
            <Table.Summary.Cell index={column.length - 1} className="ant-table-summary-cell" >
             <Typography content={totalAmount(listData)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'cg-red']} styles={{textAlign:"end",paddingLeft:"8px",paddingRight:"8px"}}/> 
            </Table.Summary.Cell>
           <Table.Summary.Cell index={column.length - 1} className="ant-table-summary-cell">
             <Typography content={totalCustomerRevenue(listData)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'cg-red']} styles={{textAlign:"end",paddingLeft:"8px",paddingRight:"8px"}}/> 
            </Table.Summary.Cell>
            <Table.Summary.Cell index={column.length - 1} className="ant-table-summary-cell" >
             <Typography content={totalCommissionValue(listData)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'cg-red']} styles={{textAlign:"end",paddingLeft:"8px",paddingRight:"8px"}}/> 
              </Table.Summary.Cell>
               <Table.Summary.Cell index={column.length - 1} className="ant-table-summary-cell" >
             <Typography content="" modifiers={['13x18', '600', 'center', 'cg-red']} styles={{textAlign:"end",paddingLeft:"8px",paddingRight:"8px"}}/> 
            </Table.Summary.Cell>
          </Table.Summary.Row>
          </Table.Summary>
        )}
        {...props}
      />
    </div>
  );
};
PublicTableTotal.defaultProps = {
  size: 'small',
  pageSizes: 15,
  tableLayout: undefined,
  isPagination: false,
  isNormal: false,
  isbordered: false,
  heightTable: Number(window.innerHeight),
  isExpandable: false,
  isSimpleHeader: false,
  isHideRowSelect: false,
  isHideHeader: false,
  rowSelectType: 'checkbox',
  showExpandColumn: false,
  scroll: { y: 900, x: '100%' },
  defaultExpandAllRow: true,
  virtual: false,
};

export default PublicTableTotal;
