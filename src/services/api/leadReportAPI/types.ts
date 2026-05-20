export interface DashboardResponse {
  data: DashboardData[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface DashboardData {
  page_id: string;
  report_row: string;
  report_colunm: string;
  report_colunm_parent: string | null;
  report_colunm_child: string | null;
  report_date: string | null;
  report_value: number;
  sequence_row: number;
  sequence_colunm: number;
  table_index: number;
  mm: number;
  yyyy: number;
  ids: string | null;
  DT_Key: string;
  DrillKey: string | null;
}



/* ===================== Types ===================== */

export interface ApiResponse  {
  data: { Tables: TableBlock[] }
  message: string
  status: boolean
  client_ip: string
}


export interface TableBlock  {
  TableIndex: number
  Columns: {
    SequenceColumn: number
    ColumnName: string
    ColumnDate: string | null
  }[]
  Rows: {
    ReportRow: string
    SequenceRow: number
    Cells: Record<
      string,
      {
        ReportRow: string
        ReportColumn: string
        ReportColumnParent: string | null
        ReportColumnChild: string | null
        ReportDate: string | null
        ReportValue: number
        SequenceRow: number
        SequenceColumn: number
        TableIndex: number
        DT_Key: string
        DrillKey: string | null
        FontColor: string | null
        LinkUrl: string | null
        FormattedValue: string
        CssClass: string
        IsDayColumn: boolean
      }
    >
  }[]
}


// ===== Enums / Unions (có thể nới rộng nếu phát sinh thêm giá trị) =====
export type DashboardSection =
  | "TK_SCHEDULE"
  | "TK_ACTUAL"
  | "F2"
  | "F3_KTQ_DK_SCHEDULE"
  | "F3_NS_TSUT_ACTUAL"
  | "F3_NS_TSUT_SCHEDULE"
  | "F3_KTQ_BENH_ACTUAL"
  | "WOM";

export type DashboardMetric =
  | "TOTAL"
  | "NONE"
  | "OTHER"
  | "DVL"
  | "KTQ"
  | "NS_TC"
  | "NS_TSUT"
  | "TKHTNK"
  | "TKHTTH"
  | "TKHTTL"
  | "TKTCNK"
  | "TKTCTH"
  | "TKTCTL";

// ISO datetime string như: "2026-01-01T00:00:00+07:00"
export type IsoDateTimeString = string;

// ===== Core types =====
export interface MetricsDailyItem {
  report_date: IsoDateTimeString;
  section: DashboardSection;
  metric: DashboardMetric;
  cnt: number;
  revenue: number; // giữ number, nếu muốn chính xác tiền tệ có thể đổi sang string/decimal
}

export interface MetricsMonthData {
  month: number; // 1-12
  year: number;
  launch_source_group_id: number;
  days_in_month: number;
  items: MetricsDailyItem[];
}

export interface MetricsMonthResponse {
  data: MetricsMonthData;
  status: boolean;
  client_ip: string;
  message: string;
}

// ===== Optional: nếu bạn muốn “mở” section/metric không giới hạn =====
// export interface MetricsDailyItem {
//   report_date: IsoDateTimeString;
//   section: string;
//   metric: string;
//   cnt: number;
//   revenue: number;
// }
