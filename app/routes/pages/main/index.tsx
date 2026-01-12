import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
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

        <label htmlFor="influencer-select" className="mb-1 block text-sm font-medium">
          인플루언서 선택
        </label>
        <select
          id="influencer-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2"
        >
          <option value="">스크롤하여 선택하세요</option>
          {data.map((r) => (
            <option key={r.UTM} value={r.UTM}>
              {r.UTM}
            </option>
          ))}
        </select>

        {row && (
          <div className="mt-4">
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
                  <ReferenceLine y={avgConversion} strokeDasharray="3 3" />
                  <Bar dataKey="conversion" radius={[8, 8, 0, 0]} />
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
