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
  UTM?: string;
  conversion?: number | string;
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

function badgeLabel(p: number) {
  if (p >= 90) return '상위 10%';
  if (p >= 75) return '상위 25%';
  if (p >= 50) return '상위 50%';
  return '하위 50%';
}

function badgeClass(p: number) {
  if (p >= 90) return 'bg-emerald-100 text-emerald-700';
  if (p >= 75) return 'bg-emerald-50 text-emerald-700';
  if (p >= 50) return 'bg-amber-50 text-amber-700';
  return 'bg-rose-50 text-rose-700';
}

const PLACEHOLDER_UTMS = ['UTM_001', 'UTM_002', 'UTM_003', 'UTM_004', 'UTM_005'];

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

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrorMsg('');

    fetch(API_URL)
      .then((res) => res.json())
      .then((json: Row[]) => {
        if (!mounted) return;
        setData(json.map((r) => ({ ...r, conversion: toNum(r.conversion) })));
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
    const found = data.find((r) => String(r.UTM) === String(selectedId));
    setRow(found || null);
  }, [selectedId, data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) =>
      String(r.UTM || '')
        .toLowerCase()
        .includes(q),
    );
  }, [data, search]);

  const avg = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((s, r) => s + toNum(r.conversion), 0) / data.length;
  }, [data]);

  const insight = useMemo(() => {
    if (!row) return null;
    const sorted = [...data].sort((a, b) => toNum(b.conversion) - toNum(a.conversion));
    const rank = sorted.findIndex((r) => String(r.UTM) === String(selectedId)) + 1;
    const p = ((sorted.length - rank) / (sorted.length - 1 || 1)) * 100;

    return {
      my: toNum(row.conversion),
      rank,
      total: sorted.length,
      percentile: p,
    };
  }, [row, data, selectedId]);

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
      handleSelect(String(filtered[highlightIndex].UTM));
    }

    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    const el = itemRefs.current[highlightIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex]);

  const handleSelect = (utm: string) => {
    setSelectedId(utm);
    setSearch(utm);
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
                          key={String(r.UTM)}
                          ref={(el) => {
                            itemRefs.current[i] = el;
                          }}
                          onMouseEnter={() => setHighlightIndex(i)}
                          onClick={() => handleSelect(String(r.UTM))}
                          className={`w-full px-4 py-2.5 text-left text-sm transition ${
                            i === highlightIndex
                              ? 'bg-slate-100 font-semibold'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          {r.UTM}
                        </button>
                      ))
                    )}

                    {!loading && !errorMsg && data.length === 0 && (
                      <div className="border-t px-4 py-3 text-xs text-slate-400">
                        예시: {PLACEHOLDER_UTMS.join(', ')}
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
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                평균: {fmt(avg)}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-8">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">판매량 비교</p>
                <span className="text-xs text-slate-500">
                  {showResults ? '선택됨' : '미선택'}
                </span>
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
                전체 평균: <span className="font-medium text-slate-700">{fmt(avg)}</span>
                {showResults ? (
                  <>
                    {' '}
                    · 내 판매량:{' '}
                    <span className="font-medium text-slate-700">{fmt(insight!.my)}</span>
                  </>
                ) : (
                  <> · UTM을 선택하면 내 값이 표시됩니다.</>
                )}
              </p>
            </div>

            <div className="space-y-4 md:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">성과 뱃지</p>
                  {showResults ? (
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${badgeClass(insight!.percentile)}`}
                    >
                      {badgeLabel(insight!.percentile)}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
                      선택 대기
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  전체 인플루언서 대비 퍼센타일 기준
                </p>
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
                <p className="mt-1 text-xs text-slate-500">판매량 기준으로 산정</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ 하단 문구 교체 */}
        <div className="mt-6 text-center text-xs text-slate-400">
          데이터는 스프레드시트에서 자동으로 불러오며, 환불/취소로 인해 변동될 수
          있습니다. 또한 실시간 반영이 아니므로 일부 지연이 발생할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
