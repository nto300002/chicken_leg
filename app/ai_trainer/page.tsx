'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '../components/Header';

export default function AITrainer() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickInputs = [
    '初心者向けの脚トレーニングメニューを教えて',
    'スクワットの正しいフォームを説明して',
    '下半身を鍛える効果的な方法は？',
    '週3回のトレーニングプランを作って',
    'プロテインの摂取タイミングを教えて'
  ];

  const callGeminiAPI = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setResponse('申し訳ございませんが、現在AIトレーナーサービスが利用できません。後ほど再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await callGeminiAPI(`あなたは経験豊富なフィットネストレーナーです。下半身トレーニング、特にスクワットに関する専門知識を持っています。以下の質問に、親切で分かりやすく答えてください：\n\n${input}`);
  };

  const handleQuickInput = async (quickText: string) => {
    setInput(quickText);
    await callGeminiAPI(`あなたは経験豊富なフィットネストレーナーです。下半身トレーニング、特にスクワットに関する専門知識を持っています。以下の質問に、親切で分かりやすく答えてください：\n\n${quickText}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50 text-gray-800">
      <Header />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">
              AIトレーナー(調整中)
            </h1>
            <div className="mb-6">
              <Image
                src="/trainer.png"
                alt="AIトレーナー"
                width={150}
                height={150}
                className="mx-auto rounded-full"
                priority
              />
            </div>
            <p className="text-gray-600 text-lg">
              あなた専用のAIフィットネストレーナーです。<br />
              トレーニングに関する質問をお気軽にどうぞ！
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">質問を入力</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="トレーニングに関する質問を入力してください..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {isLoading ? '考え中...' : 'AIに質問する'}
                </button>
              </form>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">簡易入力</h3>
                <div className="space-y-2">
                  {quickInputs.map((quickText, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickInput(quickText)}
                      disabled={isLoading}
                      className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg transition-colors text-sm"
                    >
                      {quickText}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Response Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">AIトレーナーからの回答</h2>
              
              <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-gray-600">AIが考えています...</span>
                  </div>
                ) : response ? (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {response}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    質問を入力すると、AIトレーナーが回答します
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-4">
              ※ AIの回答は参考情報です。実際のトレーニングは専門家の指導のもと行ってください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}