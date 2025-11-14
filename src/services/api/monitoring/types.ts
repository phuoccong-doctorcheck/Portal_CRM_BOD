export interface MonitorItem {
  id: number;
  m_datetime: string;
  m_type: string;
  m_note: string;
  m_status_code: number;
  m_status: string;
  server_ip_address: string;
}

export interface MonitorResponse {
  data: MonitorItem[];
  message: string;
  status: boolean;
  client_ip: string;
}
