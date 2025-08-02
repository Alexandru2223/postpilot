'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useOnboarding } from '../../lib/useOnboarding';
import Notification, { useNotification } from '../../components/Notification';

export default function ProfilePage() {
  const { notifications, removeNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);

  // Onboarding hook
  const {
    businessData,
    isOnboardingCompleted,
    resetOnboarding,
    logout: logoutOnboarding,
    isLoading: onboardingLoading
  } = useOnboarding();

  const getIndustryIcon = (industry: string) => {
    if (industry.toLowerCase().includes('beauty')) return '💄';
    if (industry.toLowerCase().includes('food')) return '🍽️';
    if (industry.toLowerCase().includes('fashion')) return '👗';
    if (industry.toLowerCase().includes('health')) return '🏥';
    if (industry.toLowerCase().includes('technology')) return '💻';
    if (industry.toLowerCase().includes('sports')) return '⚽';
    return '🏢';
  };

  const getBusinessTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('salon')) return '🛍️';
    if (type.toLowerCase().includes('restaurant')) return '🍕';
    if (type.toLowerCase().includes('magazin')) return '🛍️';
    if (type.toLowerCase().includes('clinică')) return '🏥';
    if (type.toLowerCase().includes('servicii')) return '🔧';
    return '🏢';
  };

  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!isOnboardingCompleted || !businessData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profilul afacerii</h2>
            <p className="text-gray-600 mb-6">Completează onboarding-ul pentru a vedea profilul afacerii</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="gradient-primary text-white px-6 py-3 rounded-xl hover-lift shadow-premium"
            >
              Înapoi la Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profilul afacerii</h1>
              <p className="text-gray-600">Gestionați informațiile despre afacerea dvs.</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="gradient-primary text-white px-4 py-2 rounded-xl hover-lift shadow-premium"
            >
              {isEditing ? 'Salvează' : 'Editează'}
            </button>
          </div>

          {/* Business Overview Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-premium border border-white/20 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 gradient-secondary rounded-xl flex items-center justify-center shadow-premium">
                <span className="text-2xl font-bold text-white">
                  {getBusinessTypeIcon(businessData.businessType)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{businessData.businessName}</h2>
                <p className="text-lg text-gray-300 flex items-center">
                  <span className="mr-2">{getIndustryIcon(businessData.industry)}</span>
                  {businessData.industry}
                </p>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-400">Locație</span>
                </div>
                <p className="text-base font-semibold text-white">{businessData.location}</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium text-green-400">Audiență țintă</span>
                </div>
                <p className="text-base font-semibold text-white line-clamp-2">{businessData.targetAudience}</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                  <span className="text-sm font-medium text-purple-400">Platforme</span>
                </div>
                <p className="text-base font-semibold text-white">{businessData.socialMediaPlatforms.length} active</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-orange-400">Obiective</span>
                </div>
                <p className="text-base font-semibold text-white">{businessData.goals.length} definite</p>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Social Media Platforms */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-premium border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
                Platforme Social Media
              </h3>
              <div className="flex flex-wrap gap-3">
                {businessData.socialMediaPlatforms.map((platform) => (
                  <span 
                    key={platform} 
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full shadow-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Brand Voice */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-premium border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Vocea Brandului
              </h3>
              <p className="text-base font-medium text-white">{businessData.brandVoice}</p>
            </div>

            {/* Business Goals */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-premium border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Obiective
              </h3>
              <div className="space-y-3">
                {businessData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-white">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Challenges */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-premium border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Provocări
              </h3>
              <div className="space-y-3">
                {businessData.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-sm text-white">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          {(businessData.email || businessData.phone || businessData.website) && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-premium border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Informații de Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {businessData.email && (
                  <div className="flex items-center space-x-3 text-sm text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{businessData.email}</span>
                  </div>
                )}
                {businessData.phone && (
                  <div className="flex items-center space-x-3 text-sm text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{businessData.phone}</span>
                  </div>
                )}
                {businessData.website && (
                  <div className="flex items-center space-x-3 text-sm text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    <span className="text-blue-300 hover:underline cursor-pointer truncate">{businessData.website}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetOnboarding}
              className="gradient-secondary text-white px-6 py-3 rounded-xl hover-lift shadow-premium font-medium"
            >
              Resetează Onboarding
            </button>
            <button
              onClick={logoutOnboarding}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl hover-lift shadow-premium font-medium"
            >
              Deconectare
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
} 