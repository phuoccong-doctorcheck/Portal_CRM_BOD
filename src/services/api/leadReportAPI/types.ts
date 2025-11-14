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