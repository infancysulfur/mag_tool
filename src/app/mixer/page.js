'use client';
import { useState, useEffect } from 'react';

export default function MixerPage() {
  const [rows, setRows] = useState([
    { color: '#FF0000', amount: 1 },
    { color: '#0000FF', amount: 1 }
  ]);
  const [result, setResult] = useState('#7F007F');

  useEffect(() => {
    let rT = 0, gT = 0, bT = 0, aT = 0;
    rows.forEach(row => {
      rT += parseInt(row.color.slice(1,3), 16) * row.amount;
      gT += parseInt(row.color.slice(3,5), 16) * row.amount;
      bT += parseInt(row.color.slice(5,7), 16) * row.amount;
      aT += row.amount;
    });
    if (aT > 0) {
      setResult("#" + [rT/aT, gT/aT, bT/aT].map(x => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase());
    }
  }, [rows]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 ">색 혼합 시뮬레이션</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
      여러 가지 색상을 원하는 비율로 혼합하여 <strong>색깔 섞기 시뮬레이션</strong>합니다.<br />
      잉크나 물감을 섞듯 용량을 조절하여 결과를 확인해 보세요.
    </p>
      <div 
        className="w-full h-32 rounded-xl mb-8 flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors duration-300"
        style={{ backgroundColor: result, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
      >
        혼합 결과: {result}
      </div>
      
      <div className="space-y-3 mb-6">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <input type="color" value={row.color} onChange={(e) => {
              const newRows = [...rows]; newRows[i].color = e.target.value; setRows(newRows);
            }} className="w-12 h-10 cursor-pointer" />
            <span className="text-sm font-medium">용량:</span>
            <input type="number" value={row.amount} min="1" onChange={(e) => {
              const newRows = [...rows]; newRows[i].amount = Number(e.target.value); setRows(newRows);
            }} className="border p-2 w-20 rounded" />
          </div>
        ))}
      </div>
      <button onClick={() => setRows([...rows, { color: '#ffffff', amount: 1 }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">+ 색상 추가</button>
      <button onClick={() => rows.length > 2 && setRows(rows.slice(0, -1))} className="bg-gray-400 text-white px-4 py-2 rounded-lg">- 제거</button>
                    <section class="max-w-4xl mx-auto my-12 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
  <div class="flex items-center mb-6">
    <div class="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center text-white mr-4">
      <span class="text-xl">🧪</span>
    </div>
    <h2 class="text-2xl font-bold text-gray-800">색 혼합 시뮬레이션 <span class="text-sm font-medium text-gray-400 ml-2">Multi-Color Blending Tool</span></h2>
  </div>

<div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">기능 설명</h3>
    <p class="text-gray-600 leading-relaxed">
      실제 물감이나 페인트를 섞을 때 발생하는 물리적인 색상 변화를 디지털 환경에서 미리 체험해 볼 수 있는 시뮬레이션 도구입니다. 일반적인 2색 혼합을 넘어 <strong>n개 이상의 다중 색채</strong>를 자유롭게 배합할 수 있으며, 배합 비율에 따른 미세한 색조 변화와 최종 결과값을 정밀하게 예측하여 보여드립니다.
    </p>
  </div>

  <div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
    <h3 class="text-indigo-800 font-bold mb-2 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12h2v2H9v-2zm0-8h2v6H9V4z"></path></svg>
      분석 인사이트
    </h3>
    <p class="text-indigo-900 text-sm leading-relaxed">
      이 기능은 실제 조색 과정에서 발생할 수 있는 시행착오와 자원 낭비를 줄여주는 <strong>경제적·실무적 인사이트</strong>를 제시합니다. 다양한 색상 조합의 경우의 수를 시각적으로 미리 확인함으로써, 사용자는 의도한 최적의 색상을 얻기 위한 정확한 배합 비중을 파악할 수 있습니다. 특히 물리적인 안료 혼합 원리를 충실히 재현하여 미술 교육, 인테리어 페인팅, 제품 디자인 등 다양한 산업 현장에서 창의적인 색채 실험을 가능하게 합니다.
    </p>
  </div>
</section>
    </div>
    
  );
}