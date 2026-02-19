'use client';
import { useState, useEffect } from 'react';
import colorDb from '../data/colorDb.json'; // 경로 수정 반영

export default function PalettePage() {
  const [color, setColor] = useState({ r: 255, g: 0, b: 0, hex: '#FF0000' });
  const [cmyk, setCmyk] = useState([0, 100, 100, 0]);
  const [analysis, setAnalysis] = useState([]);

  // 1. 색상 변경 시 CMYK 및 유사도 자동 계산
  useEffect(() => {
    const { r, g, b } = color;
    const r_ = r / 255;
    const g_ = g / 255;
    const b_ = b / 255;

    let k = Math.min(1 - r_, 1 - g_, 1 - b_);
    let c = k === 1 ? 0 : (1 - r_ - k) / (1 - k);
    let m = k === 1 ? 0 : (1 - g_ - k) / (1 - k);
    let y = k === 1 ? 0 : (1 - b_ - k) / (1 - k);

    const newCmyk = [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
    setCmyk(newCmyk);

    const results = colorDb.map(item => {
      const dist = Math.sqrt(item.cmyk.reduce((acc, val, i) => acc + Math.pow(val - newCmyk[i], 2), 0));
      return { ...item, similarity: Math.max(0, 100 - (dist / 2)).toFixed(1) };
    }).sort((a, b) => b.similarity - a.similarity).slice(0, 5);
    
    setAnalysis(results);
  }, [color]);

  // RGB 개별 입력 핸들러
  const handleRgbChange = (key, value) => {
    const val = Math.max(0, Math.min(255, Number(value) || 0));
    const newColor = { ...color, [key]: val };
    newColor.hex = '#' + [newColor.r, newColor.g, newColor.b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    setColor(newColor);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">색상 분석기</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 왼쪽: 컨트롤 패널 */}
        <section className="space-y-8">
          {/* 메인 컬러 선택 및 HEX */}
          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="relative group">
              <div 
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: color.hex }}
                onClick={() => document.getElementById('mainPicker').showPicker()}
              />
              <input id="mainPicker" type="color" value={color.hex} onChange={(e) => {
                const hex = e.target.value.toUpperCase();
                const r = parseInt(hex.slice(1,3), 16);
                const g = parseInt(hex.slice(3,5), 16);
                const b = parseInt(hex.slice(5,7), 16);
                setColor({ r, g, b, hex });
              }} className="absolute opacity-0 w-0 h-0" />
            </div>
            
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hex Code</label>
              <input type="text" value={color.hex} className="w-full text-2xl font-mono font-bold bg-transparent border-none focus:ring-0 p-0" readOnly />
            </div>
          </div>

          {/* RGB / CMYK 입력창 그룹 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3 bg-white p-4 rounded-xl border">
              <h3 className="text-sm font-bold text-red-500 border-b pb-2">RGB Channels</h3>
              {['r', 'g', 'b'].map(key => (
                <div key={key} className="flex items-center justify-between">
                  <span className="uppercase text-xs font-medium text-gray-500">{key}</span>
                  <input type="number" value={color[key]} onChange={(e) => handleRgbChange(key, e.target.value)}
                    className="w-16 border rounded px-2 py-1 text-sm text-right font-mono" />
                </div>
              ))}
            </div>

            <div className="space-y-3 bg-white p-4 rounded-xl border">
              <h3 className="text-sm font-bold text-cyan-600 border-b pb-2">CMYK (%)</h3>
              {['C', 'M', 'Y', 'K'].map((label, i) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">{label}</span>
                  <input type="text" value={cmyk[i]} readOnly
                    className="w-16 border bg-gray-50 rounded px-2 py-1 text-sm text-right font-mono" />
                </div>
              ))}
            </div>
          </div>

          {/* 팔레트 그리드 */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Quick Palette</h3>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 48 }).map((_, i) => {
                const h = i * 7.5;
                const hsl = `hsl(${h}, 70%, 50%)`;
                return (
                  <div key={i} className="aspect-square rounded-sm cursor-pointer hover:scale-125 transition-all"
                    style={{ backgroundColor: hsl }}
                    onClick={(e) => {
                       const rgb = e.target.style.backgroundColor.match(/\d+/g).map(Number);
                       const hex = '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
                       setColor({ r: rgb[0], g: rgb[1], b: rgb[2], hex });
                    }}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* 오른쪽: 분석 영역 */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
            🎨 한글 색상 이름 유사도 분석 (Top 5)
          </h2>
          <div className="space-y-4">
            {analysis.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: item.hex }} />
                  <span className="font-bold flex-1">{idx + 1}. {item.name}</span>
                  <span className="text-blue-500 font-semibold">{item.similarity}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${idx === 0 ? 'bg-blue-500' : 'bg-gray-400'}`}
                    style={{ width: `${item.similarity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}