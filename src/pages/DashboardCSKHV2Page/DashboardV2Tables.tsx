'use client';
import React, { useMemo, useState } from 'react';

type DailyPoint = { date: string; value: number };

interface MetricItem {
  label: string;
  dailySeries: DailyPoint[];
  isSubItem?: boolean;
  isRevenueHeader?: boolean;
}

interface MetricsSection {
  title: string;
  sidebarColor?: string;
  items: MetricItem[];
}

interface Props {
  sections: MetricsSection[];
  rangeStart: string; // YYYY-MM-DD
  rangeEnd: string; // YYYY-MM-DD
}

const BORDER_STRONG = '2px solid #000';
const BORDER_DOTTED = '1px dotted #777';

function toDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day);
}
function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function inRange(dateStr: string, start: string, end: string) {
  const t = toDate(dateStr).getTime();
  return t >= toDate(start).getTime() && t <= toDate(end).getTime();
}
function sumSeries(series: DailyPoint[]) {
  return series.reduce((s, p) => s + (Number(p.value) || 0), 0);
}
function valueOnDay(series: DailyPoint[], day: string) {
  const f = series.find((p) => p.date === day);
  return f ? f.value : 0;
}

// ✅ tạo tuần theo chunk 7 ngày trong chính tháng (không lấn tháng khác)
function getWeeksByMonthChunks(rangeStart: string, rangeEnd: string) {
  const start = toDate(rangeStart);
  const end = toDate(rangeEnd);

  const weeks: Array<{ start: string; end: string; days: string[] }> = [];
  let curStart = new Date(start);

  while (curStart.getTime() <= end.getTime()) {
    const curEnd = addDays(curStart, 6);
    const clampedEnd = curEnd.getTime() > end.getTime() ? end : curEnd;

    const days: string[] = [];
    for (let d = new Date(curStart); d.getTime() <= clampedEnd.getTime(); d = addDays(d, 1)) {
      days.push(fmtDate(d));
    }

    weeks.push({
      start: fmtDate(curStart),
      end: fmtDate(clampedEnd),
      days,
    });

    curStart = addDays(curStart, 7);
  }

  return weeks;
}

function formatCell(label: string, v: number): string | number {
  const l = label.toLowerCase();
  if (l.includes('tỷ lệ') || l.includes('%')) return `${Math.round(v)}%`;
  if (l.includes('doanh thu')) return `${Math.round(v).toLocaleString('vi-VN')} đ`;
  return Math.round(v);
}

