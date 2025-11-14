/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { postLoadLeadReportDayAPI } from "services/api/leadReportAPI"
import { ApiResponse, TableBlock } from "services/api/leadReportAPI/types"


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


/* ===================== Helpers ===================== */
const fmtCurrency = (v: number) => {
  if (isNaN(v)) return "-"
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + "M"
  if (Math.abs(v) >= 1_000) return (v / 1_000).toFixed(2) + "K"
  return v.toFixed(0)
}
const fmtPercent = (v: number) => (isNaN(v) ? "-" : (v * 100).toFixed(2) + "%")

const useTable = (data: ApiResponse | undefined, index: number) =>
  useMemo(() => data?.data?.Tables?.find((t) => t.TableIndex === index), [data, index])
interface Props {
  dataRaw: ApiResponse,
  handleSeenDay: any,
  dataFilter:any
 }
/* ===================== Page ===================== */
export default function DashboardPage({ dataRaw, handleSeenDay, dataFilter }: Props) {
    const isMobile = useIsMobile() 
  const table1 = useTable(dataRaw, 1)
  const table2 = useTable(dataRaw, 2)
  const table3 = useTable(dataRaw, 3)
  const table4 = useTable(dataRaw, 4)
  const table5 = useTable(dataRaw, 5)
  const table6 = useTable(dataRaw, 6)
  console.log('dataRaw', dataRaw)
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
          console.log('🚀 ~ file: index.tsx:157 ~ data:', data);
          toast.success(data?.message);
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
    <div style={{ display: "grid", gap: 12 }}>
      {table1 && <WeeklyTableV2 table={table1}
    postLoadLeadReportDay={postLoadLeadReportDay} />}
      
        <div style={{
        display: "grid",
       gridTemplateColumns:  "0.8fr" ,
        gap: 12, maxWidth: "100%",
      }}
      >
        <div style={{
        display: "grid",
       gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 12, maxWidth: "90%",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          
        }}>
          {table2 && <BarrierTableV2 table={table2} title="Inbox ấm → Đặt hẹn" />}
          {table4 && <BarrierTableV2 table={table4} title="Đặt hẹn → đến khám" />}
          {table6 && <BarrierTableV2 table={table6} title="Đến khám → Thực hiện dịch vụ" />}
        </div>
       <div style={{
          display: "flex",
          flexDirection: "column",
          gap:12
        }}>
          {table3 && <BarrierTableV2 table={table3} title="Rào cản đặt hẹn thất bại" />}
          {table5 && <BarrierTableV2 table={table5} title="Rào cản đặt hẹn mà không đến" />}
        </div>
      </div>
      
      </div>
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
    const cells = Object.values(firstRow.Cells)
    return cells
      .filter((c) => !c.IsDayColumn)
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

  const baseWeekDays = useMemo(() => {
    const map = new Map<string, { dateIso: string; label: string }[]>()
    baseWeeks.forEach((w) => map.set(w.weekName, []))
    table.Rows.forEach((r) =>
      Object.values(r.Cells)
        .filter((c) => c.IsDayColumn)
        .forEach((c) => {
          const wk = c.ReportColumnParent || c.ReportColumn
          const arr = map.get(wk)
          if (!arr) return
          const iso = c.ReportDate || ""
          const lbl = c.ReportColumnChild || ""
          if (!arr.some((x) => x.dateIso === iso)) arr.push({ dateIso: iso, label: lbl })
        }),
    )
    Array.from(map.values()).forEach((days) =>
      days.sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime()),
    )
    return map
  }, [table, baseWeeks])

  const weekDays = (weekName: string) =>
    loadedWeeks[weekName]?.days ?? baseWeekDays.get(weekName) ?? []

  const getCellBySeq = (row: TableBlock["Rows"][number], seq: number) =>
    Object.values(row.Cells).find((c) => c.SequenceColumn === seq)

  const dayValueForRowFormatted = (
    row: TableBlock["Rows"][number],
    iso: string,
    seq: number,
  ) => {
    const cell = Object.values(row.Cells).find(
      (c) => c.IsDayColumn && c.SequenceColumn === seq && c.ReportDate === iso,
    )
    return cell ? cell.FormattedValue : undefined
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
    if (!isOpen) {
      try {
        const weekNumber = getWeekNumber(w.weekName)
        const res = await fetchWeekViaMutate(weekNumber)

        const uniqDays = Array.from(
          new Map(
            res.data.Columns.filter((c) => !!c.ColumnDate).map((c) => [c.ColumnDate, c]),
          ).values(),
        )
          .sort(
            (a, b) =>
              new Date(a.ColumnDate!).getTime() - new Date(b.ColumnDate!).getTime(),
          )
          .map((c) => ({ dateIso: c.ColumnDate!, label: toLabel(c.ColumnDate!) }))

        const valuesByRow: LoadedWeek["valuesByRow"] = {}
        res.data.Rows.forEach((row) => {
          const cell = row.Cells[String(w.seq)]
          if (!cell || !cell.ReportDate) return
          valuesByRow[row.ReportRow] ||= {}
          valuesByRow[row.ReportRow][cell.ReportDate] = {
            value: cell.ReportValue,
            formatted: cell.FormattedValue || undefined,
            color: cell.FontColor || undefined,
            link: cell.LinkUrl || undefined,
          }
        })

        setLoadedWeeks((prev) => ({
          ...prev,
          [w.weekName]: { seq: w.seq, days: uniqDays, valuesByRow },
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
          formatted: c.FormattedValue || undefined,
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
    fontSize: isMobile ? 11 : 13,
    fontWeight: 600 as const,
  }

  const th = thBase
  const thDay = {
    ...thBase,
    background: "#FFF3E0",
    color: "#E65100",
  }

  const tdBase = {
    padding: isMobile ? "3px 4px" : "0px 8px",
    textAlign: "right" as const,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 13,
    maxWidth: 120,
    minWidth: 100,
  }
  const tdBase1 = {
    padding: isMobile ? "3px 4px" : "0px 8px",
    textAlign: "right" as const,
    borderLeft: `1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 13,
    maxWidth: 80,
    minWidth: 80,
  }

  const td = tdBase
  const td1 = tdBase1

  const metricCell2 = {
    ...tdBase,
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
            fontSize: isMobile ? 11 : 13,
          }}
        >
         <thead>
  <tr>
    <th
      style={{
        ...th,
        width: 250,
        minWidth: 250,
        maxWidth: 250,
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
      const arrow = open ? "▸": "▾"

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
                style={{ background: idx % 2 ? "#F3F3F3" : "#FFFFFF" }}
              >
                <td style={metricCell2}>{r.ReportRow}</td>

                {/* SUMMARY */}
                {summaryColSeqs.map((seq) => {
                  const c = getCellBySeq(r, seq)
                  const text = c?.FormattedValue ?? "-"
                  const link = c?.LinkUrl
                  let color = c?.FontColor ?? undefined

                  if (c?.ReportColumnParent === "Tiến độ tích lũy") {
                    const value = Number(c?.ReportValue || 0)
                    if (value < 0) color = "#c62828"
                    else if (value > 0) color = "#2e7d32"
                    else color = "#333"
                  }

                  return (
                    <td
                      key={`sum-${r.SequenceRow}-${seq}`}
                      style={{ ...td, color }}
                    >
                      {link ? (
                        <a
                          href={link}
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
                })}

                {/* WEEK + DAYS */}
                {baseWeeks.flatMap((w) => {
                  const open = expandedWeek === w.weekName
                  const days = weekDays(w.weekName)

                  const weekLink = (() => {
                    for (const d of days) {
                      const v = dayValueForRow(r, w.weekName, d.dateIso, w.seq)
                      if (v?.link) return v.link
                    }
                    return null
                  })()

                  const totalText = weekTotalForRow(r, w.weekName, w.seq)

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
        {/* mũi tên ở bên trái số tổng */}
        

        {weekLink ? (
          <a
            href={weekLink}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "underline",
              color: "#0510af",
              fontWeight: 500,
            }}
          >
            {totalText}
          </a>
        ) : (
          <span style={{ fontWeight: 500 }}>{totalText}</span>
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
        (typeof v?.value === "number" ? fmtCurrency(v.value) : "-")

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
    if (cell.ReportColumn.includes("Tỉ lệ")) return fmtPercent(cell.ReportValue)
    if (cell.ReportColumn === "Số lượng") return (cell.ReportValue ?? 0).toFixed(0)
    return cell.FormattedValue || String(cell.ReportValue)
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
    fontSize: isMobile ? 11 : 13,
    fontWeight: 600 as const,
  }

  const td = {
    padding: isMobile ? "3px 4px" : "0px 8px",
    textAlign: "right" as const,
     borderLeft :`1px solid #E5E5E5`,
    fontSize: isMobile ? 11 : 13,

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
            fontSize: isMobile ? 11 : 13,
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
                style={{ background: idx % 2 ? "#F3F3F3" : "#FFFFFF" }}
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
