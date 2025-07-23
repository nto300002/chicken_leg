import Link from "next/link";
import { legTrainingData } from "../../api/leg-training";
import Header from "../components/Header";

interface TrainingItem {
  id: number;
  title: string;
  note: string;
  url: string;
}

export default function TrainingMenu() {
  const trainingData: TrainingItem[] = legTrainingData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50">
      <Header />
      <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">
            トレーニングメニュー
          </h1>
          <p className="text-gray-600 text-lg">
            お好みの種目を選択してください
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trainingData.map((item) => (
            <Link
              key={item.id}
              href={`/training_menu/${item.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-orange-300 group"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow leading-relaxed">
                  {item.note}
                </p>
                <div className="mt-4 text-orange-500 font-medium text-sm">
                  トレーニング開始 →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
          >
            ← トップに戻る
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}