/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DropdownData } from "components/atoms/Dropdown";
import { GroupRadioType } from "components/atoms/GroupRadio";
import { TransferType } from "components/atoms/Transfer";
import Cookies from "js-cookie";
import { ServiceItem } from "services/api/Example/types";
import { getResourceCRM } from "services/api/dashboard";
import { DmsData, ServiceGroup } from "services/api/dashboard/types";
import { InfoUserType, Role, UserCallAgent } from "services/types";

interface HomeState {
  tokenUser: string;
  shortName: string;
  callAgent: UserCallAgent;
  roleUser: Role[];
  info: InfoUserType;
  resource: DmsData;
  dataLaunchSource: DropdownData[];
}

const initialState: HomeState = {
  tokenUser: "",
  shortName: "",
  callAgent: {
    user_id: "",
    display_phone_agent: "",
    phone_agent: "",
    phone_agent_password: "",
    phone_queue: "",
    phone_browser_default: "",
    phone_server_domain: "",
    phone_server_port: 0,
    phone_server_type: "",
    phone_cs_url: "",
    sip_realm: "",
    sip_ws_url: "",
  },
  roleUser: [],
  info: {
    username: "",
    fullname: "",
    lastname: "",
    employee_signature_name: "",
    token: "",
    clinic_id: 1,
    department_id: "",
    employee_id: "",
    employee_group: "",
    employee_team_id: "",
    user_country_id: "",
    user_country_phone_prefix: "",
    user_call_agent: "",
    roles: [],
  },
  resource: {
    data: {
      clinics: [],
      phone_config: {
        user_id: "",
        display_phone_agent: "",
        phone_agent: "",
        phone_agent_password: "",
        phone_queue: "",
        phone_browser_default: "",
        phone_server_domain: "",
        phone_server_port: 0,
        phone_server_type: "",
        phone_cs_url: "",
      },
      genders: [],
      careers: [],
      nations: [],
      maritalstatus: [],
      relationtypes: [],
      countries: [],
      launch_source_groups: [],
      launch_sources: [],
      launch_source_types: [],
      task_types: [],
      stages: [],
      departments: [],
      employee_teams: [],
      appointment_types: [],
      appointment_services: [],
      packages: [],
      employees: [],

      services: [],
      affiliates: [],
      insurance_injuries: [],
      insurance_specialists: [],
      tags: [],
    },
    message: "",
    status: false,
    client_ip: "",
  },
  dataLaunchSource: [],
};

export const getListResourceCRM = createAsyncThunk<
  DmsData,
  void,
  { rejectValue: any }
>("mapsReducer/getProjectsHomeAction", async (_, { rejectWithValue }) => {
  try {
    const response = await getResourceCRM();
    // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập, từ đây sẽ gán dữ liệu ở file sau và
    // sẽ gán vào localstorage
    return response;
  } catch (error) {
    console.log("🚀 ~ file: home.ts:111 ~ > ~ error:", error);
    return rejectWithValue(error);
  }
});

