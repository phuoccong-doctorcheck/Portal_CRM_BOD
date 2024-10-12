

export interface loadKPIDaysView {
  data: {
    [x: string]: any;
    data: loadKPIDaysViewItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
export interface loadKPIDaysViewItem {
  employee_id: string;
  facebook_id: string
  employee_name: string;
  start_date: Date;
  end_date: Date;
  kpi_id: number;
  kpi_name: string;
  kpi_type_id: number;
  kpi_type_name: string;
  actual_value: number;
  hot_customers?: number;
  warm_customers?: number;
  cold_customers?: number;
  status: string;
  details?: {
    launch_source_group_id: number,
    launch_source_group_name: string,
    actual_value: number
  }
}


export interface loadKPIDaysType {
  employee_id: string
  employee_name: string
  data: {
    [x: string]: any;
    list_kpis: loadKPIDaysItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
export interface loadKPIDaysItem {
  kpi_assign_id: number;
  kpi_id: number
  kpi_code: string;
  title: string;
  kpi_name: string;
  number_chats?: number;
  number_appointments?: any;
  number_inbox?: any;
  number_hot_customers?: any;
  number_warm_customers?: any;
  number_cold_customers?: any;
}
