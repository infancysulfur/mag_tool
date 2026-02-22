'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false); // 모바일 전용 상태
  const pathname = usePathname();

  const menus = [
    { name: '팔레트', path: '/', icon: '🎨' },
    { name: '이미지 추출', path: '/extractor', icon: '📸' },
    { name: '색상 섞기', path: '/mixer', icon: '🧪' },
    { name: 'Colordle', path: '/colordle', icon: '🎯' },
  ];

  return (
    <>
      {/* --- [모바일] 상단 헤더 --- */}
      <header className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b z-50 flex items-center px-4 justify-between">
        <h1 className="font-bold text-gray-800">K-Color Lab</h1>
        <button onClick={() => setIsOpen(true)} className="text-2xl p-2">☰</button>
      </header>

      {/* --- [모바일] 사이드바 서랍 (배경 & 메뉴) --- */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[60]" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`
        md:hidden fixed right-0 top-0 h-full w-64 bg-white z-[70] transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 flex flex-col gap-6">
          <button onClick={() => setIsOpen(false)} className="self-end text-xl">✕</button>
          <nav className="flex flex-col gap-2">
            {menus.map((menu) => (
              <Link 
                key={menu.path} 
                href={menu.path} 
                onClick={() => setIsOpen(false)}
                className={`p-4 rounded-xl flex items-center gap-3 ${pathname === menu.path ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600'}`}
              >
                <span>{menu.icon}</span> {menu.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* --- [PC] 고정 사이드바 (처음 느낌 그대로) --- */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r flex-col p-8 z-40">
        <div className="p-6 text-2xl font-black text-blue-600 border-b">Tool LAB</div>
        <nav className="flex-1 mt-4">
          {menus.map((menu) => (
            <Link 
              key={menu.path} 
              href={menu.path}
              className={`flex items-center px-6 py-4 transition-colors ${
                pathname === menu.path 
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-bold' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{menu.icon}</span>
              <span className="font-medium">{menu.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
     
    </>
  );
}