export const homeSlice = createSlice({
  name: "homeReducer",
  initialState,
  reducers: {
    setTokenUser($state, action: PayloadAction<string>) {
      $state.tokenUser = action.payload;
    },
    setShortName($state, action: PayloadAction<string>) {
      $state.shortName = action.payload;
    },
    setInfoUserAgent($state, action: PayloadAction<UserCallAgent>) {
      $state.callAgent = action.payload;
    },
    setRoleUser($state, action: PayloadAction<Role[]>) {
      $state.roleUser = action.payload;
    },
    setInforUser($state, action: PayloadAction<InfoUserType>) {
      $state.info = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getListResourceCRM.fulfilled, ($state, action) => {
      const {
        launch_sources,
        launch_source_groups,
        launch_source_types,
        nations,
        affiliates,
        genders,
        careers,
        packages,
        tags,
        employees,
        task_types,
        employee_teams,
        stages,
        phone_config,
        services,
        appointment_types,
        appointment_services,
        ...prevData
      } = action.payload.data;

      const newAppointmentTypes: GroupRadioType[] = [];
      const newLaunchSources: DropdownData[] = [];
      const newLaunchSourcesGroups: DropdownData[] = [];
      const newLaunchSourcesTypes: DropdownData[] = [];
      const newNations: DropdownData[] = [];
      const newAffiliates: DropdownData[] = [];
      const newGenders: DropdownData[] = [];
      const newCareers: DropdownData[] = [];
      const newPackages: DropdownData[] = [];
      const newDoctorOnline: DropdownData[] = [];
      const newGroupTask: DropdownData[] = [];
      const newEmployeeTeams: DropdownData[] = [];
      const newTags: TransferType[] = [];
      const newTagsMultiSelect: DropdownData[] = [];
      const ListTagPhareTranfer: TransferType[] = [];
      const listPharesBeforeExams: DropdownData[] = [];
      const listServiceConverted: ServiceGroup[] = [];
      const listEndoscopics: DropdownData[] = [];
      const listCSKH: GroupRadioType[] = [];
      const colors = ["#28a745", "#17a2b8", "#dc3545", "#20c997", "#333"];
      const listServicesAllowGroup: any[] = [];
      services.length &&
        ((services as unknown as ServiceItem[]) || []).map(
          (item: ServiceItem) => {
            const checkGroupIsExit = listServicesAllowGroup.find(
              (i) => i.service_group_id === item.service_group_id
            );

            const newGroup = {
              service_group_id: item.service_group_id,
              service_group_name: item.service_group_name,
              service_group_item: [
                {
                  ...item,
                  id: item.service_id,
                  label: item.service_name,
                  value: item.service_id,
                },
              ],
            };

            if (checkGroupIsExit) {
              checkGroupIsExit.service_group_item.push({
                ...item,
                id: item.service_id,
                label: item.service_name,
                value: item.service_id,
              } as any);
            } else {
              listServicesAllowGroup.push(newGroup as any);
            }
          }
          
        );
      // hai đoạn code dưới để xử lý data có giá tiền cho đúng vd như dữ liệu của endoscopicts
      appointment_services.length &&
        appointment_services.map((item, index) => {
          const newItem = {
            id: item.service_id,
            label: `${
              item.service_displayname
            }  (${item.service_prices.toLocaleString("vi-VN")} vnd)`,
            value: item.policy_key,
            policy_key: item.policy_key,
            is_used: item.is_used,
          };
          if (item.appointment_type === "endoscopics" && item.is_used) {
            listEndoscopics.push(newItem as unknown as DropdownData);
          }
        });

      appointment_services.length &&
        appointment_services.map((item, index) => {
          const convertStages = {
            id: item.service_id,
            label: `${
              item.service_displayname
            }  (${item.service_prices.toLocaleString("vi-VN")} vnd)`,
            value: item.service_id,
            policy_key: item.policy_key,
          };
          if (item.appointment_type === "package" && item.is_used) {
            newPackages.push(convertStages as unknown as DropdownData);
          }
        });

      appointment_types.length &&
        appointment_types.map((item, index) => {
          const newItem = {
            id: item.service_id,
            label: item.service_name,
            value: item.appointment_type,
            color: colors[index],
            department_id: item.department_id,
            is_register_package: item.is_register_package,
            is_register_subclinical: item.is_register_subclinical,
            is_exams: item.is_exams,
            register_type_id: item.register_type_id,
            index: item.index

          };
          newAppointmentTypes.push(newItem as unknown as GroupRadioType);
        });
        
      !!launch_source_groups.length &&
        launch_source_groups.map((item) => {
          const convertStages = {
            id: item.launch_source_group_id,
            label: item.launch_source_group_displayname,
            value: item.launch_source_group_id,
          };
          // if (item.launch_source_group_name === "khamdoanhnghiep.vn") {
          //   return;
          // }
          newLaunchSourcesGroups.push(convertStages as unknown as DropdownData);
        });

      !!launch_sources.length &&
        launch_sources.map((item) => {
          const convertStages = {
            id: item.launch_source_id,
            label: item.launch_source_name,
            value: item.launch_source_id,
          };
          newLaunchSources.push(convertStages as unknown as DropdownData);
        });

      !!launch_source_types.length &&
        launch_source_types.map((item) => {
          const convertStages = {
            id: item.launch_source_type_id,
            label: item.launch_source_type_name,
            value: item.launch_source_type_id,
          };
          newLaunchSourcesTypes.push(convertStages as unknown as DropdownData);
        });

      !!stages.length &&
        stages.map((item) => {
          const convertStages = {
            id: item.stage_id,
            label: item.stage_name,
            value: item.stage_id,
          };
          if (item?.type === "before") {
            listPharesBeforeExams.push(
              convertStages as unknown as DropdownData
            );
          }
        });

      !!nations.length &&
        nations.map((item) => {
          const convertStages = {
            id: item.nation_id,
            label: item.nation_name,
            value: item.nation_id,
          };
          newNations.push(convertStages as unknown as DropdownData);
        });

      !!affiliates.length &&
        affiliates.map((item) => {
          const convertStages = {
            id: item.affiliate_id,
            label: item.display_name,
            value: item.affiliate_id,
            affiliate_code: item.affiliate_code,
            affiliate_type: item.affiliate_type,
            launch_source_id: item.launch_source_id,
          };
          newAffiliates.push(convertStages as unknown as DropdownData);
        });

      !!genders.length &&
        genders.map((item, index) => {
          const convertStages = {
            id: index + 1,
            label: item.gender_name,
            value: item.gender_id,
          };
          newGenders.push(convertStages as unknown as DropdownData);
        });
      !!careers.length &&
        careers.map((item, index) => {
          const convertStages = {
            id: index + 1,
            label: item.career_name,
            value: item.career_id,
          };
          newCareers.push(convertStages as unknown as DropdownData);
        });

      !!employees.length &&
        employees.map((item: any, index: number) => {
          const convertStages = {
            id: index + 1,
            label: item.employee_signature_name,
            value: item.employee_id,
          };
          if (item.employee_team_id === "BSKNTH") {
            newDoctorOnline.push(convertStages as unknown as DropdownData);
          }
        });

      !!employees.length &&
        employees.map((item: any, index) => {
          const convertStages = {
            id: item?.employee_id,
            label: item?.employee_signature_name,
            value: item.employee_id,
            employee_type: item.employee_type,
            color: colors[1],
            employee_team_id: item?.employee_team_id,
            erp_code: item?.erp_code,
            erp_type: item?.erp_type,
          };

          if (item.employee_team_id === "CSKH") {
            listCSKH.push(convertStages as unknown as GroupRadioType);
          }
        });

      !!tags.length &&
        tags.map((item: any, index: any) => {
          const existingGroup = newTags.find(
            (group) => group.groupId === item.tag_group
          );
          const existingGroupPhare = ListTagPhareTranfer.find(
            (group) => group.groupId === item.tag_group
          );
          const convertedTag = {
            tag_id: item.tag_id,
            tag_name: item.tag_name,
            tag_group: item.tag_group,
            tag_group_name: item.tag_group_name,
            tag_color: item.tag_color,
            order_number: item.order_number,
          };
          if (existingGroup) {
            existingGroup.child.push(convertedTag as any);
          } else {
            const newGroup: TransferType = {
              groupId: item.tag_group,
              tagGroupName: item.tag_group_name,
              child: [convertedTag as any],
            };
            if (item.tag_group !== "htkh") {
              newTags.push(newGroup);
            }
          }
          if (existingGroupPhare) {
            existingGroupPhare.child.push(convertedTag as any);
          } else {
            const newGroup: TransferType = {
              groupId: item.tag_group,
              tagGroupName: item.tag_group_name,
              child: [convertedTag as any],
            };
            if (item.tag_group === "htkh") {
              ListTagPhareTranfer.push(newGroup);
            }
          }
        });

      !!services.length &&
        services.map((serviceItem: any, index: any) => {
          const existingGroup = listServiceConverted.find(
            (group) => group.service_group_id === serviceItem.service_group_id
          );

          if (existingGroup) {
            existingGroup?.children?.push(serviceItem as any);
          } else {
            const newGroupService = {
              service_group_id: serviceItem.service_group_id,
              service_group_name: serviceItem.service_group_name,
              service_group_type: serviceItem.service_group_type,
              children: [serviceItem],
            };
            listServiceConverted.push(newGroupService);
          }
        });

      !!tags.length &&
        tags.map((item: any, index: any) => {
          const newTagMultiSelect: DropdownData = {
            id: item?.tag_id,
            label: item?.tag_name,
            value: item?.tag_id,
          };

          if (item?.tag_group !== "htkh") {
            newTagsMultiSelect.push(newTagMultiSelect as DropdownData);
          }
        });

      !!task_types.length &&
        task_types.map((item, index) => {
          const convertStages = {
            id: index + 1,
            label: item.task_type_name,
            value: item.task_type_id,
          };
          newGroupTask.push(convertStages as unknown as DropdownData);
        });

      !!employee_teams.length &&
        employee_teams.map((item, index) => {
          const convertStages = {
            id: index + 1,
            label: item.employee_team_name,
            value: item.employee_team_id,
          };
          newEmployeeTeams.push(convertStages as unknown as DropdownData);
        });

      localStorage.setItem(
        "listPharesBeforeExams",
        JSON.stringify(listPharesBeforeExams)
      );
      localStorage.setItem("doctorOnline", JSON.stringify(newDoctorOnline));
      localStorage.setItem("endoscopics", JSON.stringify(listEndoscopics));
      localStorage.setItem(
        "appointment_types",
        JSON.stringify(newAppointmentTypes)
      );
      localStorage.setItem(
        "listServicesAllowGroup",
        JSON.stringify(listServicesAllowGroup)
      );
      localStorage.setItem("launchSources", JSON.stringify(newLaunchSources));
      localStorage.setItem(
        "launchSourcesGroups",
        JSON.stringify(newLaunchSourcesGroups)
      );
      localStorage.setItem(
        "launchSourcesTypes",
        JSON.stringify(newLaunchSourcesTypes)
      );
      localStorage.setItem("genders", JSON.stringify(newGenders));
      localStorage.setItem("packages", JSON.stringify(newPackages));
      localStorage.setItem("user_call_agent", JSON.stringify(phone_config));
      localStorage.setItem("services", JSON.stringify(listServiceConverted));
      localStorage.setItem("servicesDefault", JSON.stringify(services));
      localStorage.setItem("dms", "1");

      setTimeout(() => {
        localStorage.setItem("affiliates", JSON.stringify(newAffiliates));
        localStorage.setItem("nations", JSON.stringify(newNations));
        localStorage.setItem("careers", JSON.stringify(newCareers));
        localStorage.setItem("tagsCustomer", JSON.stringify(newTags));
        localStorage.setItem("employeeTeams", JSON.stringify(newEmployeeTeams));
        localStorage.setItem("employeeList", JSON.stringify(employees));
        localStorage.setItem("groupTask", JSON.stringify(newGroupTask));
        localStorage.setItem(
          "ListTagPhareTranfer",
          JSON.stringify(ListTagPhareTranfer)
        );
        localStorage.setItem(
          "tags_dropdown",
          JSON.stringify(newTagsMultiSelect)
        );
        localStorage.setItem("listCSKH", JSON.stringify(listCSKH));
      }, 2000);

      $state.dataLaunchSource = newLaunchSources;
    });
  },
});
export const {
  setInfoUserAgent,
  setRoleUser,
  setInforUser,
  setTokenUser,
  setShortName,
} = homeSlice.actions;

export default homeSlice.reducer;
