'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const API_URL =
  'https://opensheet.elk.sh/1ZkP5CqYQxU-dLnSJEqm7tPCAEDwhQKfWILv_RfJGoLA/feeding_data';

type Row = {
  'Influencer ID'?: string;
  '1st_total'?: number | string;
  '2nd_total'?: number | string;
  Tier?: string; // Bronze, Silver, Gold, Platinum, Diamond
};

function toNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(n);
}

function fmtInt(n: number) {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(
    Math.trunc(n),
  );
}

function normTier(t?: string) {
  return String(t || '').trim();
}

function tierClass(t?: string) {
  const v = normTier(t).toLowerCase();
  if (v === 'diamond') return 'bg-cyan-50 text-cyan-700 ring-cyan-200';
  if (v === 'platinum') return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
  if (v === 'gold') return 'bg-amber-50 text-amber-700 ring-amber-200';
  if (v === 'silver') return 'bg-slate-100 text-slate-700 ring-slate-200';
  return 'bg-orange-50 text-orange-700 ring-orange-200'; // bronze/default
}

// ✅ extract trailing number for sorting: "influencer-2602-439" -> 439
function idTailNumber(id: string) {
  const m = String(id).match(/(\d+)\s*$/);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
}

const PLACEHOLDER_IDS = [
  'influencer-0000-00',
  'influencer-0000-01',
  'influencer-0000-02',
];

type TabKey = 'p1' | 'p2';

