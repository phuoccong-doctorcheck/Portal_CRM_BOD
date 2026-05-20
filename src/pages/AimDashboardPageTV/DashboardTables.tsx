/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { postLoadLeadReportDayAPI } from "services/api/leadReportAPI"
import { ApiResponse, TableBlock } from "services/api/leadReportAPI/types"

import { getDaysInMonth } from "."


const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= breakpoint)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [breakpoint])

  return isMobile
}
type WeekAPIResponse = {
  data: {
    TableIndex: number
    Columns: { SequenceColumn: number; ColumnName: string; ColumnDate: string }[]
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
          ReportDate: string
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
  message: string
  status: boolean
  client_ip: string
}

/* ===================== Demo initial data ===================== */
/** TODO: thay JSON ban đầu (format mới) của bạn vào biến dưới */

type CellForFormat = {
  ReportValue?: number | null
  ReportColumn?: string | null
  ReportRow?: string | null
  ReportColumnParent?: string | null
}

const isPercentCell = (cell?: CellForFormat) => {
  if (!cell) return false

  const col = cell.ReportColumn ?? ""
  const row = cell.ReportRow ?? ""
  const parent = cell.ReportColumnParent ?? ""

  return col.includes("%") || row.includes("%") || parent.includes("%")
}

const formatValue = (cell?: CellForFormat) => {
  if (!cell) return "-"

  const v = Number(cell.ReportValue ?? 0)
  if (isNaN(v)) return "-"

  if (isPercentCell(cell)) {
    return fmtPercent(v)
  }

  return fmtNumber(v)
}


/* ===================== Helpers ===================== */
const fmtCurrency = (v: number) => {
  if (isNaN(v)) return "-"
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + "M"
  if (Math.abs(v) >= 1_000) return (v / 1_000).toFixed(2) + "K"
  return v.toFixed(0)
}
const fmtPercent = (v: number) => {
  if (isNaN(v)) return "-"

  // v là 0.8 -> 80, 0.8012 -> 80.12
  const percentage = v * 100

  // Làm tròn 1 chữ số thập phân
  const roundedOneDecimal = Math.round(percentage * 10) / 10

  // Nếu là số nguyên (80.0) -> "80%"
  if (Number.isInteger(roundedOneDecimal)) {
    return `${roundedOneDecimal}%`
  }

  // Nếu có phần thập phân -> "80,1%" (dùng comma theo kiểu vi-VN)
  return roundedOneDecimal
    .toLocaleString("vi-VN", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "%"
}
const fmtNumber = (v: number) => {
  if (isNaN(v)) return "-"

  // Làm tròn tới số nguyên gần nhất
  const rounded = Math.round(v)

  // Format kiểu vi-VN: 4.000.001
  return rounded.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}


const useTable = (data: ApiResponse | undefined, index: number) =>
  useMemo(() => data?.data?.Tables?.find((t) => t.TableIndex === index), [data, index])
interface Props {
  dataRaw: ApiResponse,
    dataRaw2: ApiResponse,
  handleSeenDay: any,
  dataFilter: any,
}
  const today = new Date();
 const todayStr = today.toLocaleDateString("vi-VN"); // 14/11/2025
/* ===================== Page ===================== */
export default function DashboardPage({ dataRaw,dataRaw2, handleSeenDay, dataFilter ,}: Props) {
    const isMobile = useIsMobile() 
  const table1 = useTable(dataRaw, 1)
  const table2 = useTable(dataRaw2, 1)
  const table3 = useTable(dataRaw, 3)
  const table4 = useTable(dataRaw, 4)
  const table5 = useTable(dataRaw, 5)
  const table6 = useTable(dataRaw, 6)
  const table7 = useTable(dataRaw, 7)
   const { mutate: postLoadLeadReportDay } = useMutation(
    'post-footer-form',
     (data: any) => postLoadLeadReportDayAPI({
       Month: dataFilter.month?.value,
       Year: dataFilter.year || 2025,
       TableIndex: 1,
       WeekIndex: data,
        PageId:dataFilter.brand?.value,
    }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          console.log('🚀');
       
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  // Hàm fetch tuần (bấm vào “Tuần N” sẽ gọi)
  const handleFetchWeek = async (weekName: string, sequenceColumn: number): Promise<WeekAPIResponse> => {
    // TODO: đổi sang endpoint thực tế của bạn
    // ví dụ: /api/dashboard/week?week=Tu%E1%BA%A7n%202&seq=6
    const url = `/api/dashboard/week?week=${encodeURIComponent(weekName)}&seq=${sequenceColumn}`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error("Fetch week failed")
    return (await res.json()) as WeekAPIResponse
  }

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{ fontSize: 20, fontWeight: 600 }}>Facebook - Tầm Soát Bệnh</span>
         <div style={statsContainerStyle}>
        <div style={statItemStyle}>
          {/* <span style={statLabelStyle}>
            Hiệu quả đặt hẹn kênh Facebook Ads
          </span> */}
        </div>
        <div style={statItemStyle}>
                  <span style={statLabelStyle}>Tháng: <strong>{dataFilter?.month?.value}/{dataFilter?.year}</strong></span>
        </div>
        <div style={statItemStyle}>
                  <span style={statLabelStyle2}>Số ngày trong tháng: <strong>{getDaysInMonth(Number(dataFilter?.month?.value), Number(dataFilter?.year))
 }</strong></span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle2}>Ngày xem báo cáo: <strong>  {todayStr}</strong></span>
        </div>
      </div>
      </div>
      
      {table1 && <WeeklyTableV2 table={table1}
        postLoadLeadReportDay={postLoadLeadReportDay} />}
        <span style={{fontSize:20, fontWeight:600}}>Facebook - Trung Tâm Nội Soi</span>
      {table2 && <WeeklyTableV2 table={table2}
    postLoadLeadReportDay={postLoadLeadReportDay} />}
        {/* <div style={{
        display: "grid",
       gridTemplateColumns:  "0.8fr" ,
        gap: 6, maxWidth: "100%",
      }}
      >
        <div style={{
        display: "grid",
       gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 6, maxWidth: "90%",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          
        }}>
          {table2 && <BarrierTableV2 table={table2} title="Inbox ấm → Đặt hẹn" />}
          {table4 && <BarrierTableV2 table={table4} title="Đặt hẹn → đến khám" />}
            {table6 && <BarrierTableV2 table={table6} title="Đến khám → Thực hiện dịch vụ" />}
             {table7 && <BarrierTableV3 table={table7} title="Đang tương tác quá 14 ngày" />}
        </div>
       <div style={{
          display: "flex",
          flexDirection: "column",
          gap:6
        }}>
          {table3 && <BarrierTableV2 table={table3} title="Rào cản đặt hẹn thất bại" />}
            {table5 && <BarrierTableV2 table={table5} title="Rào cản đặt hẹn mà không đến" />}
            
        </div>
      </div>
      
      </div> */}
    </div>
  )
}

/* ===================== Table 1: Weekly (expand -> fetch days) ===================== */
/* ===================== Table 1: Weekly (expand -> fetch days) ===================== */
function WeeklyTableV2({
  postLoadLeadReportDay,
  table,
}: {
  postLoadLeadReportDay: (
    weekNumber: number,
    options?: {
      onSuccess?: (data: WeekAPIResponse) => void
      onError?: (error: unknown) => void
    }
  ) => void
  table: TableBlock
}) {
  const isMobile = useIsMobile()

  // ==== wrapper: mutate -> Promise (để await trong toggleWeek) ====
  const fetchWeekViaMutate = (weekNumber: number) =>
    new Promise<WeekAPIResponse>((resolve, reject) => {
      postLoadLeadReportDay(weekNumber, {
        onSuccess: (data) => resolve(data as unknown as WeekAPIResponse),
        onError: (err) => reject(err),
      })
    })

  /* ===================== Chuẩn bị data ===================== */
const summaryColSeqs = useMemo(() => {
  const firstRow = table.Rows[0]
  if (!firstRow) return []

  const cells = Object.values(firstRow.Cells)

  return cells
    .filter(
      (c) =>
        !c.IsDayColumn &&                      // chỉ lấy cột summary
        c.ReportColumnParent !== "Mục tiêu/ngày" &&  // loại theo columnParent
        c.ReportColumn !== "Mục tiêu/ngày"           // phòng khi tên cột là "Mục tiêu/ngày"
    )
    .sort((a, b) => a.SequenceColumn - b.SequenceColumn)
    .map((c) => c.SequenceColumn)
}, [table])


  const summaryColNames = useMemo(() => {
    const firstRow = table.Rows[0]
    const bySeq = new Map<number, string>()
    Object.values(firstRow.Cells).forEach((c) => {
      if (!c.IsDayColumn) bySeq.set(c.SequenceColumn, c.ReportColumn)
    })
    return summaryColSeqs.map((seq) => bySeq.get(seq) || "")
  }, [table, summaryColSeqs])

  type WeekInfo = { weekName: string; seq: number }

  const baseWeeks: WeekInfo[] = useMemo(() => {
    const set = new Map<string, number>()
    table.Rows.forEach((r) =>
      Object.values(r.Cells).forEach((c) => {
        if (c.IsDayColumn) {
          const name = c.ReportColumnParent || c.ReportColumn
          if (!set.has(name)) set.set(name, c.SequenceColumn)
        }
      }),
    )
    return Array.from(set.entries())
      .map(([weekName, seq]) => ({ weekName, seq }))
      .sort(
        (a, b) =>
          parseInt(a.weekName.replace(/\D+/g, "") || "0") -
          parseInt(b.weekName.replace(/\D+/g, "") || "0"),
      )
  }, [table])

  const getWeekNumber = (weekName: string) => {
    const match = weekName.match(/\d+/)
    return match ? Number(match[0]) : NaN
  }

  // 🔴 CHỈ CHO PHÉP 1 TUẦN ĐANG MỞ
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null)
  
  type LoadedWeek = {
    seq: number
    days: { dateIso: string; label: string }[]
    valuesByRow: Record<
      string,
      Record<string, { value: number; color?: string; link?: string; formatted?: string }>
    >
  }

  const [loadedWeeks, setLoadedWeeks] = useState<Record<string, LoadedWeek>>({})
  
    useEffect(() => {
    setExpandedWeek(null)
    setLoadedWeeks({})
  }, [table])
 const baseWeekDays = useMemo(() => {
  // weekName -> list of days
  const map = new Map<string, { dateIso: string; label: string }[]>()

  // Khởi tạo map với tất cả tuần đã detect
  baseWeeks.forEach((w) => map.set(w.weekName, []))

  // helper format label từ date
  const labelFromDate = (iso: string) => {
    const d = new Date(iso)
    const dd = `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`
    return dd
  }

  // Duyệt qua Columns để lấy ngày theo tuần
  table.Columns.forEach((col) => {
    if (!col.ColumnDate) return

    const weekName = col.ColumnName         // "Tuần 1", "Tuần 2", ...
    const bucket = map.get(weekName)
    if (!bucket) return

    const iso = col.ColumnDate             // "2025-11-01T00:00:00+07:00" ...
    if (!bucket.some((x) => x.dateIso === iso)) {
      const lbl = labelFromDate(iso)       // label = "01", "02" ...
      bucket.push({ dateIso: iso, label: lbl })
    }
  })

  // Sort ngày trong mỗi tuần
  Array.from(map.values()).forEach((days) =>
    days.sort(
      (a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime()
    )
  )

  return map
}, [table, baseWeeks])
  // ... dưới baseWeekDays

useEffect(() => {
  // nếu đã có tuần đang mở rồi thì không đụng nữa
  if (expandedWeek) return

  if (!baseWeeks.length) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let defaultWeekName: string | null = null

  for (const w of baseWeeks) {
    const days = baseWeekDays.get(w.weekName) ?? []

    if (!defaultWeekName && days.length) {
      // fallback: tuần đầu tiên có ngày
      defaultWeekName = w.weekName
    }

    const hasToday = days.some((d) => {
      const dDate = new Date(d.dateIso)
      dDate.setHours(0, 0, 0, 0)
      return dDate.getTime() === today.getTime()
    })

    if (hasToday) {
      // ưu tiên tuần chứa ngày hiện tại
      defaultWeekName = w.weekName
      break
    }
  }

  if (defaultWeekName) {
    setExpandedWeek(defaultWeekName)
  }
}, [baseWeeks, baseWeekDays, expandedWeek])



  const weekDays = (weekName: string) =>
    loadedWeeks[weekName]?.days ?? baseWeekDays.get(weekName) ?? []

  const getCellBySeq = (row: TableBlock["Rows"][number], seq: number) =>
  {

    return Object.values(row.Cells).find((c) => c.SequenceColumn === seq)
  }

  const dayValueForRowFormatted = (
    row: TableBlock["Rows"][number],
    iso: string,
    seq: number,
  ) => {
    const cell = Object.values(row.Cells).find(
      (c) => c.IsDayColumn && c.SequenceColumn === seq && c.ReportDate === iso,
    )
    return cell ? fmtNumber(cell.ReportValue) : undefined
  }

  const weekTotalForRow = (
    row: TableBlock["Rows"][number],
    weekName: string,
    seq: number,
  ) => {
    const days = weekDays(weekName)
    const vals = days
      .map((d) => dayValueForRowFormatted(row, d.dateIso, seq))
      .filter(Boolean) as string[]
    if (!vals.length) return "-"
    return vals.length === 1 ? vals[0] : vals[0]
  }

  const toLabel = (iso: string) => {
    const d = new Date(iso)
    const dd = `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}`
    return dd
  }

  const toggleWeek = async (w: WeekInfo) => {
    const isOpen = expandedWeek === w.weekName // tuần này đang mở?

    // lần đầu mở & chưa có cache thì call API
   if (!isOpen && !loadedWeeks[w.weekName]) {
    try {
      const weekNumber = getWeekNumber(w.weekName)
      const res = await fetchWeekViaMutate(weekNumber)

      // ====== LẤY DANH SÁCH NGÀY TỪ API (Columns) ======
      const uniqDays = Array.from(
        new Map(
          res.data.Columns
            .filter((c) => !!c.ColumnDate)
            .map((c) => [c.ColumnDate, c]),
        ).values(),
      )
        .sort(
          (a, b) =>
            new Date(a.ColumnDate!).getTime() - new Date(b.ColumnDate!).getTime(),
        )
        .map((c) => ({
          dateIso: c.ColumnDate!,
          label: toLabel(c.ColumnDate!), // "01-11", "02-11", ...
        }))

      // ====== MAP VALUE THEO ROW + DATE ======
      const valuesByRow: LoadedWeek["valuesByRow"] = {}

      res.data.Rows.forEach((row) => {
        Object.values(row.Cells).forEach((cell) => {
          // (tuỳ, có thể filter thêm theo SequenceColumn của tuần nếu cần)
          // if (cell.SequenceColumn !== w.seq) return

          if (!cell.ReportDate) return

          if (!valuesByRow[row.ReportRow]) {
            valuesByRow[row.ReportRow] = {}
          }

          valuesByRow[row.ReportRow][cell.ReportDate] = {
            value: cell.ReportValue,
            formatted:  fmtNumber(cell.ReportValue) || undefined,
            color: cell.FontColor || undefined,
            link: cell.LinkUrl || undefined,
          }
        })
      })

      // ✅ BẮT BUỘC TRUYỀN ĐỦ: seq + days + valuesByRow
      setLoadedWeeks((prev) => ({
        ...prev,
        [w.weekName]: {
          seq: w.seq,
          days: uniqDays,
          valuesByRow,
        },
      }))
    } catch (e) {
      console.error(e)
      toast.error("Tải dữ liệu ngày thất bại")
    }
  }

    // 🔴 CHỈ GIỮ 1 TUẦN: nếu đang mở thì đóng, còn không thì set tuần này
    setExpandedWeek((prev) => (prev === w.weekName ? null : w.weekName))
  }

  const dayValueForRow = (
    row: TableBlock["Rows"][number],
    weekName: string,
    iso: string,
    seq: number,
  ) => {
    const cached = loadedWeeks[weekName]?.valuesByRow[row.ReportRow]?.[iso]
    if (cached) return cached

    const c = Object.values(row.Cells).find(
      (x) => x.IsDayColumn && x.SequenceColumn === seq && (x.ReportDate || "") === iso,
    )
    return c
      ? {
          value: c.ReportValue,
          formatted:  fmtNumber(c.ReportValue) || undefined,
          color: c.FontColor || undefined,
          link: c.LinkUrl || undefined,
        }
      : undefined
  }

  /* ===================== STYLE – phần dưới giữ nguyên như bạn ===================== */

  const BORDER_MAIN = "rgb(17, 141, 255)"

  const thBase = {
    color: "#252423",
    padding: isMobile ? "4px 4px" : "0px 8px",
    textAlign: "right" as const,
    whiteSpace: "nowrap" as const,
    borderBottom: `2px solid ${BORDER_MAIN}`,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 16,
    fontWeight: 600 as const,
    minHegiht: isMobile ? 24 : 40,
  }

  const th = thBase
  const thDay = {
    ...thBase,
    background: "#FFF3E0",
    color: "#E65100",
  }

  const tdBase = {
    padding: isMobile ? "3px 4px" : "0px 4px",
    textAlign: "right" as const,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 20,
    maxWidth: 150,
    minWidth: 100,
  }
    const tdBaseW = {
    padding: isMobile ? "3px 4px" : "0px 4px",
    textAlign: "right" as const,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 12,
      // maxWidth: 150,
      width:"fit-content",
    minWidth: 100,
  }
  const tdBase1 = {
    padding: isMobile ? "3px 4px" : "0px 8px",
    textAlign: "right" as const,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 20,
    
    minWidth: 100,
    width:"fit-content"
  }

  const td = tdBase
  const td1 = tdBase1
  
  const metricCell2 = {
    ...tdBaseW,
    borderRight: `2px solid rgb(17, 141, 255)`,
    textAlign: "left" as const,
    ...(isMobile
      ? {}
      : { position: "sticky" as const, left: 0, zIndex: 1, backgroundClip: "padding-box" as const }),
  }

  const weekCell = {
    ...tdBase,
    fontWeight: 600,
    cursor: "pointer" as const,
    whiteSpace: "nowrap" as const,
  }

  /* ===================== RENDER ===================== */

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: `2px solid ${BORDER_MAIN}`,
        maxWidth: "100%",
        width: "fit-content",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: isMobile ? 11 : 16,
          }}
        >
         <thead>
  <tr>
    <th
      style={{
        ...th,
        width: 180,
        minWidth: 180,
        maxWidth: 180,
        textAlign: "left",
      }}
    >
      Hạng mục
    </th>

    {summaryColNames.map((name, i) => (
      <th key={`sum-h-${i}`} style={th}>
        {name}
      </th>
    ))}

    {baseWeeks.flatMap((w) => {
      const open = expandedWeek === w.weekName
      const days = weekDays(w.weekName)
      // const arrow = open ? "▲" : "▼"
      const arrow = open ? <svg width="15px" height="15px" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#000000"></path></g></svg>: <svg width="15px" height="15px" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000"></path></g></svg>

      if (!open) {
        return (
          <th
            key={`wh-${w.weekName}`}
            style={th}
            onClick={() => toggleWeek(w)}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <span>{w.weekName}</span>
              <span style={{ fontSize: 16 }}>{arrow}</span>
            </span>
          </th>
        )
      }

      return [
        <th
          key={`wh-${w.weekName}`}
          style={th}
          onClick={() => toggleWeek(w)}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <span>{w.weekName}</span>
            <span style={{ fontSize: 16 }}>{arrow}</span>
          </span>
        </th>,
        ...days.map((d, idx) => (
          <th key={`whd-${w.weekName}-${idx}`} style={thDay}>
            {d.label}
          </th>
        )),
      ]
    })}
  </tr>
