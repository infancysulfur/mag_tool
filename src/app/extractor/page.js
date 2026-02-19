'use client';
import { useState, useRef } from 'react';
import ColorThief from 'colorthief';

export default function ExtractorPage() {
  const [imageSrc, setImageSrc] = useState(null);
  const [palette, setPalette] = useState([]);
  const imgRef = useRef(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setPalette([]); // 새 이미지 업로드 시 초기화
      };
      reader.readAsDataURL(file);
    }
  };

  // 색상 추출 로직
  const extractColors = () => {
    const colorThief = new ColorThief();
    const img = imgRef.current;

    if (img.complete) {
      // 상위 8개 색상 추출
      const colors = colorThief.getPalette(img, 8);
      const hexColors = colors.map(rgb => 
        '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
      );
      setPalette(hexColors);
    } else {
      img.onload = () => {
        const colors = colorThief.getPalette(img, 8);
        const hexColors = colors.map(rgb => 
          '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
        );
        setPalette(hexColors);
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">이미지 색상 추출 (Top 8)</h1>
      {/* 설명 문구 추가 */}
    <p className="text-gray-500 mb-8 leading-relaxed">
      업로드하신 이미지에서 가장 지배적인 <strong>상위 8가지 색상</strong>을 AI가 분석하여 추출합니다. <br />
      <strong>브랜드 로고</strong>나 <strong>레퍼런스 이미지</strong>에서 핵심 컬러 팔레트를 찾아 디자인 프로젝트에 활용해 보세요.
    </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 왼쪽: 이미지 업로드 영역 */}
        <section className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[300px] flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
            {imageSrc ? (
              <img 
                ref={imgRef} 
                src={imageSrc} 
                alt="Uploaded" 
                className="max-w-full max-h-[400px] rounded-lg shadow-md"
                onLoad={extractColors}
              />
            ) : (
              <div className="text-center">
                <p className="text-gray-400 mb-4">분석할 이미지를 업로드하세요</p>
                <label className="bg-blue-600 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                  파일 선택
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            )}
          </div>
          {imageSrc && (
            <button 
              onClick={() => setImageSrc(null)}
              className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              이미지 지우기
            </button>
          )}
        </section>

        {/* 오른쪽: 결과 팔레트 영역 */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-widest">Extracted Palette</h2>
          {palette.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {palette.map((hex, i) => (
                <div 
                  key={i} 
                  className="group cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(hex);
                    alert(`${hex} 코드가 복사되었습니다!`);
                  }}
                >
                  <div 
                    className="h-20 w-full rounded-t-xl shadow-inner border border-black/5"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="bg-white border border-t-0 rounded-b-xl p-3 flex justify-between items-center group-hover:bg-gray-50 transition">
                    <span className="font-mono font-bold text-sm">{hex}</span>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 uppercase">Copy</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed rounded-xl text-gray-300 italic">
              이미지를 업로드하면 색상이 표시됩니다.
            </div>
          )}
        </section>
        
      </div>
      <section class="max-w-4xl mx-auto my-12 p-8 bg-white shadow-lg rounded-xl border border-gray-100 text-left">
  <div class="flex items-center justify-start mb-6 w-full">
    <div class="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white mr-4 shrink-0">
      <span class="text-xl">📸</span>
    </div>
    <h2 class="text-2xl font-bold text-gray-800">
      이미지 기반 핵심 컬러 추출
      <span class="block md:inline text-sm font-medium text-gray-400 md:ml-2">Visual Palette Extractor</span>
    </h2>
  </div>

  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">기능 설명</h3>
    <p class="text-gray-600 leading-relaxed">
      업로드된 이미지의 픽셀 데이터를 정밀 분석하여 시각적으로 가장 지배적인 <strong>상위 8가지 핵심 컬러</strong>를 자동으로 추출합니다. 복잡한 이미지 속에서도 디자인의 영감이 되는 주요 색상을 직관적으로 파악할 수 있으며, 추출된 각 색상의 <strong>HEX 코드를 원클릭으로 복사</strong>하여 실무 프로젝트에 즉시 반영할 수 있는 워크플로우를 제공합니다.
    </p>
  </div>

  <div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
    <h3 class="text-indigo-800 font-bold mb-2 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"></path></svg>
      활용 인사이트
    </h3>
    <p class="text-indigo-900 text-sm leading-relaxed">
      본 기능은 <strong>레퍼런스 이미지로부터 브랜드 아이덴티티를 도출</strong>하거나, 특정 사진의 분위기와 일치하는 배색 가이드를 수립하는 데 최적화되어 있습니다. 인공지능 기반의 추출 알고리즘을 통해 <strong>주조색(Main Color)과 보조색(Sub Color)의 균형</strong>을 한눈에 확인할 수 있으며, 이는 디지털 콘텐츠 제작 시 시각적 일관성을 확보하는 강력한 기초 데이터가 됩니다.
    </p>
  </div>
</section>
    </div>
  );
}