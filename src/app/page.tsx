'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      title: "AI-Powered Content Creation",
      description: "Generate engaging social media content with advanced AI that understands your brand voice",
      icon: "🤖",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Smart Analytics Dashboard",
      description: "Track performance across all platforms with real-time insights and predictive analytics",
      icon: "📊",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Automated Scheduling",
      description: "Schedule posts across multiple platforms with intelligent timing optimization",
      icon: "⏰",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Brand Voice Optimization",
      description: "Maintain consistent brand voice across all your social media channels",
      icon: "🎯",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg">S</span>
          </div>
          <span className="text-white font-bold text-lg sm:text-xl">SocialDrive</span>
        </div>
        <div className="flex space-x-2 sm:space-x-4">
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            Conectare
          </button>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-sm sm:text-base"
          >
            Începe Gratuit
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Revoluționează
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Prezența Digitală
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Platforma AI care transformă modul în care afacerile mici gestionează social media. 
            Conținut inteligent, analize avansate, rezultate reale.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Începe Gratuit - 14 Zile
            </button>
            <button 
              onClick={() => router.push('/demo')}
              className="border border-purple-400 text-purple-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300 w-full sm:w-auto"
            >
              Vezi Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            De ce SocialDrive?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Combinația perfectă între tehnologie AI și simplitate pentru afacerile mici
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 ${
                currentFeature === index ? 'scale-105 shadow-xl shadow-purple-500/25' : ''
              }`}
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto`}>
                <span className="text-xl sm:text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-gray-300 text-sm sm:text-base">Afaceri Active</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-gray-300 text-sm sm:text-base">Postări Generate</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">98%</div>
            <div className="text-gray-300 text-sm sm:text-base">Satisfacție Clienți</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Gata să-ți transformi prezența digitală?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Alătură-te sutelor de afaceri mici care deja folosesc SocialDrive pentru a-și crește prezența online
            </p>
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Începe Acum - Gratuit
            </button>
            <p className="text-gray-400 mt-4 text-sm sm:text-base">Fără card de credit • Anulare oricând</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">S</span>
              </div>
              <span className="text-white font-bold text-lg sm:text-xl">SocialDrive</span>
            </div>
            <div className="flex space-x-4 sm:space-x-6 text-gray-400 text-sm sm:text-base">
              <a href="#" className="hover:text-white transition-colors">Termeni</a>
              <a href="#" className="hover:text-white transition-colors">Confidențialitate</a>
              <a href="#" className="hover:text-white transition-colors">Suport</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