</thead>


          <tbody>
            {table.Rows.map((r, idx) => (
              <tr
                key={r.SequenceRow}
                style={{ background: idx % 2 ? "#e8e8e8" : "#FFFFFF",height:25 }}
              >
                <td style={metricCell2}>{r.ReportRow}</td>

                {/* SUMMARY */}
                {summaryColSeqs.map((seq) => {

                  const c = getCellBySeq(r, seq)
                  
  const text = formatValue(c)

  const link = c?.LinkUrl
  let color = c?.FontColor ?? undefined

  const columnParent = c?.ReportColumnParent
  const rowName = c?.ReportRow
  const value = Number(c?.ReportValue ?? 0)

  // Tìm giá trị của cột "Mục tiêu tháng" cùng dòng (row) và cùng ReportRow
  const getTargetValueForRow = () => {
    const targetCell = summaryColSeqs
      .map((s) => getCellBySeq(r, s))
      .find(
        (cell) =>
          cell &&
          cell.ReportColumnParent === "Mục tiêu tháng" &&
          cell.ReportRow === rowName
      )

    return Number(targetCell?.ReportValue ?? 0)
  }

  // --- LOGIC MÀU ---
  if (columnParent === "Tiến độ tích lũy") {
    if (value < 0) color = "#c62828"
    else if (value > 0) color = "#2e7d32"
    else color = "#333"
  } else if (columnParent === "Lũy kế tháng") {
    const targetValue = getTargetValueForRow()

    if (rowName === "Đầu tư") {
      // Lũy kế tháng - Đầu tư:
      // value < Mục tiêu tháng -> xanh, ngược lại -> đỏ
      color = value < targetValue ? "#2e7d32" : "#c62828"
    } else if (rowName === "Doanh thu") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }    else if (rowName === "Doanh thu trung bình") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "%inbox ấm/inbox") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "%Đặt hẹn/inbox ấm") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "%Đến khám/đặt hẹn") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "%Thực hiện dịch vụ/đến khám") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "%Chi phí/doanh thu") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
      else if (rowName === "Giá inbox (Đầu tư/inbox)") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value > targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "Inbox") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
    else if (rowName === "Inbox ấm (ấm + nóng)") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
    else if (rowName === "Đặt hẹn") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "Đến khám") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
     else if (rowName === "Thực hiện dịch vụ") {
      // Lũy kế tháng - Doanh thu:
      // value > Mục tiêu tháng -> đỏ, ngược lại -> xanh
      color = value < targetValue ? "#c62828" : "#2e7d32"
    }
  }

  return (
    <td
      key={`sum-${r.SequenceRow}-${seq}`}
      style={{ ...td, color }}
    >
      {link ? (
        <span
          onClick={() => {
          window.open(link, "_blank", "noopener,noreferrer");
        }}
          rel="noreferrer"
          style={{ textDecoration: "underline", cursor: "pointer",  }}
        >
          {text}
        </span>
      ) : (
        text
      )}
    </td>
  )
})}


               {/* WEEK + DAYS */}
{baseWeeks.flatMap((w) => {
  const open = expandedWeek === w.weekName
  const days = weekDays(w.weekName)
  const weekRowName = r.ReportRow

  const weekLink = (() => {
    for (const d of days) {
      const v = dayValueForRow(r, w.weekName, d.dateIso, w.seq)
      if (v?.link) return v.link
    }
    return null
  })()

  // --- TÍNH TỔNG TUẦN & MÀU SO VỚI MỤC TIÊU THÁNG ---
  const rawTotal = weekTotalForRow(r, w.weekName, w.seq)
  const totalText =
    typeof rawTotal === "string"
      ? rawTotal
      : typeof rawTotal === "number"
      ? fmtNumber(rawTotal)
      : "-"

  // cố gắng parse số từ totalText (trường hợp format có dấu phẩy, đơn vị,...)
  // const totalNumber =
  //   typeof rawTotal === "number"
  //     ? rawTotal
  //     : Number(String(totalText).replace(/[^\d.-]/g, ""))

  // tìm "Mục tiêu tháng" cùng ReportRow
  const targetCellForWeek = summaryColSeqs
    .map((s) => getCellBySeq(r, s))
    .find(
      (cell) =>
        cell &&
        cell.ReportColumnParent === "Mục tiêu tháng" &&
        cell.ReportRow === weekRowName
    )

  const targetValueWeek = Number(targetCellForWeek?.ReportValue ?? 0)

  let weekColor: string | undefined
   
  // --- LOGIC MÀU TƯƠNG TỰ LŨY KẾ THÁNG ---
  const totalNumber = parseInt(totalText.replaceAll(".", ""), 10);
  if (weekRowName === "Đầu tư") {
    // < mục tiêu -> xanh, ngược lại đỏ
    weekColor = totalNumber < targetValueWeek ? "#2e7d32" : "#c62828"
  } else if (weekRowName === "Doanh thu") {
    // > mục tiêu -> đỏ, ngược lại xanh
    weekColor = totalNumber < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "Doanh thu trung bình") {
    weekColor = totalNumber < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "%inbox ấm/inbox") {
    weekColor = (totalNumber/100) < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "%Đặt hẹn/inbox ấm") {
    weekColor = (totalNumber/100) < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "%Đến khám/đặt hẹn") {
    weekColor = (totalNumber/100) < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "%Thực hiện dịch vụ/đến khám") {
    weekColor = (totalNumber/100) < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "%Chi phí/doanh thu") {
    weekColor = (totalNumber/100) < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "Giá inbox (Đầu tư/inbox)") {
    // cao hơn mục tiêu -> đỏ, ngược lại xanh
    weekColor = totalNumber > targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "Inbox") {
    weekColor = totalNumber < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "Inbox ấm (ấm + nóng)") {
    weekColor = totalNumber < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "Đặt hẹn") {
    weekColor = totalNumber < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "Đến khám") {
    weekColor = totalNumber < targetValueWeek ? "#c62828" : "#2e7d32"
  } else if (weekRowName === "Thực hiện dịch vụ") {
    weekColor = totalNumber < targetValueWeek ? "#c62828" : "#2e7d32"
  }

  const arrow = open ? "▲" : "▼"

  const totalCell = (
    <td
      key={`week-${r.SequenceRow}-${w.weekName}`}
      style={weekCell}
      onClick={weekLink ? undefined : () => toggleWeek(w)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* mũi tên ở bên trái số tổng nếu cần */}
        {/* <span>{arrow}</span> */}

        {weekLink ? (
          <a
            href={weekLink}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "underline",
              color: weekColor ?? "#0510af",
              fontWeight: 500,
            }}
          >
            {totalText}
          </a>
        ) : (
          <span style={{ fontWeight: 500, color: weekColor }}>
            {totalText}
          </span>
        )}
      </div>
    </td>
  )

  if (!open) return [totalCell]

  return [
    totalCell,
    ...days.map((d, idx2) => {
      const v = dayValueForRow(r, w.weekName, d.dateIso, w.seq)
      const text =
        v?.formatted ??
        (typeof v?.value === "number" ? fmtNumber(v.value) : "-")

      return (
        <td
          key={`day-${r.SequenceRow}-${w.weekName}-${idx2}`}
          style={{ ...td1, background: "#FFFBF0", color: v?.color }}
        >
          {v?.link ? (
            <a
              href={v.link}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "underline", color: "#0510af" }}
            >
              {text}
            </a>
          ) : (
            text
          )}
        </td>
      )
    }),
  ]
})}


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



