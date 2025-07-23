import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50">
      <Header />
      <div className="flex flex-col items-center justify-center p-8 min-h-[calc(100vh-64px)]">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-orange-800 mb-8">
          Chicken Legs Training
        </h1>
        
        <div className="mb-12">
          <Image
            src="/chicken.png"
            alt="Chicken mascot"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
        </div>
        
        <p className="text-lg text-gray-600 mb-12 max-w-md mx-auto">
          スクワットトレーニングで理想の下半身を手に入れよう！
        </p>
        
        <Link
          href="/training_menu"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          スタート
        </Link>
      </div>
      </div>
    </div>
  );
}
