## About Project CRM

## Languages, Frameworks and Package used

- CRA
- TypeScript v4.6.4
- SCSS (sass)
- React v18
- Babel v8
- Hygen
- Storybook v6
- ESLint
- Stylelint
- Redux
- Redux-toolkit
- Antd v5.0.1
- Sip.js
- Websocket
- Jest

## How to specify a port to run Project

- Linux and MacOS: "start": "PORT=3006 react-scripts start" or "start": "export PORT=3006 react-scripts start"
- Windows: "start": "set PORT=3006 && react-scripts start"

## Structure Project

| Path                                | Purpose                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| /.storybook/                        | contains Storybook config files                                                    |
| /.hygen.js                          | settings for `Hygen`                                                               |
| /\_templates/                       | contains scaffolding templates based on `Hygen`                                    |
| /package.json                       | manifest file for Node.js projects                                                 |
| /public/                            | root folder that gets served up as our react app.                                  |
| /src/assets/                        | Chứa dữ liệu tĩnh, hình ảnh, audio,...                                             |
| /src/assets/icons                   | Chứa các icons dạng svg                                                            |
| /src/assets/data/index.ts           | Chứa data tĩnh của dự án                                                           |
| /src/assets/images                  | Chứa hình ảnh                                                                      |
| /src/assets/audio                   | Chứa file audio mp3                                                                |
| /src/components/                    | contains Atomic Design components                                                  |
| /src/components/atoms               | (LV1) <https://bradfrost.com/blog/post/atomic-web-design/#atoms>                   |
| /src/components/molecules           | (LV2) <https://bradfrost.com/blog/post/atomic-web-design/#molecules>               |
| /src/components/organisms           | (LV3) <https://bradfrost.com/blog/post/atomic-web-design/#organisms>               |
| /src/components/templates           | (LV4) <https://bradfrost.com/blog/post/atomic-web-design/#templates>               |
| /src/hooks                          | Folder chứa các custom hook cho dự án.                                             |
| /src/pages                          | Folder các page của CRM <https://bradfrost.com/blog/post/atomic-web-design/#pages> |
| /src/pages/Affiliate                | Hoa hồng cho CSKH                                                                  |
| /src/pages/AfterMedicalExamination  | Sau khám                                                                           |
| /src/pages/AppointmentView          | Danh sách hẹn khám                                                                 |
| /src/pages/Authentication           | Đăng nhập                                                                          |
| /src/pages/BeforeMedicalExamination | Chuyển đổi hoặc trước khám                                                         |
| /src/pages/BookingSchedule          | Lưới đặt lịch theo khung giờ                                                       |
| /src/pages/DetailCustomer           | Chi tiết khách hàng                                                                |
| /src/pages/HistoriesCall            | Lịch sử cuộc gọi                                                                   |
| /src/pages/LoginWithLink            | Đăng nhập SSO                                                                      |
| /src/pages/MissCall                 | Danh sách các misscall theo ngày                                                   |
| /src/pages/MonitoringMissedCall     | Monitor missCall                                                                   |
| /src/pages/MultiChannel             | Chat và tích hợp                                                                   |
| /src/pages/NotFoundCustomer         | Xử lí khi SĐT gọi đến chưa là KH                                                   |
| /src/pages/PointManagement          | Quản lí điểm KH                                                                    |
| /src/pages/Report                   | Báo cáo KH                                                                         |
| /src/pages/ReportChannel            | Báo cáo Kênh                                                                       |
| /src/pages/ReportGrowthClinic       | Báo cáo về phát triển của phòng khám                                               |
| /src/pages/Setting                  | Cài đặt                                                                            |
| /src/services                       | Setup API sử dụng Axios                                                            |
| /src/services/api                   | API của hệ thống                                                                   |
| /src/services/cloudfone             | API của cloudfone lấy các thông tin liên quan đến tổng đài                         |
| /src/services/pancake/channel       | API của pancake dùng cho tính năng chat                                            |
| /src/store                          | State management với Redux-toolkit                                                 |
| /src/styles                         | cấu hình SCSS: animation, mixins, breakpoint, font, function,...                   |
| /src/translations                   | cấu hình cho việc đa ngôn ngữ nếu cần, sử dụng i18n                                |
| /src/utils                          | Chứa các hàm tiện ích cho project                                                  |
| /src/index.tsx/                     | contains root file                                                                 |
| /src/App.tsx                        | contains application page index                                                    |
| /src/index.scss                     | contains shared styles                                                             |

