import { Paging } from 'services/api/afterexams/types';

export interface ResponseBeforeExams {
    lead_id: string;
    lead_type: string;
    process_key_id: string;
    customer_id: string;
    master_id: string;
    process_kanban_color: string;
    process_kanban_name: string;
    bg_color: string;
    customer_fullname: string;
    year_of_birth: number;
    gender_name: string;
    customer_phone: string;
    lead_source_display: string;
    lead_note: string;
    conversation_page_id: string;
    conversation_user_id: string;
    conversation_sender_id: string;
    conversation_type: string;
    lead_picture_avatar: null;
    follow_staff: FollowStaff;
    is_customer_converted: boolean;
    is_lead: boolean;
    is_re_exams: boolean;
    is_has_tag: boolean;
    lead_message_seen: boolean;
    create_date: Date;
    update_date: Date;
    lead_conversion_date: Date;
    lead_convert_customer_date: Date;
    tags: TagCustomer[];
    status: string;
}

export interface FollowStaff {
    id: string;
    name: string;
}

export type PayloadGetBeforeExams = {
  processKeyId: string;
  launchSourceID: string;
  launchSourceGroup: any;
  launchSourceType: any;
  followStaffId: string;
  fromDay: Date;
  toDay: Date;
  keyWord: string;
  pages: number;
  limits: number;
};

export type ListBeforeExams = {
  data: {
    count: Count,
    data: ResponseBeforeExams[],
    paging: Paging,
  }
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
};
//
export interface BeforeExamsSaveCustomer {
    customer: CustomerSaveCustomer;
    master: MasterSaveCustomer;
    is_appointment: boolean;
    appointment: AppointmentSaveCustomer;
    tags: any;
    lead_note: string;
    process_key_id: string;
    current_affiliate_id: null;
    new_affiliate_id: null;
    customer_type: null;
}

export interface AppointmentSaveCustomer {
    master_id: string;
    appointment_type: string;
    package_id: null;
    doctor_employee_id: null;
    appointment_date: Date;
    appointment_note: string;
}

export interface CustomerSaveCustomer {
    customer_id: string;
    customer_fullname: string;
    customer_identity_card: string;
    customer_phone: string;
    customer_email: string;
    customer_address: string;
    day_of_birth: null;
    month_of_birth: number;
    year_of_birth: number;
    gender_id: string;
    career_id: string;
    nation_id: string;
    country_id: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    launch_source_id: number;
    conversation_type: string;
    conversation_page_id: string;
    conversation_user_id: string;
    conversation_sender_id: string;
}

export interface MasterSaveCustomer {
    master_id: string;
    c_object_id: string;
    launch_source_id: number;
    appointment_note: string;
    master_note: string;
    package_id: null;
    appointment_date: null;
    is_register_subclinical: boolean;
    is_register_package: boolean;
    is_exams: boolean;
    is_appointment: boolean;
}

export interface DataCustomer {
    data: DataCustomerInfo;
    message: string;
    status: boolean;
    total_items: number;
    client_ip: string;
}

export interface DataCustomerInfo {
    customer_type: string;
    customer: Customer;
    master: Master;
    appointment: Appointment;
    affiliate: Affiliate;
    lastest_result_master_id: null;
    list_same_phones: ListSamePhone[];
    tags: TagCustomer[];
    notes: Note[];
    is_has_booking: boolean;
}

export interface Affiliate {
    affiliate_id: number;
    affiliate_name: string;
    affiliate_code: string;
    phone: string;
    display_name: string;
    affiliate_type: string;
}
export interface ListSamePhone {
    customer_id: string;
    customer_fullname: string;
    customer_phone: string;
    customer_list_phones: null;
    gender_name: string;
    year_of_birth: number;
    is_phone_owner: null;
    is_actived: boolean;
    update_date: Date;
}

export interface Appointment {
    master_id: string;
    appointment_type: string;
    package_id: null;
    doctor_employee_id: null;
    appointment_date: Date;
    appointment_note: string;
    specialist_id: null;
    ids?: any;
}

export interface TagCustomer {
    tag_id: number;
    tag_name: string;
    tag_group: string;
    tag_group_name: string;
    tag_color: string;
    order_number: number;
}

export interface Customer {
    customer_id: string;
    process_key_id: null;
    customer_fullname: string;
    portrait_survey_type: string;
    customer_phone: string;
    customer_identity_card: string;
    customer_email: string;
    day_of_birth: null;
    month_of_birth: null;
    year_of_birth: number;
    birthday: string;
    customer_address: string;
    customer_full_address: string;
    country_id: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    nation_id: string;
  career_id: string;
    career: Career;
    launch_source_id: number;
    launch_source_group_id: number;
    launch_source: LaunchSource;
    launch_source_group: LaunchSource;
    launch_source_type: LaunchSource;
    gender_id: string;
    gender: Career;
    picture_avatar: null;
    lead_type: null;
    lead_last_message: null;
    lead_note: null;
    conversation_page_id: null;
    conversation_user_id: null;
    conversation_sender_id: null;
    conversation_type: null;
    follow_staff: null;
    lead_convert_customer_date: null;
    is_customer_converted: boolean;
    is_lead: boolean;
    create_date: Date;
    is_actived: boolean;
    is_portrait: boolean;
    is_affiliate_doctor: boolean;
    status: null;
}

export interface Career {
    id: string;
    name: string;
}

export interface LaunchSource {
    id: number;
    name: string;
}

export interface Master {
    [x: string]: any;
    master_id: string;
    customer_id: string;
    clinic_id: number;
    launch_source: LaunchSource;
    appointment_note: string;
    exams_reason: null;
    master_note: string;
    canceled_reason: null;
    diagnose_note: null;
    create_employee: null;
    update_employee: null;
    appointment_date: Date;
    register_date: null;
    create_date: Date;
    update_date: Date;
    is_register_package: boolean;
    is_register_subclinical: boolean;
    is_exams: boolean;
    is_appointment: boolean;
    is_re_exams: boolean;
    is_send_messages: null;
    status: string;
    register_type_id: string;
}

export interface Note {
    cs_node_id: string;
    lead_id: null;
    customer_id: string;
    cs_user_id: string;
    cs_user_displayname: string;
    cs_node_type: string;
    cs_node_content: string;
    ticket_id: null;
    file_attach_url: null;
    cs_node_datetime: Date;
    is_show: boolean;
}

export interface GetListNotes {
    data: NotesItem[];
    message: string;
    status: boolean;
    total_items: number;
    client_ip: string;
}

export interface NotesItem {
    cs_node_id: string;
    lead_id: null;
    customer_id: string;
    cs_user_id: string;
    cs_user_displayname: string;
    cs_node_type: string;
    cs_node_content: string;
    ticket_id: null;
    file_attach_url: null;
    cs_node_datetime: Date;
    is_show: boolean;
}
export interface Count {
    total_count:    number;
    contact_count:  number;
    lead_count:     number;
    customer_count: number;
    qt_count:       number;
    cn_count:       number;
    csdt_count:     number;
    dh_count:       number;
    hl_count:       number;
}