/* ===================== Table 2: Barrier ===================== */
function BarrierTableV2({ table, title }: { table: TableBlock; title: string }) {
  const isMobile = useIsMobile()

  const columns = useMemo(() => {
    const wanted = ["Tỉ lệ mục tiêu", "Số lượng", "Tỉ lệ thực tế"]
    const exist = new Set<string>()
    const bySeq = [...table.Columns].sort(
      (a, b) => a.SequenceColumn - b.SequenceColumn,
    )
    const out: string[] = []

    bySeq.forEach((c) => {
      if (wanted.includes(c.ColumnName) && !exist.has(c.ColumnName)) {
        exist.add(c.ColumnName)
        out.push(c.ColumnName)
      }
    })

    wanted.forEach((w) => !exist.has(w) && out.push(w))
    return out.slice(0, 3)
  }, [table])

  const getCellByName = (row: TableBlock["Rows"][number], colName: string) =>
    Object.values(row.Cells).find((c) => c.ReportColumn === colName)

  const renderValue = (cell?: ReturnType<typeof getCellByName>) => {
    if (!cell) return "-"
   return formatValue(cell)
  }

  /* ===== STYLE giống block nhỏ ở dưới hình 1 ===== */

  const BORDER_MAIN = "rgb(17, 141, 255)"
  const HEADER_BG = "#E6F2FF"

  const th = {
    color: "#252423",
    padding: isMobile ? "4px 4px" : "0px 8px",
    textAlign: "right" as const,
    whiteSpace: "nowrap" as const,
    borderBottom: `2px solid ${BORDER_MAIN}`,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 16,
    fontWeight: 600 as const,
  }

  const td = {
    padding: isMobile ? "3px 4px" : "0px 8px",
    textAlign: "right" as const,
     borderLeft :`1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 16,

  }

  const nameCell = {
    ...td,
    textAlign: "left" as const,
    borderRight:`2px solid ${BORDER_MAIN}`
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: `2px solid ${BORDER_MAIN}`,
         maxWidth: "100%",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: isMobile ? 11 : 16,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...th, width: 250, textAlign: "left", }}>{title}</th>
              {columns.map((c) => (
                <th key={c} style={th}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.Rows.map((r, idx) => (
              <tr
                key={r.SequenceRow}
                style={{ background: idx % 2 ? "#e8e8e8" : "#FFFFFF" }}
              >
                <td style={nameCell}>{r.ReportRow}</td>
                {columns.map((c) => {
                  const cell = getCellByName(r, c)
                  const color = cell?.FontColor || undefined
                  const link = cell?.LinkUrl || undefined
                  const content = renderValue(cell)
                  return (
                    <td
                      key={`${r.SequenceRow}-${c}`}
                      style={{ ...td, color }}
                    >
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: "underline",color:"#0510af" }}
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function BarrierTableV3({ table, title }: { table: TableBlock; title: string }) {
  const isMobile = useIsMobile()

  const columns = useMemo(() => {
    const wanted = [ "Số lượng"]
    const exist = new Set<string>()
    const bySeq = [...table.Columns].sort(
      (a, b) => a.SequenceColumn - b.SequenceColumn,
    )
    const out: string[] = []

    bySeq.forEach((c) => {
      if (wanted.includes(c.ColumnName) && !exist.has(c.ColumnName)) {
        exist.add(c.ColumnName)
        out.push(c.ColumnName)
      }
    })

    wanted.forEach((w) => !exist.has(w) && out.push(w))
    return out.slice(0, 3)
  }, [table])

  const getCellByName = (row: TableBlock["Rows"][number], colName: string) =>
    Object.values(row.Cells).find((c) => c.ReportColumn === colName)

  const renderValue = (cell?: ReturnType<typeof getCellByName>) => {
    if (!cell) return "-"
    return formatValue(cell)

  }

  /* ===== STYLE giống block nhỏ ở dưới hình 1 ===== */

  const BORDER_MAIN = "rgb(17, 141, 255)"
  const HEADER_BG = "#E6F2FF"

  const th = {
    color: "#252423",
    padding: isMobile ? "4px 4px" : "0px 8px",
    textAlign: "right" as const,
    whiteSpace: "nowrap" as const,
    borderBottom: `2px solid ${BORDER_MAIN}`,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 16,
    fontWeight: 600 as const,
  }

  const td = {
    padding: isMobile ? "3px 4px" : "0px 8px",
    textAlign: "right" as const,
     borderLeft :`1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 16,

  }

  const nameCell = {
    ...td,
    textAlign: "left" as const,
    borderRight:`2px solid ${BORDER_MAIN}`
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: `2px solid ${BORDER_MAIN}`,
         maxWidth: "81%",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: isMobile ? 11 : 16,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...th, width: 250, textAlign: "left", color:"#c40608" }}>{title}</th>
              {columns.map((c) => (
                <th key={c} style={th}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.Rows.map((r, idx) => (
              <tr
                key={r.SequenceRow}
                style={{ background: idx % 2 ? "#e8e8e8" : "#FFFFFF" }}
              >
                {/* <td style={nameCell}>{r.ReportRow}</td> */}
                 <td style={nameCell}>Đang follow quá 14 ngày (lũy kế)</td>
                {columns.map((c) => {
                  const cell = getCellByName(r, c)
                  const color = cell?.FontColor || undefined
                  const link = cell?.LinkUrl || undefined
                  const content = renderValue(cell)
                  return (
                    <td
                      key={`${r.SequenceRow}-${c}`}
                      style={{ ...td, color }}
                    >
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: "underline",color:"#0510af" }}
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "0px 6px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "13px",
  backgroundColor: "#f0f0f0",
}
const tableHeaderStyle2: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "0px 6px",
  textAlign: "right",
  fontWeight: "bold",
  fontSize: "13px",
  backgroundColor: "#f0f0f0",
}

const tableCellStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "1px 6px",
  fontSize: "13px",
  textAlign: "left",
  minHeight: "20px",
}
const tableCellStyle2: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "1px 6px",
  fontSize: "13px",
  textAlign: "right",
  minHeight: "20px",
}
 const containerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '0px 0px',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.95fr 1fr',
    alignItems: 'center',
    marginBottom: '0px',
    gap: '20px',
    
  };

  const logoStyle: React.CSSProperties = {
    width: '200px',
    height: '50px',
    backgroundColor: '#f5a623',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1e5a96',
    fontWeight: 'bold',
    fontSize: '14px',
    
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 'normal',
    fontStyle: 'normal',fontFamily:'wf_standard-font, helvetica, arial, sans-serif',
    color: '#333333',
    flex: 1,
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'flex-end',
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #cccccc',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#666666',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px',
  };

  const channelSelectStyle: React.CSSProperties = {
    ...selectStyle,
    minWidth: '280px',
  };

  const monthSelectStyle: React.CSSProperties = {
    ...selectStyle,
    minWidth: '70px',
  };

  const yearSelectStyle: React.CSSProperties = {
    ...selectStyle,
    minWidth: '100px',
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '80px',
    width:"82vw",
    alignItems: 'center',
    // paddingTop: '10px',
    // marginBottom: '15px',
    paddingLeft: 10,
    justifyContent:"end"
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const statLabelStyle: React.CSSProperties = {

    fontWeight: '700',
    textAnchor: "start",
    fill: "rgb(51, 51, 51)",
    fontSize: "20px",
    fontStyle: "normal",
    
  };
  const statLabelStyle2: React.CSSProperties = {

    fontWeight: '500',
    textAnchor: "start",
    fill: "rgb(51, 51, 51)",
    fontSize: "20px",
    fontStyle: "normal",
    
  };
  const statValueStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#333333',
    fontWeight: '600',
  };