## Command Line

| Path           | Purpose                         |
| -------------- | ------------------------------- |
| yarn start     | start the project               |
| yarn buid      | build the project               |
| yarn test      | run unit test                   |
| yarn storybook | start storybook                 |
| gen:component  | generate new `Atomic` component |
| gen:page       | generate new page               |

## Domain `.env`

- DEMO: `https://crm-api-demo.doctorcheck.online`
- MAIN: `https://crm-api.doctorcheck.online:7878`
- WSS: `wss://sockets.doctorcheck.online:3333`

## Generate Template

- Generate component: `yarn gen:component → select level → enter component name`
- Generate page: `yarn gen:page → enter page name`

## Config Menu CRM `src/utils/staticState.ts`

```ts
// Structure menu

export interface MenuCRM {
  groupId: string;
  groupName: string;
  items: Item[];
}

export interface Item {
  id: number;
  name: string;
  icon: string;
  slug: string;
  role: string[];
  child: Child[];
  isHaveChild: boolean;
}

export interface Child {
  idChild: number;
  title: string;
  slug: string;
  role: string[];
  type?: string;
}
```

### `Atomic`

<https://bradfrost.com/blog/post/atomic-web-design/>

### `Components`

- Use only `React-Hook`
- Follow the `rules of hook` (<https://reactjs.org/docs/hooks-rules.html>)

**Note: Use `mapModifiers` to generate `modifiers`.**

```tsx
export const Component: React.FC<Props> = (props) => (
  <div className={mapModifiers("a-sample", props.modifiers)}>
    {props.children}
  </div>
);
```

**Note: Use `// eslint-disable-next-line react-hooks/exhaustive-deps` when you want to avoid checking of the `useEffect` syntax (also on `useMemo & useCallback`)**

```tsx
  useEffect(() => {
    Todo Something...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

### `How to use Redux-toolkit`

- redux: <https://redux.js.org/>
- redux-toolkit: <https://redux-toolkit.js.org/>

```tsx
// In store
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DemoState {
  campaigns: CampaignItem[]; //
  customers: Customer[]; //
  loading: boolean; //
}

const initialState: DemoState = {
  campaigns: [],
  customers: [],
  loading: false,
};

// Fetching API with Axios
export const getAPISomeThing = createAsyncThunk<CampaignItem[], any, { rejectValue: any }>(
  "mapsReducer/getAPISomeThingAction",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getSomeThing(body);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const demoSlice = createSlice({
  name: "demoReducer",
  initialState,
  reducers: {
    updateCustomers($state, action: PayloadAction<Customer[]>) {
      $state.customers = action.payload;
    },
  },
  extraReducers(builder) {
     .addCase(getAPISomeThing.pending, ($state, action) => {
        $state.loading = true;
      })
      .addCase(getAPISomeThing.fulfilled, ($state, action) => {
        $state.demo = action.payload;
        $state.campaigns = false;
      });
  },
});

export const { updateCustomers } =
  demoSlice.actions;

export default demoSlice.reducer;

// In Page/Component
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "store/hooks"; // Use throughout your app instead of plain `useDispatch` and `useSelector`

const PreviewNewFeature: React.FC = () => {
  const dispatch = useAppDispatch();
  const campaingns = useAppSelector((state) => state.demo.campaigns);

  useEffect(()=>{
      const body ={
         ...params
      };

      dispatch(getAPISomeThing(body))
  },[])

  return (
    <div className="p-demo">

    </div>
  );
}

export default PreviewNewFeature;

```

### `Storybook`

**Note: Make sure that you have included all instances of the component in the storybook when building it.**

### `Unit Test`

- enzyme: <https://enzymejs.github.io/enzyme/docs/api/>
- jest: <https://jestjs.io/docs/en/25.x/getting-started.html>
- testing-library/react-hooks: <https://react-hooks-testing-library.com/usage/basic-hooks>

**Note: Make full test coverage for the component. If `NOT`, please notify your Leader.**

### `Typescript`

<https://www.typescriptlang.org/index.htm>

### `React-router-dom`

<https://reactrouter.com/web/guides/quick-start>

### `Naming`

1. Service: `[serviceName]` + Service

```ts
const getSystemDataService = async () => {
  // api handler
};
```

2. Response / Request Params type: `[TypeName / RequestParamsName]` + Types

```tsx
type SystemDataTypes = {
  // ...
};
```

```tsx
interface SystemParamsTypes = {
  // ...
};
```

3. Store:

- Reducer: `[Name]` + Reducer
- Action: `[ActionName]` + Action
- Action Prefix: `[ReducerName]/[ActionName]`
- Slice: `[Name]` + Slice

```ts
export const getSystemDataAction = createAsyncThunk<SystemDataTypes>(
  "systemReducer/getSystemDataAction",
  async (_, { rejectWithValue }) => {
    // ...
  }
);

export const systemSlice = createSlice({
  // ...
});
```

4. Colors: <https://hexcol.com/> Enter code => Get Color name

## How to Call API

- Call From Redux

```ts
export const getAPISomeThing = createAsyncThunk<
  CampaignItem[],
  any,
  { rejectValue: any }
>("mapsReducer/getAPISomeThingAction", async (body, { rejectWithValue }) => {
  try {
    const response = await getSomeThing(body);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
```

- Call in Page/ Component using react-query

```ts
import { useMutation } from 'react-query';

const { mutate: getAPISomeThing } = useMutation(
  "post-footer-form",
  (body: any) => getSomeThing(body),
  {
    onSuccess: async (data) => {
      // Success
       Todo Something...
    },
    onError: (error) => {
    },
  }
);
```

## Reactjs

# useState

- Dùng để lưu giá trị cho 1 đối tượng

```ts
const [state, setState] = useState<Type | Interface>(initialState);
```

# useLayoutEffect, useEffect

```ts
useEffect(setup, dependencies?);
useLayoutEffect(setup, dependencies?)


- setup: là 1 callback function;
- dependencies: là các giá trị phản ứng bao gồm props, state và tất cả các biến và hàm được khai báo trực tiếp bên trong phần thân thành phần của bạn

Các trường hợp của useLayoutEffect, useEffect
1. TH1: không dùng dependencies:
      useLayoutEffect(()=>{});
      useEffect(()=>{});
==> callback sẽ được gọi lại khi trang được re-render

2. TH2: dependencies = [];
      useLayoutEffect(()=>{},[]);
      useEffect(()=>{},[]);

==> useLayoutEffect: callback sẽ được gọi 1 lần duy nhất trước khi re-render
==> useEffect: callback sẽ được gọi 1 lần duy nhất sau khi re-render
3. TH3: sử dụng  dependencies

      useLayoutEffect(()=>{},[date, origin, customers]);
      useEffect(()=>{},[date, origin, customers]);

==> callback sẽ được gọi lại khi `[date, origin, customers,...]` 1 trong các `dependencie` thay đổi giá trị.

```

# useMemo

- dùng để caching các component, page

```ts
const memory = useMemo(()=>{
      // code ....

      return(
            //Component, page,...
      )
},[dependencies])

==> hàm chỉ được re-render khi các `dependencies` thay đổi giá trị

```

# React.memo

- dùng để caching các component, page nhưng khác ở chỗ là nó chỉ re-render khi props truyền vào thay đổi giá trị

```ts
import React from "react";

interface TableReportGrowthProps {
  props1: string;
  props2: number;
  props3: string;
}

const TableReportGrowth: React.FC<TableReportGrowthProps> = ({
  props1,
  props2,
  props3,
}) => {
  return <div className="m-table_report_growth"></div>;
};

const MemoizedComponent = React.memo(TableReportGrowth);
export default MemoizedComponent;
```

# useRef

- UseRef Hook là có thể hiểu đơn giả thì nó giống như việc dùng DOM trong javascript

```ts
const divRef = useRef<divHtmlElement>(null);

return <div ref={divRef} />;

==> Ta có thể tương tác với element thông qua `divRef.current` để thay đổi các thuộc tính.

```

# useContext

- Nếu đã sử dụng `redux, recoil, zustand,...` các state management thì nguyên lí hoạt động của `useContext` cũng tương tụ
  -> Nếu bạn cần truyền giá trị từ `component cha` -> `compoent con` thì có thể dùng `props`. Nhưng nếu:

Bạn muốn truyền giá trị từ `componentLV1` -> `ComponentLv3` thì cần phải `componentLV1` -> `ComponentLv2` -> `ComponentLv3`

==> `useContext` ra đời để giải quyết vấn đề này.

`có thể tham khảo ở: src/components/templates/sipProvider/index.tsx`

```ts
<ComponentLv1> ------------------
      |                          |
      |-----><ComponentLv2>      |
                  |              v
                  |------><ComponentLv3 ></ComponentLv3>

            <ComponentLv2>
<ComponentLv1>
```
