"use client";

import { AlertCircle } from "lucide-react";

export default function NewsTicker() {
  const updates = [
    "New PM Kisan Samman Nidhi installment dates announced.",
    "Deadline for linking Aadhar with PAN extended to March 31.",
    "Apply for the National Scholarship Portal 2026-27 session now.",
    "Digital Health ID mapping is now mandatory for state hospital benefits."
  ];

  return (
    <div className="bg-[#fff3cd] border-b border-[#ffeeba] px-4 py-2 flex items-center w-full overflow-hidden text-sm">
      <div className="flex items-center gap-2 font-bold text-[#856404] px-3 bg-[#fff3cd] z-10 whitespace-nowrap border-r border-[#ffeeba] shrink-0">
        <AlertCircle className="h-4 w-4" />
        <span>LATEST UPDATES:</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative group">
        <div className="animate-[ticker_35s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap pl-[100%] leading-none flex items-center gap-16">
          {updates.map((text, i) => (
            <span key={i} className="text-[#856404] font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#856404] mr-3 inline-block"></span>
              {text}
            </span>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
