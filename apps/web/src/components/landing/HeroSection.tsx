"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2671&auto=format&fit=crop",
    title: "Empowering Citizens Through",
    highlight: "Transparent Governance",
    subtitle: "The national portal for accessing, verifying, and managing citizen welfare schemes and benefits seamlessly and securely."
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2676&auto=format&fit=crop",
    title: "Bridging the Gap with",
    highlight: "Digital India",
    subtitle: "Ensuring 100% digital penetration for rural and urban benefits dispensation across all states and union territories."
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=2615&auto=format&fit=crop",
    title: "Secure & Verified",
    highlight: "Identity Management",
    subtitle: "Link your Aadhaar to your welfare account to ensure instantaneous verification and fraud prevention."
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden bg-gov-dark-blue h-[560px] lg:h-[680px] flex items-center">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background image */}
          <img
            src={slide.img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Single consistent blue overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#274c77]/90 via-[#274c77]/80 to-[#274c77]/60" />

          {/* Content */}
          <div className="relative h-full mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#a3cef1] mr-2"></span>
                National Citizen Portal 2.0
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-md leading-tight">
                {slide.title} <br className="hidden lg:block" />
                <span className="text-[#a3cef1]">{slide.highlight}</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/90 drop-shadow leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md bg-[#f59e0b] px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-[#d97706] transition-colors"
                >
                  Apply for Benefits →
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md border-2 border-white px-8 py-3.5 text-base font-bold text-white hover:bg-white hover:text-[#274c77] transition-colors"
                >
                  Track Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 backdrop-blur-sm transition-all focus:outline-none border border-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 backdrop-blur-sm transition-all focus:outline-none border border-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current ? "w-8 h-3 bg-[#f59e0b]" : "w-3 h-3 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
