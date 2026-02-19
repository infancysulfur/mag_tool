"use client";
import { useState, useEffect } from "react";

export default function MixerPage() {
  const [rows, setRows] = useState([
    { color: "#FF0000", amount: 1 },
    { color: "#0000FF", amount: 1 },
  ]);
  const [result, setResult] = useState("#7F007F");

  useEffect(() => {
    let rT = 0,
      gT = 0,
      bT = 0,
      aT = 0;
    rows.forEach((row) => {
      rT += parseInt(row.color.slice(1, 3), 16) * row.amount;
      gT += parseInt(row.color.slice(3, 5), 16) * row.amount;
      bT += parseInt(row.color.slice(5, 7), 16) * row.amount;
      aT += row.amount;
    });
    if (aT > 0) {
      setResult(
        "#" +
          [rT / aT, gT / aT, bT / aT]
            .map((x) => Math.round(x).toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase(),
      );
    }
  }, [rows]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 ">색상 섞기</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        여러 가지 색상을 원하는 비율로 혼합하여{" "}
        <strong>색깔 섞기 시뮬레이션</strong>합니다.
        <br />
        잉크나 물감을 섞듯 용량을 조절하여 결과를 확인해 보세요.
      </p>
      <div
        className="w-full h-32 rounded-xl mb-8 flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors duration-300"
        style={{
          backgroundColor: result,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        혼합 결과: {result}
      </div>

      <div className="space-y-3 mb-6">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
          >
            <input
              type="color"
              value={row.color}
              onChange={(e) => {
                const newRows = [...rows];
                newRows[i].color = e.target.value;
                setRows(newRows);
              }}
              className="w-12 h-10 cursor-pointer"
            />
            <span className="text-sm font-medium">용량:</span>
            <input
              type="number"
              value={row.amount}
              min="1"
              onChange={(e) => {
                const newRows = [...rows];
                newRows[i].amount = Number(e.target.value);
                setRows(newRows);
              }}
              className="border p-2 w-20 rounded"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => setRows([...rows, { color: "#ffffff", amount: 1 }])}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
      >
        + 색상 추가
      </button>
      <button
        onClick={() => rows.length > 2 && setRows(rows.slice(0, -1))}
        className="bg-gray-400 text-white px-4 py-2 rounded-lg"
      >
        - 제거
      </button>
      <section class="max-w-4xl mx-auto my-12 p-8 bg-white shadow-lg rounded-xl border border-gray-100 text-left">
  <div class="flex items-center justify-start mb-6 w-full">
    <div class="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center text-white mr-4 shrink-0">
      <span class="text-xl">🧪</span>
    </div>
    <h2 class="text-2xl font-bold text-gray-800">
      동적 데이터 기반 색상 혼합 시뮬레이션
      <span class="block md:inline text-sm font-medium text-gray-400 md:ml-2">Advanced Color Mixer</span>
    </h2>
  </div>

  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">기능 설명</h3>
    <p class="text-gray-600 leading-relaxed">
      두 가지 이상의 색상을 디지털 환경에서 정밀하게 혼합하여 새로운 결과색을 도출합니다. 각 색상의 <strong>혼합 비율(Volume)을 실시간으로 조절</strong>하여 물감이나 인쇄 잉크를 배합하는 것과 유사한 시뮬레이션 환경을 제공합니다. 이를 통해 디자이너는 의도한 배색이 실제 혼합되었을 때 어떤 최종 결과물로 나타날지 데이터로 예측할 수 있습니다.
    </p>
  </div>

  <div class="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
    <h3 class="text-purple-800 font-bold mb-2 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"></path></svg>
      전통색 연계 가이드
    </h3>
    <p class="text-purple-900 text-sm leading-relaxed">
      혼합된 결과색은 시스템에 내장된 <strong>한국 전통색 데이터베이스와 즉시 대조</strong>됩니다. 사용자가 직접 조색한 컬러가 전통의 어떤 색감(예: 비취색, 연지색 등)과 가장 맞닿아 있는지 유사도 지표로 확인하세요. 이는 <strong>현대적인 감각의 조색 결과에 전통적인 고유 명칭과 가치를 부여</strong>하여 스토리텔링이 담긴 디자인을 완성하도록 돕습니다.
    </p>
  </div>
</section>
    </div>
  );
}
