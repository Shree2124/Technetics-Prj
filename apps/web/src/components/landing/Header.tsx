import Link from "next/link";
import { Button } from "../ui/Button";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Enhanced State Emblem Placeholder */}
          <div className="flex h-14 w-11 flex-col items-center justify-center rounded-sm bg-gradient-to-b from-gov-light-blue/20 to-gov-light-gray border border-gov-mid-blue/20 text-xs font-bold text-gov-dark-blue shadow-inner">
            <span className="text-[10px]">सत्यमेव</span>
            <span>GOI</span>
          </div>
          <div>
            <Link href="/" className="text-xl font-bold text-gov-dark-blue sm:text-2xl tracking-tight">
              WelfareApp
            </Link>
            <p className="text-xs font-medium text-gov-slate sm:text-sm">
              Ministry of Citizen Services
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="order-3 w-full md:order-none md:w-auto md:flex-1 md:max-w-md md:px-8">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-gov-mid-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-mid-blue"
              placeholder="Search schemes, services, or tracking number..."
            />
          </div>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="text-sm font-medium text-gov-dark-blue hover:text-gov-mid-blue transition-colors">
            Home
          </Link>
          <Link href="#services" className="text-sm font-medium text-gov-dark-blue hover:text-gov-mid-blue transition-colors">
            Services
          </Link>
          <Link href="#contact" className="text-sm font-medium text-gov-dark-blue hover:text-gov-mid-blue transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3 order-2 md:order-none">
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
