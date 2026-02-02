export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ===== TOP INFO ===== */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm">
          
          {/* Left: Brand */}
          <div className="text-center sm:text-left">
            <p className="text-white font-semibold text-base">
              Learn With Sazin
            </p>
            <p className="text-xs text-gray-400">
              Smart learning for students
            </p>
          </div>

          {/* Middle: Contact */}
          <div className="text-center space-y-1">
            <p>
              📍 <span className="ml-1">BokulTola,Jamalpur,Mymensingh Bangladesh</span>
            </p>
            <p>
              📞 <span className="ml-1">+880 1609362463,+880 1758676463 </span>
            </p>
            <p>
              ✉️ <span className="ml-1">mdsazinur90@gmail.com</span>
            </p>
          </div>

          {/* Right: Developer */}
          <div className="text-center sm:text-right">
            <p className="text-xs">
              Developed with ❤️ by{" "}
              <span className="text-white font-medium">
                Sazin
              </span>
            </p>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Learn With Sazin. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
