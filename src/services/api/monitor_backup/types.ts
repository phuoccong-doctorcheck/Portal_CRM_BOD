export interface BackupLog {
  id: number;
  check_date: string; // ISO date string
  performed_by: string;
  system_name: string;
  backup_type: string;
  target_name: string | null;
  target_path: string | null;
  backup_size_gb: number;
  restore_result: string;
  notes: string;
  created_at: string; // ISO date string
}

export interface BackupResponse {
  data: BackupLog[];
  message: string;
  status: boolean;
  client_ip: string;
}
