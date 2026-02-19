"use client";
import { useState, useEffect } from "react";
import colorDb from "../data/colorDb.json"; // 경로 수정 반영

export default function PalettePage() {
  const [color, setColor] = useState({ r: 255, g: 0, b: 0, hex: "#FF0000" });
  const [cmyk, setCmyk] = useState([0, 100, 100, 0]);
  const [analysis, setAnalysis] = useState([]);
  const [hexInput, setHexInput] = useState(color.hex); // 입력 중인 텍스트를 위한 별도 상태
  // 어떤 모드에서 입력 중인지 기록 (picker, hex, rgb, cmyk)
const [inputSource, setInputSource] = useState(null);



  // CMYK 입력 처리 함수
const handleCmykChange = (index, value) => {
  setInputSource('cmyk'); // "지금은 CMYK 입력 중이야"라고 명시
  const val = Math.max(0, Math.min(100, Number(value) || 0));
  
  const nextCmyk = [...cmyk];
  nextCmyk[index] = val;
  setCmyk(nextCmyk); // 1. CMYK 상태 업데이트

  // 2. CMYK -> RGB/HEX 계산
  const c = nextCmyk[0] / 100;
  const m = nextCmyk[1] / 100;
  const y = nextCmyk[2] / 100;
  const k = nextCmyk[3] / 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();

  setColor({ r, g, b, hex }); // 3. 컬러 상태 업데이트
};

  // 1. 색상 변경 시 CMYK 및 유사도 자동 계산
  useEffect(() => {
  const { r, g, b } = color;

  // --- 1. CMYK 역산 로직 (입력 중이 아닐 때만 실행) ---
  if (inputSource !== 'cmyk') {
    const r_ = r / 255;
    const g_ = g / 255;
    const b_ = b / 255;

    let k = Math.min(1 - r_, 1 - g_, 1 - b_);
    let c = k === 1 ? 0 : (1 - r_ - k) / (1 - k);
    let m = k === 1 ? 0 : (1 - g_ - k) / (1 - k);
    let y = k === 1 ? 0 : (1 - b_ - k) / (1 - k);

    setCmyk([
      Math.round(c * 100),
      Math.round(m * 100),
      Math.round(y * 100),
      Math.round(k * 100)
    ]);
  }

  // --- 2. 한글 색상 이름 유사도 분석 (항상 실행) ---
  // 현재 color(RGB)를 기준으로 다시 CMYK를 계산하여 DB와 대조합니다.
  const r_ = r / 255;
  const g_ = g / 255;
  const b_ = b / 255;
  let k_ = Math.min(1 - r_, 1 - g_, 1 - b_);
  let c_ = k_ === 1 ? 0 : (1 - r_ - k_) / (1 - k_);
  let m_ = k_ === 1 ? 0 : (1 - g_ - k_) / (1 - k_);
  let y_ = k_ === 1 ? 0 : (1 - b_ - k_) / (1 - k_);
  
  const currentCmyk = [c_ * 100, m_ * 100, y_ * 100, k_ * 100];

  const results = colorDb.map(item => {
  const dist = Math.sqrt(
    item.cmyk.reduce((acc, val, i) => acc + Math.pow(val - currentCmyk[i], 2), 0)
  );
  
  // 1. 기본 유사도 계산
  let similarity = Math.max(0, 100 - (dist / 1.5));
  
  // 2. 보정 로직: 유사도가 99% 이상이면 아주 미세한 차이이므로 100%로 표시
  if (similarity > 99.0) similarity = 100;
  
  return { 
    ...item, 
    similarity: similarity === 100 ? "100" : similarity.toFixed(1) 
  };
})
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, 5);

  setAnalysis(results); // 분석 결과 상태 업데이트

}, [color, colorDb]); // color가 바뀔 때마다 실행

  // RGB 개별 입력 핸들러
const handleRgbChange = (key, value) => {
  setInputSource('rgb'); // 👈 반드시 추가 (CMYK 락 해제)
  const val = Math.max(0, Math.min(255, Number(value) || 0));
  const newColor = { ...color, [key]: val };
  newColor.hex = '#' + [newColor.r, newColor.g, newColor.b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  setColor(newColor);
};

  // 간단한 밝기 계산 함수 (src/app/page.js 안에 추가)
  const getContrastColor = (r, g, b) => {
    // YIQ 공식을 이용한 밝기 계산
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  // Hex 입력 처리 함수
const handleHexChange = (value) => {
  setInputSource('hex'); // 👈 반드시 추가 (CMYK 락 해제)
  setHexInput(value);
  
  if (/^#[0-9A-F]{6}$/i.test(value)) {
    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);
    setColor({ r, g, b, hex: value.toUpperCase() });
  }
};

  // 외부(피커, RGB 수정)에서 color.hex가 바뀔 때 입력창도 동기화
  useEffect(() => {
    setHexInput(color.hex);
  }, [color.hex]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 ">한국 전통색 팔레트</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        선택하신 색상과 가장 유사한 <strong>표준 한글 색상 이름</strong>을
        찾아드립니다.
        <br />
        RGB와 CMYK 수치를 실시간으로 확인하고, 비즈니스에 적합한 컬러 명칭을
        정의해 보세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 왼쪽: 컨트롤 패널 */}
        <section className="space-y-8">
          {/* 메인 컬러 선택 및 HEX */}
          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="relative group">
              <div
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: color.hex }}
                onClick={() =>
                  document.getElementById("mainPicker").showPicker()
                }
              />
              <input 
  id="mainPicker" 
  type="color" 
  value={color.hex} 
  onChange={(e) => {
    setInputSource('picker'); // 👈 반드시 추가 (CMYK 락 해제)
    const hex = e.target.value.toUpperCase();
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    setColor({ r, g, b, hex });
  }} 
  className="absolute opacity-0 w-0 h-0" 
