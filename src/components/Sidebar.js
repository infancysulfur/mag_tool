'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false); // 모바일 서랍 상태
  const [isExpanded, setIsExpanded] = useState(true); // PC 사이드바 확장 상태
  const pathname = usePathname();

  const menus = [
    { name: '한국 전통색 팔레트', path: '/', icon: '🎨' },
    { name: '이미지 추출', path: '/extractor', icon: '📸' },
    { name: '색 혼합 시뮬레이션', path: '/mixer', icon: '🧪' },
  ];

  return (
    <>
      {/* --- [모바일] 상단 헤더 & 햄버거 버튼 --- */}
      <header className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b z-50 flex items-center px-4 justify-between">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl p-2">
          {isOpen ? '✕' : '☰'}
        </button>
        <h1 className="font-bold text-gray-800">K-Color Lab</h1>
        <div className="w-8"></div> {/* 밸런스용 빈 공간 */}
      </header>

      {/* --- [모바일] 오버레이 메뉴 (서랍장) --- */}
      <div className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />
      <aside className={`md:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-6 space-y-4 pt-20">
          {menus.map((menu) => (
            <Link key={menu.path} href={menu.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 p-4 rounded-xl ${pathname === menu.path ? 'bg-purple-50 text-purple-700' : ''}`}>
              <span>{menu.icon}</span> {menu.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- [PC] 확장/축소형 사이드바 --- */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-full bg-white border-r flex-col transition-all duration-300 z-40 ${isExpanded ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex flex-col h-full">
          {/* 확장/축소 버튼 */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-10 self-end p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? '◀' : '▶'}
          </button>

          <nav className="space-y-2">
            {menus.map((menu) => (
              <Link 
                key={menu.path} 
                href={menu.path}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all whitespace-nowrap overflow-hidden ${
                  pathname === menu.path ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl min-w-[32px] text-center">{menu.icon}</span>
                <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {menu.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}