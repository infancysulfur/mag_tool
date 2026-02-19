import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Business Color Lab',
  description: '한글 색상 분석 도구',
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