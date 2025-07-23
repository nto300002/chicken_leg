'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';

interface TrainingItem {
  id: number;
  title: string;
  note: string;
  url: string;
}

type Speed = 'slow' | 'fast';
type Difficulty = 'easy' | 'hard';

export default function TrainingPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [trainingData, setTrainingData] = useState<TrainingItem | null>(null);
  const [speed, setSpeed] = useState<Speed>('slow');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [countdown, setCountdown] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [sessionTime, setSessionTime] = useState(0);
  const [showCalorie, setShowCalorie] = useState(false);
  const [weight, setWeight] = useState<string>('');

  const speedSettings = {
    slow: 30,
    fast: 10
  };

  const difficultySettings = {
    easy: { reps: 5, sets: 3 },
    hard: { reps: 20, sets: 3 }
  };

  useEffect(() => {
    const loadTrainingData = async () => {
      try {
        const { legTrainingData } = await import('../../../api/leg-training');
        const item = legTrainingData.find(item => item.id === parseInt(id));
        setTrainingData(item || null);
      } catch (error) {
        console.error('Failed to load training data:', error);
      }
    };

    loadTrainingData();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown => countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isActive) {
      setIsActive(false);
      setCurrentRep(prev => prev + 1);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, countdown]);

  useEffect(() => {
    let sessionInterval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      sessionInterval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (sessionInterval) clearInterval(sessionInterval);
    };
  }, [isActive]);

  useEffect(() => {
    localStorage.setItem('sessionTime', sessionTime.toString());
  }, [sessionTime]);

  const startCountdown = () => {
    setCountdown(speedSettings[speed]);
    setIsActive(true);
  };

  const resetTraining = () => {
    setIsActive(false);
    setCountdown(0);
    setCurrentRep(0);
    setCurrentSet(1);
    setSessionTime(0);
  };

  const nextSet = () => {
    if (currentSet < difficultySettings[difficulty].sets) {
      setCurrentSet(prev => prev + 1);
      setCurrentRep(0);
    }
  };

  const calculateCalories = () => {
    const weightNum = parseFloat(weight);
    if (weightNum && sessionTime > 0) {
      return Math.round(sessionTime * (weightNum / 3600) * 5 * 1.05);
    }
    return 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!trainingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  const maxReps = difficultySettings[difficulty].reps;
  const maxSets = difficultySettings[difficulty].sets;
  const isCompleted = currentSet > maxSets;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50 text-gray-800">
      <Header />
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8 pt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-800 mb-2">
            {trainingData.title}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {trainingData.note}
          </p>
          <a
            href={trainingData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm underline"
          >
            参考動画を見る
          </a>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">スピード設定</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="slow"
                    checked={speed === 'slow'}
                    onChange={(e) => setSpeed(e.target.value as Speed)}
                    className="mr-2"
                    disabled={isActive}
                  />
                  ゆっくり (30秒)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="fast"
                    checked={speed === 'fast'}
                    onChange={(e) => setSpeed(e.target.value as Speed)}
                    className="mr-2"
                    disabled={isActive}
                  />
                  素早く (10秒)
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">難易度設定</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="easy"
                    checked={difficulty === 'easy'}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="mr-2"
                    disabled={isActive}
                  />
                  ゆるい (5回×3セット)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="hard"
                    checked={difficulty === 'hard'}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="mr-2"
                    disabled={isActive}
                  />
                  きつい (20回×3セット)
                </label>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-orange-600 mb-2">
              {countdown}
            </div>
            <div className="text-gray-600 mb-4">
              セット {currentSet}/{maxSets} - 回数 {currentRep}/{maxReps}
            </div>
            <div className="text-gray-500 text-sm mb-4">
              セッション時間: {formatTime(sessionTime)}
            </div>
          </div>

          {!isCompleted ? (
            <div className="space-y-4">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startCountdown}
                  disabled={isActive || currentRep >= maxReps}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {currentRep >= maxReps ? 'セット完了' : 'スタート'}
                </button>
                
                {currentRep >= maxReps && currentSet < maxSets && (
                  <button
                    onClick={nextSet}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    次のセット
                  </button>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={resetTraining}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  リセット
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-4">
                🎉 トレーニング完了！
              </div>
              <div className="text-gray-600 mb-4">
                総時間: {formatTime(sessionTime)}
              </div>
              <button
                onClick={resetTraining}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                もう一度
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/training_menu"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
          >
            ← メニューに戻る
          </Link>
        </div>
      </div>
      </div>

      {/* Calorie Calculator - Bottom Right */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setShowCalorie(!showCalorie)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          🔥
        </button>
        
        {showCalorie && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-4 w-64">
            <h4 className="font-semibold text-gray-800 mb-3">カロリー計算</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">体重 (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {calculateCalories()} kcal
                </div>
                <div className="text-xs text-gray-500">
                  消費カロリー (推定)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}