/>
            </div>

            {/* // ... UI 부분 ... */}
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Hex Code
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#FFFFFF"
                className="w-full text-2xl font-mono font-bold bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none p-0 transition-colors"
              />
            </div>
          </div>

          {/* RGB / CMYK 입력창 그룹 */}
          <div className="grid grid-cols-1 gap-6">
            {" "}
            {/* 큰 박스들을 세로로 쌓거나 너비를 충분히 확보 */}
            {/* RGB Channels 가로 배열 */}
            <div className="space-y-3 bg-white p-5 rounded-xl border">
              <h3 className="text-sm font-bold text-red-500 border-b pb-2 mb-4">
                RGB Channels
              </h3>
              <div className="flex flex-row gap-6">
                {" "}
                {/* flex-row로 가로 정렬 */}
                {["r", "g", "b"].map((key) => (
                  <div
                    key={key}
                    className="flex flex-col items-start gap-1 flex-1"
                  >
                    <span className="uppercase text-[10px] font-bold text-gray-400 ml-1">
                      {key}
                    </span>
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
              <h3 className="text-sm font-bold text-cyan-600 border-b pb-2">CMYK (%)</h3>
              <div className="flex flex-row gap-4">
                {" "}
                {/* flex-row로 가로 정렬 */}
                {["C", "M", "Y", "K"].map((label, i) => (
    <div key={label} className="flex items-center justify-between">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <input 
        type="number" 
        value={cmyk[i]} 
        min="0"
        max="100"
        onChange={(e) => handleCmykChange(i, e.target.value)}
        className="w-16 border border-gray-200 rounded px-2 py-1 text-sm text-right font-mono focus:border-cyan-500 focus:outline-none" 
      />
    </div>
  ))}
              </div>
            </div>
          </div>

          {/* 팔레트 그리드 */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Quick Palette
            </h3>
            <div className="grid grid-cols-12 gap-1">
  {Array.from({ length: 48 }).map((_, i) => {
    const h = i * 7.5;
    const hsl = `hsl(${h}, 70%, 50%)`;
    return (
      <div key={i} className="aspect-square rounded-sm cursor-pointer hover:scale-125 transition-all"
        style={{ backgroundColor: hsl }}
        onClick={(e) => {
           // 1. 소스 초기화 (이걸 추가해야 CMYK가 다시 계산됩니다)
           setInputSource('palette'); 
           
           // 2. 색상 추출 및 업데이트
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
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="font-bold flex-1">
                    {idx + 1}. {item.name}
                  </span>
                  <span className="text-blue-500 font-semibold">
                    {item.similarity}%
                  </span>
                  <span 
  className="cursor-pointer hover:underline" 
  onClick={() => {
    navigator.clipboard.writeText(item.hex);
    alert(`${item.name}의 색상 코드 ${item.hex}가 복사되었습니다!`);
  }}
>
  {item.hex}
</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${idx === 0 ? "bg-blue-500" : "bg-gray-400"}`}
                    style={{ width: `${item.similarity}%` }}
                  />
                </div>
              </div>
            ))}
            
          </div>

          <div
            className="mt-6 p-4 rounded-lg border border-dashed text-center"
            style={{
              backgroundColor: color.hex,
              color: getContrastColor(color.r, color.g, color.b),
            }}
          >
            <p className="font-bold">가독성 테스트</p>
            <p className="text-sm">
              이 색상 위에는{" "}
              {getContrastColor(color.r, color.g, color.b) === "white"
                ? "밝은"
                : "어두운"}{" "}
              글씨가 잘 보입니다.
            </p>
          </div>
        </section>
      </div>
      <section class="max-w-4xl mx-auto my-12 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
        <div class="flex items-center mb-6">
          <div class="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white mr-4">
            <span class="text-xl">🎨</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">
            한국 전통색 팔레트{" "}
            <span class="text-sm font-medium text-gray-400 ml-2">
              K-Traditional Palette
            </span>
          </h2>
        </div>

        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">기능 설명</h3>
          <p class="text-gray-600 leading-relaxed">
            선택하신 색상을 바탕으로 디지털 환경에 필수적인{" "}
            <strong>HEX, RGB</strong> 값은 물론 인쇄 공정에 필요한{" "}
            <strong>CMYK</strong> 데이터를 실시간으로 추출하여 제공합니다.{" "}
            <p></p>특히, 고유의 미학을 지닌{" "}
            <strong>한국 전통 오방색 및 간색 체계</strong>를 데이터베이스와
            대조하여 현재 선택한 색상이 우리 전통색과 얼마나 유사한지 수치화된
            지표로 안내해 드립니다.
            <p></p>또한 <strong>RGB 값을 CMYK 값으로 변환</strong>할 수
            있습니다.
          </p>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 class="text-blue-800 font-bold mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"></path>
            </svg>
            분석 인사이트
          </h3>
          <p class="text-blue-900 text-sm leading-relaxed">
            본 기능은 현대적인 디지털 디자인 작업에 한국적 정체성을 조화롭게
            녹여낼 수 있는 인사이트를 제공합니다.<p></p> 단순한 색상 추출을
            넘어, 현대적 감각으로 재해석된 전통색과의 유사도 분석을 통해{" "}
            <strong>K-브랜딩(K-Branding) 및 문화 콘텐츠 제작</strong>에 있어
            독보적인 시각적 서사를 구축할 수 있습니다. <p></p>또한,
            매체별(Web/Print) 정확한 수치를 제공함으로써 실무 작업의 효율성을
            극대화하고 표준화된 한국 색채 사용을 장려합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