export default function MetricsDashboard({ sections, rangeStart, rangeEnd }: Props) {
  const [expandedWeekIdx, setExpandedWeekIdx] = useState<number | null>(null);
  const weeks = useMemo(() => getWeeksByMonthChunks(rangeStart, rangeEnd), [rangeStart, rangeEnd]);

  const flat = useMemo(() => {
    const rows: Array<{ sectionIdx: number; itemIdx: number; item: MetricItem }> = [];
    sections.forEach((sec, sIdx) => sec.items.forEach((item, iIdx) => rows.push({ sectionIdx: sIdx, itemIdx: iIdx, item })));
    return rows;
  }, [sections]);

  const totalRows = flat.length;

  // ✅ grid columns:
  // sidebar | label | month | [week cols...]
  // Not expanded: month + W1..Wn
  // Expanded week k: month + W1..W(k-1) + [Tuần k ➤] + [days...] + W(k+1)..
  const gridTemplateColumns = useMemo(() => {
    const sidebar = '110px';
    const label = 'minmax(0, 1fr)';
    const col = '88px';

    if (expandedWeekIdx === null) {
      return `${sidebar} ${label} ${col} repeat(${weeks.length}, ${col})`;
    }

    const daysCount = weeks[expandedWeekIdx]?.days.length ?? 0;
    const before = expandedWeekIdx;
    const after = weeks.length - expandedWeekIdx - 1;

    return `${sidebar} ${label} ${col} repeat(${before}, ${col}) ${col} repeat(${daysCount}, ${col}) repeat(${after}, ${col})`;
  }, [weeks, expandedWeekIdx]);

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    gridTemplateColumns,
    gridTemplateRows: `40px repeat(${totalRows}, auto)`,
    border: BORDER_STRONG,
    fontFamily: 'Arial, sans-serif',
    fontSize: 12,
    background: '#fff',
  };

  const headerCellBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    background: '#fff',
    borderBottom: BORDER_STRONG,
    padding: '0 8px',
    userSelect: 'none',
    minWidth: 0,
  };

  const weekArrowHeader: React.CSSProperties = {
    ...headerCellBase,
    justifyContent: 'flex-start',
    paddingLeft: 10,
  };

  const dayHeaderStyle: React.CSSProperties = {
    ...headerCellBase,
    color: '#D66A00',
    fontWeight: 800,
  };

  const bodyCellBase = (bg: string, rowTop: string, rowBottom: string, borderRight: string) =>
    ({
      background: bg,
      borderTop: rowTop,
      borderBottom: rowBottom,
      borderRight,
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      minWidth: 0,
    }) as React.CSSProperties;

  const calcMonth = (item: MetricItem) => {
    const filtered = item.dailySeries.filter((p) => inRange(p.date, rangeStart, rangeEnd));
    return sumSeries(filtered);
  };
  const calcWeek = (item: MetricItem, wStart: string, wEnd: string) => {
    const filtered = item.dailySeries.filter((p) => inRange(p.date, wStart, wEnd));
    return sumSeries(filtered);
  };
  const calcDay = (item: MetricItem, day: string) => {
    if (!inRange(day, rangeStart, rangeEnd)) return 0;
    return valueOnDay(item.dailySeries, day);
  };

  // ✅ IMPORTANT: colIndexForWeekStart trả về "cột tuần" (Wk hoặc Tuần k ➤), KHÔNG trả về cột ngày.
  const colIndexForWeekStart = (weekIdx: number) => {
    // base dynamic start at col 4 (1 sidebar, 2 label, 3 month)
    if (expandedWeekIdx === null) return 4 + weekIdx;

    const daysCount = weeks[expandedWeekIdx]?.days.length ?? 0;

    if (weekIdx < expandedWeekIdx) return 4 + weekIdx;
    if (weekIdx === expandedWeekIdx) return 4 + expandedWeekIdx; // cột "Tuần k ➤"
    // weekIdx > expandedWeekIdx => shift +daysCount (vì thêm daysCount cột)
    return 4 + weekIdx + daysCount;
  };

  const isLastSectionIdx = (idx: number) => idx === sections.length - 1;

  return (
    <div style={gridStyle}>
      {/* HEADER */}
      <div style={{ ...headerCellBase, gridRow: 1, gridColumn: '1 / 2', borderRight: BORDER_STRONG }} />
      <div
        style={{
          ...headerCellBase,
          gridRow: 1,
          gridColumn: '2 / 3',
          justifyContent: 'flex-start',
          borderRight: BORDER_DOTTED,
          paddingLeft: 12,
        }}
      >
        Chỉ tiêu
      </div>
      <div style={{ ...headerCellBase, gridRow: 1, gridColumn: '3 / 4', borderRight: BORDER_DOTTED }}>Tháng</div>

      {/* WEEKS HEADER */}
      {weeks.map((w, wIdx) => {
        const colStart = colIndexForWeekStart(wIdx);

        // ✅ expanded week => render "Tuần k ➤" + days (same header row)
        if (expandedWeekIdx === wIdx) {
          const weekLabelCol = colStart;
          const firstDayCol = colStart + 1;

          return (
            <React.Fragment key={`h-exp-${wIdx}`}>
              <div
                style={{
                  ...weekArrowHeader,
                  gridRow: 1,
                  gridColumn: `${weekLabelCol} / ${weekLabelCol + 1}`,
                  borderRight: BORDER_DOTTED,
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedWeekIdx(null)}
                title="Click để thu gọn"
              >
                Tuần {wIdx + 1} <span style={{ marginLeft: 6 }}>➤</span>
              </div>

              {w.days.map((d, i) => {
                const dd = d.slice(8, 10);
                const mm = d.slice(5, 7);
                return (
                  <div
                    key={`h-day-${wIdx}-${d}`}
                    style={{
                      ...dayHeaderStyle,
                      gridRow: 1,
                      gridColumn: `${firstDayCol + i} / ${firstDayCol + i + 1}`,
                      borderRight: BORDER_DOTTED,
                    }}
                  >
                    {dd}-{mm}
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        // normal week header
        const isLast = wIdx === weeks.length - 1 && expandedWeekIdx === null;
        return (
          <div
            key={`h-week-${wIdx}`}
            style={{
              ...headerCellBase,
              gridRow: 1,
              gridColumn: `${colStart} / ${colStart + 1}`,
              borderRight: isLast ? 'none' : BORDER_DOTTED,
              cursor: 'pointer',
            }}
            onClick={() => setExpandedWeekIdx(wIdx)}
            title="Click để xem ngày"
          >
            Tuần {wIdx + 1}
          </div>
        );
      })}

      {/* SIDEBAR merged by section (body start at row 2) */}
      {(() => {
        let rowStart = 2;
        return sections.map((sec, sIdx) => {
          const span = sec.items.length;
          const cell = (
            <div
              key={`sidebar-${sIdx}`}
              style={{
                gridColumn: '1 / 2',
                gridRow: `${rowStart} / span ${span}`,
                background: sec.sidebarColor || '#FFEB00',
                borderRight: BORDER_STRONG,
                borderTop: sIdx === 0 ? 'none' : BORDER_STRONG,
                borderBottom: isLastSectionIdx(sIdx) ? 'none' : BORDER_STRONG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                textAlign: 'center',
                padding: '0 8px',
              }}
            >
              {sec.title}
            </div>
          );
          rowStart += span;
          return cell;
        });
      })()}

      {/* BODY */}
      {flat.map((r, flatIdx) => {
        const row = flatIdx + 2;

        const sec = sections[r.sectionIdx];
        const isFirstInSection = r.itemIdx === 0;
        const isLastInSection = r.itemIdx === sec.items.length - 1;
        const isLastSection = isLastSectionIdx(r.sectionIdx);

        const rowBottom = isLastInSection ? (isLastSection ? 'none' : BORDER_STRONG) : BORDER_DOTTED;
        const rowTop = isFirstInSection && r.sectionIdx !== 0 ? BORDER_STRONG : 'none';
        const bg = r.item.isRevenueHeader ? '#FFF2CC' : '#fff';

        const monthVal = calcMonth(r.item);

        return (
          <React.Fragment key={`row-${flatIdx}`}>
            {/* Label */}
            <div
              style={{
                gridColumn: '2 / 3',
                gridRow: row,
                ...bodyCellBase(bg, rowTop, rowBottom, BORDER_DOTTED),
                paddingLeft: r.item.isSubItem ? 28 : 12,
                fontWeight: r.item.isRevenueHeader ? 700 : 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {r.item.label}
            </div>

            {/* Month */}
            <div
              style={{
                gridColumn: '3 / 4',
                gridRow: row,
                ...bodyCellBase(bg, rowTop, rowBottom, BORDER_DOTTED),
                justifyContent: 'flex-end',
              }}
            >
              {monthVal === 0 ? '-' : formatCell(r.item.label, monthVal)}
            </div>

            {/* Weeks / Expanded Week */}
            {weeks.map((w, wIdx) => {
              const colStart = colIndexForWeekStart(wIdx);

              // expanded week: 1 col week total + days
              if (expandedWeekIdx === wIdx) {
                const weekTotalCol = colStart;
                const firstDayCol = colStart + 1;

                const weekTotal = calcWeek(r.item, w.start, w.end);

                return (
                  <React.Fragment key={`exp-${flatIdx}-${wIdx}`}>
                    {/* Week total */}
                    <div
                      style={{
                        gridColumn: `${weekTotalCol} / ${weekTotalCol + 1}`,
                        gridRow: row,
                        ...bodyCellBase(bg, rowTop, rowBottom, BORDER_DOTTED),
                        justifyContent: 'flex-end', 
                        fontWeight: 700,
                      }}
                    >
                      {weekTotal === 0 ? '-' : formatCell(r.item.label, weekTotal)}
                    </div>

                    {/* Days */}
                    {w.days.map((day, i) => {
                      const v = calcDay(r.item, day);
                      return (
                        <div
                          key={`d-${flatIdx}-${wIdx}-${day}`}
                          style={{
                            gridColumn: `${firstDayCol + i} / ${firstDayCol + i + 1}`,
                            gridRow: row,
                            ...bodyCellBase(bg, rowTop, rowBottom, BORDER_DOTTED),
                            justifyContent: 'flex-end',
                          }}
                        >
                          {v === 0 ? '-' : formatCell(r.item.label, v)}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              }

              // normal week total
              const v = calcWeek(r.item, w.start, w.end);
              return (
                <div
                  key={`w-${flatIdx}-${wIdx}`}
                  style={{
                    gridColumn: `${colStart} / ${colStart + 1}`,
                    gridRow: row,
                    ...bodyCellBase(bg, rowTop, rowBottom, BORDER_DOTTED),
                    justifyContent: 'flex-end',
                  }}
                >
                  {v === 0 ? '-' : formatCell(r.item.label, v)}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
