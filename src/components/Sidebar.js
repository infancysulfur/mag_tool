'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const menus = [
    { name: '🎨 색상 팔레트', path: '/' },
    { name: '🧪 색상 섞기', path: '/mixer' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 text-2xl font-black text-blue-600 border-b">COLOR LAB</div>
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
            {menu.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}