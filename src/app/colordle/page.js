'use client';
import { useState, useEffect } from 'react';
const [ipKey, setIpKey] = useState(null);
const [isLoading, setIsLoading] = useState(true);

export default function ColordlePage() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  
  // 1. 매일 바뀌는 정답 생성 (시드 기반 난수)
  useEffect(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = today.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash % 16777215).toString(16).toUpperCase().padStart(6, '0');
    setSolution(color);
    const checkAccess = async () => {
    // 로컬 스토리지 1차 체크 (가장 빠름)
    const lastPlayed = localStorage.getItem('lastPlayed');
    if (lastPlayed === new Date().toDateString()) {
      setGameState('played_today');
      setIsLoading(false);
      return;
    }

    // IP 2차 체크 (서버 통신)
    const res = await fetch('/api/check-ip');
    const data = await res.json();
    
    if (!data.canPlay) {
      setGameState('played_today');
    } else {
      setIpKey(data.ipKey);
    }
    setIsLoading(false);
  };
  checkAccess();
  }, []);
  // 게임 제출 성공 시 호출
const onGameFinish = async () => {
  localStorage.setItem('lastPlayed', new Date().toDateString());
  await fetch('/api/check-ip', {
    method: 'POST',
    body: JSON.stringify({ ipKey }),
  });
};

  const handleSubmit = () => {
    if (currentGuess.length !== 6) return;
    if (guesses.length >= 6 || gameState !== 'playing') return;

    const result = checkGuess(currentGuess, solution);
    const newGuesses = [...guesses, { code: currentGuess, result }];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === solution) {
      setGameState('won');
    } else if (newGuesses.length >= 6) {
      setGameState('lost');
    }
  };

  const checkGuess = (guess, sol) => {
    const res = Array(6).fill('absent');
    const solArr = sol.split('');
    const guessArr = guess.split('');

    // Green 확인
    guessArr.forEach((char, i) => {
      if (char === solArr[i]) {
        res[i] = 'correct';
        solArr[i] = null;
      }
    });

    // Yellow 확인
    guessArr.forEach((char, i) => {
      if (res[i] === 'absent' && solArr.includes(char)) {
        res[i] = 'present';
        solArr[solArr.indexOf(char)] = null;
      }
    });
    return res;
  };

  

  return (
    <div className="max-w-md mx-auto flex flex-col items-center gap-8 py-10">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2 tracking-tighter text-gray-800">COLORDLE</h2>
        <p className="text-gray-500 text-sm font-medium text-balance">오늘의 HEX 코드를 6번의 기회 안에 맞혀보세요.</p>
      </div>

      {/* 정답 색상 미리보기 (게임 종료 시 혹은 힌트용) */}
      <div 
        className="w-32 h-32 rounded-3xl shadow-2xl border-8 border-white transition-all duration-500"
        style={{ backgroundColor: `#${solution}` }}
      />

      {/* 게임 그리드 */}
      <div className="grid gap-3">
        {[...Array(6)].map((_, i) => {
          const isCurrentRow = i === guesses.length;
          const isPastRow = i < guesses.length;
          const guess = isPastRow ? guesses[i] : isCurrentRow ? { code: currentGuess.padEnd(6, ' ') } : { code: '      ' };

          return (
            <div key={i} className="flex gap-2 items-center">
              {guess.code.split('').map((char, j) => (
                <div 
                  key={j} 
                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-mono text-xl font-bold border-2 transition-all
                    ${isPastRow ? (
                      guesses[i].result[j] === 'correct' ? 'bg-green-500 border-green-500 text-white' :
                      guesses[i].result[j] === 'present' ? 'bg-yellow-500 border-yellow-500 text-white' :
                      'bg-gray-400 border-gray-400 text-white'
                    ) : 'border-gray-200 text-gray-800'}`}
                >
                  {char}
                </div>
              ))}
              {/* 입력한 행의 색상 피드백 */}
              <div 
                className={`w-8 h-8 rounded-full border shadow-sm ${isPastRow ? '' : 'bg-gray-50 opacity-30'}`}
                style={{ backgroundColor: isPastRow ? `#${guesses[i].code}` : 'transparent' }}
              />
            </div>
          );
        })}
      </div>

      {/* 입력 컨트롤 */}
      {gameState === 'playing' ? (
        <div className="w-full space-y-4">
          <input 
            type="text" 
            maxLength={6}
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="HEX 코드 입력 (예: FF5733)"
            className="w-full p-4 rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none text-center font-mono text-xl tracking-widest"
          />
          <button 
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white p-4 rounded-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-100"
          >
            제출하기 (Enter)
          </button>
        </div>
      ) : (
        <div className={`p-6 rounded-2xl w-full text-center ${gameState === 'won' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-bold text-lg mb-1">{gameState === 'won' ? '🎉 정답입니다!' : '😭 아쉽네요!'}</p>
          <p className="text-sm">정답은 <span className="font-mono font-bold">#{solution}</span> 이었습니다.</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-xs underline opacity-60">내일 다시 도전하세요</button>
        </div>
      )}
    </div>
  );
}