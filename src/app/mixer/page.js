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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">색상 섞기</h1>
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
    </div>
  );
}