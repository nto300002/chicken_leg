import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-orange-100 transition-colors">
            チキンレッグ解消！
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="hover:text-orange-100 transition-colors font-medium"
            >
              トップ
            </Link>
            <Link 
              href="/training_menu" 
              className="hover:text-orange-100 transition-colors font-medium"
            >
              トレーニングメニュー
            </Link>
            <Link 
              href="/ai_trainer" 
              className="hover:text-orange-100 transition-colors font-medium"
            >
              AIトレーナー
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}