  export interface BusinessPlanReport  {
  data: {
    title: string;
    items: ReportItem[]; // Array of ReportItem for main items
  };
  message: string;
  status: boolean;
  client_ip: string;
}

export interface ReportItem {
  id: string;
  item_label: string;
  item_value: number | null;
  sequence: number;
  items: ReportItem[]; // Recursive type for nested items
}