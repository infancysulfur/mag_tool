import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Online Tool Lab - 한국 전통색 팔레트 & 색 혼합 시뮬레이터',
  description: '이미지에서 한국 전통색을 추출하고 CMYK, RGB 값을 분석하세요. 나만의 색상 섞기와 팔레트 기능을 제공합니다.',
  keywords: ['한국전통색', '색상추출', 'CMYK변환', '디자인툴', 'K-Color'],
  verification : {
    google: 'DYRoSjxA8kUL_nB-IHi6dGDSuyFbqcNBWsWHfAVSmdU'
  },
  openGraph: {
    title: 'K-Color Lab',
    description: '전통의 색을 현대적 감각으로 분석하는 가장 스마트한 방법',
    images: ['/og-image.png'], // 카톡/트위터 공유 시 나오는 이미지
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}