'use client';

import { useState } from 'react';
import { useAuth } from '../lib/useAuth';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onResetOnboarding?: () => void;
  onLogout?: () => void;
  isDemo?: boolean;
}

export default function Navbar({ onMobileMenuToggle, isMobileMenuOpen, onResetOnboarding, onLogout, isDemo = false }: NavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isLoading, login, signup, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    // Curăță datele locale înainte de logout
    if (onLogout) {
      onLogout();
    }
    // Închide meniul utilizatorului
    setIsUserMenuOpen(false);
    // Redirecționează la logout
    logout();
  };

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20 px-3 sm:px-4 lg:px-8">
        {/* Logo and App Name - Far Left */}
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 gradient-primary rounded-xl flex items-center justify-center shadow-premium">
            <span className="text-white font-bold text-base sm:text-lg lg:text-xl">S</span>
          </div>
          <div className="ml-2 sm:ml-3 lg:ml-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">
              {isDemo ? 'SocialDrive Demo' : 'SocialDrive'}
            </h1>
            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
              {isDemo ? 'Demo - Social Media Management' : 'Social Media Content Planning'}
            </p>
          </div>
        </div>

        {/* Mobile Hamburger Menu - Center */}
        <div className="lg:hidden">
          <button 
            onClick={onMobileMenuToggle}
            className="glass p-2 sm:p-3 rounded-xl shadow-premium hover-lift"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* User Menu - Far Right (Hidden on mobile) */}
        <div className="hidden lg:block relative">
          {isDemo ? (
            // Demo mode - show demo user with back button
            <div className="flex items-center space-x-3 text-gray-700 p-3">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">Înapoi</span>
              </button>
              <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center shadow-premium">
                <span className="text-white text-base font-medium">D</span>
              </div>
              <span className="text-base font-medium">Demo User</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">DEMO</span>
            </div>
          ) : isLoading ? (
            <div className="flex items-center space-x-3 text-gray-700 p-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : isAuthenticated && user ? (
            // Logged in user
            <>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-3 hover-lift"
              >
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name || 'User'} 
                    className="w-10 h-10 rounded-full shadow-premium"
                  />
                ) : (
                  <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center shadow-premium">
                    <span className="text-white text-base font-medium">
                      {getUserInitials(user.name, user.email)}
                    </span>
                  </div>
                )}
                <span className="text-base font-medium">{user.name || user.email}</span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-premium-lg py-2 z-50 border border-gray-700/50">
                  <div className="px-4 py-3 border-b border-gray-200/50">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'Utilizator'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/80 transition-colors hover:text-white">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profilul afacerii
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/80 transition-colors hover:text-white">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Setări
                    </a>
                    {onResetOnboarding && (
                      <button 
                        onClick={() => {
                          onResetOnboarding();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/80 transition-colors hover:text-white"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Resetare configurare
                      </button>
                    )}
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/80 transition-colors hover:text-white">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ajutor
                    </a>
                  </div>
                  <div className="py-1 border-t border-gray-200/50">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/30 transition-colors hover:text-red-300 group"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Deconectare
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Not logged in - show login/signup buttons
            <div className="flex items-center space-x-3">
              <button
                onClick={login}
                className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-xl hover:bg-gray-100/50 transition-colors"
              >
                Conectare
              </button>
              <button
                onClick={signup}
                className="gradient-primary text-white px-4 py-2 rounded-xl hover-lift shadow-premium font-medium"
              >
                Înregistrare
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 