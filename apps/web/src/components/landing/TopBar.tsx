import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-gov-dark-blue px-4 py-1.5 text-xs text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Government of India</span>
          <span className="sm:hidden">GOI</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#main-content" className="hover:underline focus:underline">
            Skip to Main Content
          </a>
          <button className="flex items-center gap-1 hover:underline focus:outline-none">
            A-
          </button>
          <button className="flex items-center gap-1 hover:underline focus:outline-none">
            A
          </button>
          <button className="flex items-center gap-1 hover:underline focus:outline-none">
            A+
          </button>
          <div className="h-3 w-px bg-white/30 mx-1"></div>
          <select className="bg-transparent outline-none focus:ring-1 focus:ring-white">
            <option value="en" className="text-gray-900">English</option>
            <option value="hi" className="text-gray-900">हिन्दी</option>
          </select>
        </div>
      </div>
    </div>
  );
}
