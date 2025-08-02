'use client';

import { useState } from 'react';
import { BusinessData } from '../lib/useOnboarding';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
  businessData?: BusinessData | null;
  isDemo?: boolean;
}

export default function Sidebar({ activeSection, onSectionChange, isMobileMenuOpen, onMobileMenuClose, businessData, isDemo = false }: SidebarProps) {
  const menuItems = [
    {
      id: 'calendar',
      name: 'Calendar',
      description: 'Planifică postările tale',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'ideas',
      name: 'Idei postări',
      description: 'Descoperă conținut nou',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 'captions',
      name: 'Caption-uri',
      description: 'Generează text captivant',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      )
    },
    {
      id: 'hashtags',
      name: 'Hashtag-uri',
      description: 'Optimizează vizibilitatea',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static left-0 z-40 w-64 lg:w-72 glass border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isMobileMenuOpen ? 'top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] lg:top-0 lg:h-full' : 'top-0 h-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile User Info - Only shown when mobile menu is open */}
          <div className="lg:hidden p-4 sm:p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-secondary rounded-full flex items-center justify-center shadow-premium">
                <span className="text-base sm:text-lg font-medium text-white">D</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {isDemo ? 'Demo User' : 'Utilizator Demo'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {isDemo ? 'demo@socialdrive.com' : 'utilizator@example.com'}
                </p>
                {isDemo && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1">DEMO</span>
                )}
              </div>
              {isDemo && (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-3 sm:mt-4 space-y-2">
              {isDemo && (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="flex items-center w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7m-7 7h18m-9-9v18" />
                  </svg>
                  Înapoi la Homepage
                </button>
              )}
              <a href="#" className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </a>
              <a href="#" className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Setări
              </a>
              <a href="#" className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Deconectare
              </a>
            </div>
          </div>

          {/* Desktop Navigation Header */}
          <div className="hidden lg:block p-6 border-b border-gray-200/50">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Navigare</h2>
            <p className="text-sm text-gray-500">Gestionați conținutul social media</p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onMobileMenuClose(); // Close mobile menu when item is clicked
                }}
                                  className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-200 hover-lift ${
                    activeSection === item.id 
                      ? 'gradient-primary text-white shadow-premium' 
                      : 'text-gray-700 hover:bg-gray-50/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${activeSection === item.id ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-sm sm:text-base">{item.name}</div>
                    <div className={`text-xs ${activeSection === item.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200/50 space-y-3">
            {isDemo && (
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg py-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7m-7 7h18m-9-9v18" />
                </svg>
                <span>Înapoi la Homepage</span>
              </button>
            )}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-3 sm:p-4 border border-blue-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">AI Powered</p>
                  <p className="text-xs text-gray-600">Conținut generat inteligent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 