import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const menus = [
    { name: '팔레트', path: '/', icon: '🎨' },
    { name: '이미지 추출', path: '/extractor', icon: '📸' },
    { name: '색상 섞기', path: '/mixer', icon: '🧪' },
  ];

  return (
    <>
      {/* 1. 상단 고정 헤더 (모바일 전용) */}
      <header className="md:hidden fixed top-0 left-0 w-full h-14 bg-white/80 backdrop-blur-md border-b z-50 flex items-center px-4 justify-between">
        <h1 className="font-bold text-gray-800 tracking-tight">K-Traditional Color</h1>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">👤</div>
      </header>

      {/* 2. PC용 사이드바 (데스크탑 전용) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r flex-col p-6 z-40">
        <h1 className="text-xl font-bold mb-10">K-Traditional Color</h1>
        <nav className="space-y-2">
          {menus.map((menu) => (
            <Link 
              key={menu.path} 
              href={menu.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                pathname === menu.path ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>{menu.icon}</span> {menu.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 3. 하단 탭 바 (모바일 전용) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t z-50 flex items-center justify-around pb-safe">
        {menus.map((menu) => (
          <Link 
            key={menu.path} 
            href={menu.path}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
              pathname === menu.path ? 'text-purple-700' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{menu.icon}</span>
            <span className="text-[10px] font-medium">{menu.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}