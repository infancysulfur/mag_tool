import { NextResponse } from 'next/server';

// 주의: 상용 서비스에서는 Redis 같은 DB에 저장하는 것이 좋습니다.
const participatedIps = new Set(); 

export async function GET(request) {
  // 1. 클라이언트 IP 가져오기
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  
  // 2. 오늘 날짜 생성
  const today = new Date().toDateString();
  const key = `${today}-${ip}`;

  // 3. 중복 체크
  if (participatedIps.has(key)) {
    return NextResponse.json({ canPlay: false });
  }

  return NextResponse.json({ canPlay: true, ipKey: key });
}

export async function POST(request) {
  const { ipKey } = await request.json();
  participatedIps.add(ipKey);
  return NextResponse.json({ success: true });
}