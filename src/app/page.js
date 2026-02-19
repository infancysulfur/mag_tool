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
      <h1 className="text-2xl font-bold mb-8 ">한국 전통색 팔레트</h1>
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
<div className="grid grid-cols-1 gap-6"> {/* 큰 박스들을 세로로 쌓거나 너비를 충분히 확보 */}
  
  {/* RGB Channels 가로 배열 */}
  <div className="space-y-3 bg-white p-5 rounded-xl border">
    <h3 className="text-sm font-bold text-red-500 border-b pb-2 mb-4">RGB Channels</h3>
    <div className="flex flex-row gap-6"> {/* flex-row로 가로 정렬 */}
      {['r', 'g', 'b'].map(key => (
        <div key={key} className="flex flex-col items-start gap-1 flex-1">
          <span className="uppercase text-[10px] font-bold text-gray-400 ml-1">{key}</span>
          <input 
            type="number" 
            value={color[key]} 
            onChange={(e) => handleRgbChange(key, e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm text-center font-mono focus:ring-2 focus:ring-red-200 outline-none transition-all" 
          />
        </div>
      ))}
    </div>
  </div>

  {/* CMYK (%) 가로 배열 */}
  <div className="space-y-3 bg-white p-5 rounded-xl border">
    <h3 className="text-sm font-bold text-cyan-600 border-b pb-2 mb-4">CMYK (%)</h3>
    <div className="flex flex-row gap-4"> {/* flex-row로 가로 정렬 */}
      {['C', 'M', 'Y', 'K'].map((label, i) => (
        <div key={label} className="flex flex-col items-start gap-1 flex-1">
          <span className="text-[10px] font-bold text-gray-400 ml-1">{label}</span>
          <input 
            type="text" 
            value={cmyk[i]} 
            readOnly
            className="w-full border bg-gray-50 rounded-lg px-3 py-2 text-sm text-center font-mono text-gray-500" 
          />
        </div>
      ))}
    </div>
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
              <section class="max-w-4xl mx-auto my-12 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
  <div class="flex items-center mb-6">
    <div class="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white mr-4">
      <span class="text-xl">🎨</span>
    </div>
    <h2 class="text-2xl font-bold text-gray-800">한국 전통색 팔레트 <span class="text-sm font-medium text-gray-400 ml-2">K-Traditional Palette</span></h2>
  </div>

  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">기능 설명</h3>
    <p class="text-gray-600 leading-relaxed">
      선택하신 색상을 바탕으로 디지털 환경에 필수적인 <strong>HEX, RGB</strong> 값은 물론 인쇄 공정에 필요한 <strong>CMYK</strong> 데이터를 실시간으로 추출하여 제공합니다. <p></p>특히, 고유의 미학을 지닌 <strong>한국 전통 오방색 및 간색 체계</strong>를 데이터베이스와 대조하여 현재 선택한 색상이 우리 전통색과 얼마나 유사한지 수치화된 지표로 안내해 드립니다.
      <p></p>또한 <strong>RGB 값을 CMYK 값으로 변환</strong>할 수 있습니다.
    </p>
  </div>

  <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
    <h3 class="text-blue-800 font-bold mb-2 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"></path></svg>
      분석 인사이트
    </h3>
    <p class="text-blue-900 text-sm leading-relaxed">
      본 기능은 현대적인 디지털 디자인 작업에 한국적 정체성을 조화롭게 녹여낼 수 있는 인사이트를 제공합니다.<p></p> 단순한 색상 추출을 넘어, 현대적 감각으로 재해석된 전통색과의 유사도 분석을 통해 <strong>K-브랜딩(K-Branding) 및 문화 콘텐츠 제작</strong>에 있어 독보적인 시각적 서사를 구축할 수 있습니다. <p></p>또한, 매체별(Web/Print) 정확한 수치를 제공함으로써 실무 작업의 효율성을 극대화하고 표준화된 한국 색채 사용을 장려합니다.
    </p>
  </div>
</section>
    </div>
  );
}