export default function App() {
  const [data, setData] = useState<Row[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [row, setRow] = useState<Row | null>(null);

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [tab, setTab] = useState<TabKey>('p1');

  const getId = (r: Row) => String(r['Influencer ID'] || '');
  const getConversion = (r: Row) =>
    tab === 'p1' ? toNum(r['1st_total']) : toNum(r['2nd_total']);

  const Tabs = () => (
    <div className="inline-flex rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200">
      <button
        type="button"
        onClick={() => setTab('p1')}
        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition sm:px-3 sm:py-1.5 sm:text-xs ${
          tab === 'p1'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-300 hover:text-slate-900'
        }`}
      >
        1차 판매(2/19~2/26)
      </button>
      <button
        type="button"
        onClick={() => setTab('p2')}
        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition sm:px-3 sm:py-1.5 sm:text-xs ${
          tab === 'p2'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-300 hover:text-slate-900'
        }`}
      >
        2차 판매(2/26~3/5)
      </button>
    </div>
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrorMsg('');

    fetch(API_URL)
      .then((res) => res.json())
      .then((json: Row[]) => {
        if (!mounted) return;

        const normalized = json.map((r) => ({
          ...r,
          '1st_total': toNum((r as any)['1st_total']),
          '2nd_total': toNum((r as any)['2nd_total']),
          Tier: (r as any).Tier,
        }));

        setData(normalized);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setErrorMsg('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const found = data.find((r) => getId(r) === String(selectedId));
    setRow(found || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, data]);

  // ✅ base list sorted by trailing number asc, stable tie-break by full id
  const sortedData = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      const aId = getId(a);
      const bId = getId(b);
      const da = idTailNumber(aId);
      const db = idTailNumber(bId);
      if (da !== db) return da - db;
      return aId.localeCompare(bId);
    });
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = sortedData;
    if (!q) return base;
    return base.filter((r) => getId(r).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedData, search]);

  const avg = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((s, r) => s + getConversion(r), 0) / data.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tab]);

  const insight = useMemo(() => {
    if (!row) return null;

    const sorted = [...data].sort((a, b) => getConversion(b) - getConversion(a));
    const rank = sorted.findIndex((r) => getId(r) === String(selectedId)) + 1;
    const p = ((sorted.length - rank) / (sorted.length - 1 || 1)) * 100;

    return {
      my: getConversion(row),
      rank,
      total: sorted.length,
      percentile: p,
      tier: normTier(row.Tier) || '—',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row, data, selectedId, tab]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && e.key !== 'Enter') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === 'Enter' && filtered[highlightIndex]) {
      e.preventDefault();
      handleSelect(getId(filtered[highlightIndex]));
    }

    if (e.key === 'Escape') setOpen(false);
  };

  useEffect(() => {
    const el = itemRefs.current[highlightIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSearch(id);
    setOpen(false);
  };

  const clearSearch = () => {
    setSearch('');
    setOpen(true);
    setHighlightIndex(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const chartData = insight
    ? [
        { name: '내 판매량', value: insight.my },
        { name: '전체 평균', value: avg },
      ]
    : [
        { name: '내 판매량', value: 0 },
        { name: '전체 평균', value: 0 },
      ];

  const showResults = Boolean(insight);

  return (
    <div className="flex min-h-screen items-center bg-slate-100 px-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              인플루언서 성과 대시보드
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              ID를 검색하여 <span className="font-medium text-slate-700">내 판매량</span>
              을 <span className="font-medium text-slate-700">전체 평균</span>과
              비교해보세요
            </p>
          </div>

          {/* 검색 */}
          <div className="mt-6">
            <label
              htmlFor="influencer-search"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              인플루언서 검색
            </label>

            <div className="relative">
              <input
                id="influencer-search"
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpen(true);
                  setHighlightIndex(0);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={loading ? '데이터 불러오는 중…' : '예) influencer-0000-00'}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm shadow-sm transition outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="검색어 지우기"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                  ✕
                </button>
              )}

              {open && (
                <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="max-h-64 overflow-y-auto py-1">
                    {loading ? (
                      <div className="px-4 py-3 text-sm text-slate-500">불러오는 중…</div>
                    ) : errorMsg ? (
                      <div className="px-4 py-3 text-sm text-rose-600">{errorMsg}</div>
                    ) : filtered.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        검색 결과가 없습니다
                      </div>
                    ) : (
                      filtered.map((r, i) => (
                        <button
                          key={getId(r) || String(i)}
                          ref={(el) => {
                            itemRefs.current[i] = el;
                          }}
                          onMouseEnter={() => setHighlightIndex(i)}
                          onClick={() => handleSelect(getId(r))}
                          className={`w-full px-4 py-2.5 text-left text-sm transition ${
                            i === highlightIndex
                              ? 'bg-slate-100 font-semibold'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          {getId(r)}
                        </button>
                      ))
                    )}

                    {!loading && !errorMsg && data.length === 0 && (
                      <div className="border-t px-4 py-3 text-xs text-slate-400">
                        예시: {PLACEHOLDER_IDS.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
                    <span>{loading ? '—' : `${filtered.length} / ${data.length}명`}</span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-2 py-1 hover:bg-slate-50"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}
            </div>

            {open && (
              <button
                aria-label="close-overlay"
                className="fixed inset-0 z-0 cursor-default"
                onClick={() => setOpen(false)}
                type="button"
              />
            )}

            {/* ✅ 여기서는 안내 문구만 남김 (탭/평균은 차트 헤더로 이동) */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>
                {errorMsg ? (
                  <span className="text-rose-600">{errorMsg}</span>
                ) : loading ? (
                  '데이터를 불러오는 중입니다…'
                ) : data.length ? (
                  '항목을 선택하면 상세 성과가 표시됩니다.'
                ) : (
                  '데이터가 없어도 기본 레이아웃은 표시됩니다.'
                )}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-8">
              {/* ✅ 차트 헤더: 왼쪽 제목 / 오른쪽에 Tabs + 평균 배치 (Tabs만 살짝 중앙쪽) */}
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between sm:block">
                  <p className="text-sm font-medium text-slate-700">판매량 비교</p>
                  <span className="text-xs text-slate-500 sm:mt-1 sm:block">
                    {showResults ? '선택됨' : '미선택'}
                  </span>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
                  {/* ✅ 여기 mr 값으로 “중앙으로 당기는 정도” 조절 (4/6/8 등) */}
                  <div className="sm:mr-6">
                    <Tabs />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-2 text-center text-xs font-medium text-slate-700 sm:px-3 sm:py-1">
                    {tab === 'p1' ? '1차 평균' : '2차 평균'}: {fmt(avg)}
                  </span>
                </div>
              </div>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip />
                    <ReferenceLine y={avg} stroke="#8b5cf6" strokeDasharray="3 3" />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? '#3b82f6' : '#8b5cf6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {tab === 'p1' ? '1차 전체 평균' : '2차 전체 평균'}:{' '}
                <span className="font-medium text-slate-700">{fmt(avg)}</span>
                {showResults ? (
                  <>
                    {' '}
                    · 내 판매량:{' '}
                    <span className="font-medium text-slate-700">{fmt(insight!.my)}</span>
                  </>
                ) : (
                  <> · Influencer ID를 선택하면 내 값이 표시됩니다.</>
                )}
              </p>
            </div>

            <div className="space-y-4 md:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">내 티어</p>
                  {showResults ? (
                    <span
                      className={`rounded-full px-3 py-1 text-sm ring-1 ${tierClass(
                        insight!.tier,
                      )}`}
                    >
                      {insight!.tier}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
                      선택 대기
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-700">내 판매량</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {showResults ? (
                    fmt(insight!.my)
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  평균 {fmt(avg)} 대비{' '}
                  {showResults ? (insight!.my >= avg ? '높음' : '낮음') : '—'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-700">랭킹</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {showResults ? (
                    <>
                      #{fmtInt(insight!.rank)}{' '}
                      <span className="text-sm font-medium text-slate-500">
                        / {fmtInt(insight!.total)}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {tab === 'p1' ? '1차 판매량 기준' : '2차 판매량 기준'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          데이터는 환불/취소로 인해 변동될 수 있습니다. 또한 실시간 반영이 아니므로 일부
          지연이 발생할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
