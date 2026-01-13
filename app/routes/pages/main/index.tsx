'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  'https://opensheet.elk.sh/1OO5eZQEIaYzP9MRzjIGUDClQ46u4V_HD8WWg3ysmeBY/sheet1';

export default function App() {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [row, setRow] = useState(null);
  const [avgConversion, setAvgConversion] = useState(0);

  // 🔎 검색어
  const [search, setSearch] = useState('');
  // ✅ 커스텀 드롭다운 열림/닫힘
  const [open, setOpen] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        const parsed = json.map((r) => ({
          ...r,
          conversion: Number(r.conversion),
        }));

        setData(parsed);

        const avg =
          parsed.reduce((sum, r) => sum + (r.conversion || 0), 0) / parsed.length;
        setAvgConversion(Number(avg.toFixed(2)));
      });
  }, []);

  useEffect(() => {
    const found = data.find((r) => r.UTM === selectedId);
    setRow(found || null);
  }, [selectedId, data]);

  // 검색 필터링 (UTM 기준)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) =>
      String(r.UTM || '')
        .toLowerCase()
        .includes(q),
    );
  }, [data, search]);

  // 선택 시, 검색어도 선택값으로 맞추고 드롭다운 닫기
  const handleSelect = (utm) => {
    setSelectedId(utm);
    setSearch(utm);
    setOpen(false);

    if (listRef.current) listRef.current.scrollTop = 0;
  };

  // 토글(화살표) 클릭 시: 열고/닫기
  const toggleOpen = () => {
    setOpen((prev) => !prev);
    // UX: 열 때 스크롤 맨 위로
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = 0;
    }, 0);
  };

  const chartData = row
    ? [
        { name: '내 판매량', conversion: row.conversion },
        { name: '전체 평균', conversion: avgConversion },
      ]
    : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-xl font-semibold">내 판매 성과 확인</h1>
        <p className="mb-4 text-sm text-gray-500">
          본인의 성과를 전체 인플루언서 평균과 비교해보세요
        </p>

        <label htmlFor="utm-search" className="mb-1 block text-sm font-medium">
          인플루언서 검색 (UTM)
        </label>

        <input
          id="utm-search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="ID를 검색하세요"
          className="w-full rounded-lg border px-3 py-2 pr-10"
        />

        {/* ✅ 검색 + 토글(화살표) + 스크롤 가능한 커스텀 드롭다운 */}
        <div className="relative">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true); // ✅ 타이핑하면 열리고 검색됨
              }}
              onFocus={() => setOpen(true)}
              placeholder="ID를 검색하세요"
              className="w-full rounded-lg border px-3 py-2 pr-10"
            />

            {/* ✅ 아래 화살표 토글 버튼 */}
            <button
              type="button"
              onClick={toggleOpen}
              aria-label="toggle-utm-list"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${open ? 'rotate-180' : ''}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {open && (
            <div className="absolute z-10 mt-2 w-full rounded-lg border bg-white shadow-lg">
              <div ref={listRef} className="max-h-56 overflow-y-auto py-1" role="listbox">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    검색 결과가 없습니다
                  </div>
                ) : (
                  filtered.map((r) => (
                    <button
                      key={r.UTM}
                      type="button"
                      onClick={() => handleSelect(r.UTM)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        selectedId === r.UTM ? 'bg-gray-100 font-semibold' : ''
                      }`}
                    >
                      {r.UTM}
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-gray-500">
                <span>
                  {filtered.length} / {data.length}명 표시
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded px-2 py-1 hover:bg-gray-100"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 바깥 클릭하면 닫히게 */}
        {open && (
          <button
            aria-label="close-overlay"
            className="fixed inset-0 z-0 cursor-default"
            onClick={() => setOpen(false)}
            type="button"
          />
        )}

        {row && (
          <div className="mt-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">내 판매량</p>
              <p className="text-2xl font-bold">{row.conversion}</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <ReferenceLine
                    y={avgConversion}
                    stroke="#8b5cf6"
                    strokeDasharray="3 3"
                  />
                  <Bar dataKey="conversion" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 1 ? '#8b5cf6' : '#3b82f6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              전체 인플루언서 평균 판매량: {avgConversion}
            </p>
          </div>
        )}

        {!row && selectedId && (
          <p className="mt-4 text-sm text-red-500">해당 인플루언서를 찾을 수 없습니다</p>
        )}
      </div>
    </div>
  );
}
