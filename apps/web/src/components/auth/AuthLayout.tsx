import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import TopBar from "../landing/TopBar";
import Footer from "../landing/Footer";

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-gov-light-gray relative">
      <TopBar />
      
      {/* Header for Auth Pages */}
      <header className="border-b border-gray-200 bg-white shadow-sm z-10 relative">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/WelfAilogo.png"
                alt="WelfAI Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="text-lg font-bold text-gov-dark-blue hover:text-gov-mid-blue transition-colors">
                WelfAI
              </span>
            </Link>
          </div>

          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gov-dark-blue hover:text-gov-mid-blue transition-colors rounded-full hover:bg-gov-dark-blue/5 px-3 py-1.5 border border-transparent hover:border-gov-light-gray">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 py-12">
        <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Government Branding Side Panel */}
          <div className="hidden w-2/5 flex-col justify-between bg-gov-dark-blue p-8 text-white md:flex">
            <div>
              <div className="mb-8">
                <Image
                  src="/WelfAilogo.png"
                  alt="WelfAI Logo"
                  width={64}
                  height={64}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <h2 className="text-2xl font-bold leading-tight">
                WelfAI — Citizen Welfare Portal
              </h2>
              <p className="mt-4 text-sm text-gov-light-blue leading-relaxed">
                A secure, unified platform for accessing government services, benefits, and tracking schematic applications.
              </p>
            </div>
            <div className="text-xs text-white/60">
              Secured by National Informatics Framework
            </div>
          </div>

          {/* Form Area */}
          <div className="w-full p-8 md:w-3/5 lg:p-12">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 mb-8 text-sm text-gray-500">{subtitle}</p>
            
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
