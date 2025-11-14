export interface TargetItem {
  ads_account_id: string;
  target_id: number;
  target_value: number;
  target_unit: string;
  criteria_id: string;
  criteria_code: string;
  criteria_name: string;
  from_date: string; // ISO string, e.g., "2025-04-01T21:24:07+07:00"
  to_date: string;
  is_high_light: boolean;
  is_show: boolean
  items: any[]; // Hoặc thay thế bằng kiểu cụ thể nếu bạn có định nghĩa rõ ràng hơn
}

export interface TargetResponse {
  data: TargetItem[];
  message: string;
  status: boolean;
  client_ip: string;
}


///
export interface Target {
  criteria_id: string;
  criteria_code: string;
  criteria_name: string;
  target_id: number;
  target_value: number;
  target_unit: string;
  result_unit: string;
  from_date: string;
  to_date: string;
  ads_account_id: string;
}

export interface DataReport {
  ads_account_id: string;
  amount_spent: number;
  post_comments: number;
  new_messaging_contacts: number;
  tag_inbox_warm: number;
  tag_inbox_hot: number;
  tag_leave_phone_number: number;
  tag_appointment: number;
  erp_so_luong_khach_hang_den_kham: number;
  erp_doanh_thu_thuc_te_trong_ngay: number;
  gia_tri_kham_trung_binh_thuc_te: number;
  pancake_crm_so_luong_dat_hen: number;
  pancake_crm_doanh_thu_du_kien: number;
  so_luot_hoan_thanh_kham: number;
  date: string;
}

export interface ReportData {
  targets: Target[];
  data_reports: DataReport[];
}

export interface ReportResponse {
  data: ReportData;
  message: string;
  status: boolean;
  client_ip: string;
}
