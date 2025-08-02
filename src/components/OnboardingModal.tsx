'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { apiService, BusinessType, Industry, OnboardingData } from '../lib/api';

interface BusinessData {
  businessName: string;
  businessType: string;
  industry: string;
  targetAudience: string;
  socialMediaPlatforms: string[];
  businessDescription: string;
  location: string;
  website?: string;
  phone?: string;
  email?: string;
  goals: string[];
  challenges: string[];
  brandVoice: string;
  competitors: string[];
}

interface BusinessDataErrors {
  businessName?: string;
  businessType?: string;
  industry?: string;
  targetAudience?: string;
  socialMediaPlatforms?: string;
  businessDescription?: string;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  goals?: string;
  challenges?: string;
  brandVoice?: string;
  competitors?: string;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: BusinessData) => void;
}

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: '',
    businessType: '',
    industry: '',
    targetAudience: '',
    socialMediaPlatforms: [],
    businessDescription: '',
    location: '',
    website: '',
    phone: '',
    email: user?.email || '',
    goals: [],
    challenges: [],
    brandVoice: '',
    competitors: []
  });

  const [errors, setErrors] = useState<BusinessDataErrors>({});
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setBusinessData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      loadOnboardingData();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadOnboardingData = async () => {
    setIsLoadingData(true);
    try {
      console.log('Loading onboarding data...');
      const data = await apiService.getOnboardingData();
      
      console.log('Onboarding data loaded:', data);
      console.log('Business types length:', data.businessTypes.length);
      console.log('Industries length:', data.industries.length);
      console.log('Social media platforms length:', data.socialMediaPlatforms.length);
      console.log('Business goals length:', data.businessGoals.length);
      console.log('Business challenges length:', data.businessChallenges.length);
      console.log('Brand voices length:', data.brandVoices.length);
      
      setOnboardingData(data);
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      // Fallback la datele hardcodate în caz de eroare
      setOnboardingData({
        businessTypes: [
          { id: 1, typeName: "Salon de înfrumusețare", category: "Beauty", isActive: true, sortOrder: 1 },
          { id: 2, typeName: "Restaurant/Café", category: "Food", isActive: true, sortOrder: 2 },
          { id: 3, typeName: "Magazin de îmbrăcăminte", category: "Fashion", isActive: true, sortOrder: 3 },
          { id: 4, typeName: "Salon de coafură", category: "Beauty", isActive: true, sortOrder: 4 },
          { id: 5, typeName: "Clinică medicală", category: "Health", isActive: true, sortOrder: 5 },
          { id: 6, typeName: "Spa/Masaj", category: "Wellness", isActive: true, sortOrder: 6 },
          { id: 7, typeName: "Magazin de bijuterii", category: "Fashion", isActive: true, sortOrder: 7 },
          { id: 8, typeName: "Salon de tatuaje", category: "Beauty", isActive: true, sortOrder: 8 },
          { id: 9, typeName: "Magazin de sport", category: "Sports", isActive: true, sortOrder: 9 },
          { id: 10, typeName: "Farmacie", category: "Health", isActive: true, sortOrder: 10 },
          { id: 11, typeName: "Magazin de electronice", category: "Technology", isActive: true, sortOrder: 11 },
          { id: 12, typeName: "Servicii de curățenie", category: "Services", isActive: true, sortOrder: 12 },
          { id: 13, typeName: "Servicii de transport", category: "Services", isActive: true, sortOrder: 13 },
          { id: 14, typeName: "Servicii de construcții", category: "Services", isActive: true, sortOrder: 14 },
          { id: 15, typeName: "Servicii de IT", category: "Technology", isActive: true, sortOrder: 15 },
          { id: 16, typeName: "Servicii de marketing", category: "Services", isActive: true, sortOrder: 16 },
          { id: 17, typeName: "Servicii de contabilitate", category: "Services", isActive: true, sortOrder: 17 },
          { id: 18, typeName: "Servicii juridice", category: "Services", isActive: true, sortOrder: 18 },
          { id: 19, typeName: "Servicii de educație", category: "Education", isActive: true, sortOrder: 19 },
          { id: 20, typeName: "Altele", category: "Other", isActive: true, sortOrder: 20 }
        ],
        industries: [
          { id: 1, industryName: "Beauty & Personal Care", category: "Beauty", isActive: true, sortOrder: 1 },
          { id: 2, industryName: "Food & Beverage", category: "Food", isActive: true, sortOrder: 2 },
          { id: 3, industryName: "Fashion & Accessories", category: "Fashion", isActive: true, sortOrder: 3 },
          { id: 4, industryName: "Health & Wellness", category: "Health", isActive: true, sortOrder: 4 },
          { id: 5, industryName: "Home & Garden", category: "Home", isActive: true, sortOrder: 5 },
          { id: 6, industryName: "Sports & Fitness", category: "Sports", isActive: true, sortOrder: 6 },
          { id: 7, industryName: "Technology", category: "Technology", isActive: true, sortOrder: 7 },
          { id: 8, industryName: "Education", category: "Education", isActive: true, sortOrder: 8 },
          { id: 9, industryName: "Professional Services", category: "Services", isActive: true, sortOrder: 9 },
          { id: 10, industryName: "Entertainment", category: "Entertainment", isActive: true, sortOrder: 10 },
          { id: 11, industryName: "Travel & Tourism", category: "Travel", isActive: true, sortOrder: 11 },
          { id: 12, industryName: "Automotive", category: "Automotive", isActive: true, sortOrder: 12 },
          { id: 13, industryName: "Real Estate", category: "Real Estate", isActive: true, sortOrder: 13 },
          { id: 14, industryName: "Financial Services", category: "Finance", isActive: true, sortOrder: 14 },
          { id: 15, industryName: "Non-profit", category: "Non-profit", isActive: true, sortOrder: 15 },
          { id: 16, industryName: "Altele", category: "Other", isActive: true, sortOrder: 16 }
        ],
        socialMediaPlatforms: [
          "Instagram",
          "Facebook",
          "TikTok",
          "LinkedIn",
          "Twitter/X",
          "YouTube",
          "Pinterest",
          "Snapchat",
          "WhatsApp Business",
          "Telegram"
        ],
        businessGoals: [
          "Creșterea vânzărilor",
          "Creșterea engagement-ului",
          "Creșterea brand awareness",
          "Atragerea de clienți noi",
          "Păstrarea clienților existenți",
          "Creșterea conversiilor",
          "Îmbunătățirea serviciului clienți",
          "Lansarea de produse noi",
          "Creșterea traficului pe website",
          "Îmbunătățirea SEO"
        ],
        businessChallenges: [
          "Lipsa de timp pentru conținut",
          "Dificultatea în găsirea de idei noi",
          "Costurile mari de marketing",
          "Competiția intensă",
          "Schimbările algoritmilor",
          "Dificultatea în măsurarea ROI",
          "Lipsa de personal specializat",
          "Dificultatea în targetarea audienței",
          "Lipsa de consistență în postări",
          "Dificultatea în crearea de conținut viral"
        ],
        brandVoices: [
          "Prietenos și accesibil",
          "Profesional și autoritar",
          "Creativ și inovativ",
          "Calm și relaxant",
          "Energic și motivant",
          "Humoristic și distractiv",
          "Educativ și informativ",
          "Luxos și exclusivist",
          "Sustainabil și eco-friendly",
          "Tehnologic și modern"
        ],
        status: "SUCCESS",
        message: "Onboarding data retrieved successfully"
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: BusinessDataErrors = {};

    switch (step) {
      case 1:
        if (!businessData.businessName.trim()) newErrors.businessName = 'Numele afacerii este obligatoriu';
        if (!businessData.businessType) newErrors.businessType = 'Tipul de afacere este obligatoriu';
        if (!businessData.industry) newErrors.industry = 'Industria este obligatorie';
        break;
      case 2:
        if (!businessData.targetAudience.trim()) newErrors.targetAudience = 'Audiența țintă este obligatorie';
        if (businessData.socialMediaPlatforms.length === 0) newErrors.socialMediaPlatforms = 'Selectează cel puțin o platformă social media';
        break;
      case 3:
        if (!businessData.businessDescription.trim()) newErrors.businessDescription = 'Descrierea afacerii este obligatorie';
        if (!businessData.location.trim()) newErrors.location = 'Locația este obligatorie';
        break;
      case 4:
        if (businessData.goals.length === 0) newErrors.goals = 'Selectează cel puțin un obiectiv';
        if (businessData.challenges.length === 0) newErrors.challenges = 'Selectează cel puțin o provocare';
        break;
      case 5:
        if (!businessData.brandVoice) newErrors.brandVoice = 'Vocea brandului este obligatorie';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(businessData);
    }
  };

  const updateBusinessData = (field: keyof BusinessData, value: any) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleArrayItem = (field: keyof BusinessData, item: string) => {
    const currentArray = businessData[field] as string[];
    const updatedArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateBusinessData(field, updatedArray);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-glass rounded-2xl shadow-premium-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 card-glass rounded-t-2xl border-b border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Configurare afacere
            </h2>
            <div className="text-sm text-gray-500">
              Pasul {currentStep} din 5
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200/20 rounded-full h-2">
            <div 
              className="gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoadingData && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-gray-600">Se încarcă datele...</span>
            </div>
          )}

          {!isLoadingData && onboardingData && currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informații de bază despre afacerea ta
                </h3>
                <p className="text-gray-600 mb-6">
                  Aceste informații ne ajută să generăm conținut personalizat pentru afacerea ta.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numele afacerii *
                </label>
                <input
                  type="text"
                  value={businessData.businessName}
                  onChange={(e) => updateBusinessData('businessName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Salonul meu de înfrumusețare"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipul de afacere *
                </label>
                <div className="relative">
                  <select
                    value={businessData.businessType}
                    onChange={(e) => updateBusinessData('businessType', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm ${
                      errors.businessType ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ color: '#ffffff' }}
                  >
                    <option value="" style={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', color: '#ffffff' }}>Selectează tipul de afacere</option>
                    {onboardingData?.businessTypes?.map((type) => (
                      <option key={type.id} value={type.typeName} style={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', color: '#ffffff' }}>{type.typeName}</option>
                    ))}
                  </select>
                </div>
                {errors.businessType && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industria *
                </label>
                <div className="relative">
                  <select
                    value={businessData.industry}
                    onChange={(e) => updateBusinessData('industry', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm ${
                      errors.industry ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ color: '#ffffff' }}
                  >
                    <option value="" style={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', color: '#ffffff' }}>Selectează industria</option>
                    {onboardingData?.industries?.map((industry) => (
                      <option key={industry.id} value={industry.industryName} style={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', color: '#ffffff' }}>{industry.industryName}</option>
                    ))}
                  </select>
                </div>
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                )}
              </div>
            </div>
          )}

          {!isLoadingData && onboardingData && currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Audiența și platformele
                </h3>
                <p className="text-gray-600 mb-6">
                  Spune-ne despre audiența ta țintă și pe ce platforme social media vrei să activezi.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audiența țintă *
                </label>
                <textarea
                  value={businessData.targetAudience}
                  onChange={(e) => updateBusinessData('targetAudience', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 ${
                    errors.targetAudience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Ex: Femei între 25-45 ani, interesate de beauty și lifestyle, din București"
                />
                {errors.targetAudience && (
                  <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforme social media *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {onboardingData?.socialMediaPlatforms?.map((platform) => (
                    <label key={platform} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                      <input
                        type="checkbox"
                        checked={businessData.socialMediaPlatforms.includes(platform)}
                        onChange={() => toggleArrayItem('socialMediaPlatforms', platform)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
                {errors.socialMediaPlatforms && (
                  <p className="text-red-500 text-sm mt-1">{errors.socialMediaPlatforms}</p>
                )}
              </div>
            </div>
          )}

          {!isLoadingData && onboardingData && currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Despre afacerea ta
                </h3>
                <p className="text-gray-600 mb-6">
                  Spune-ne mai multe despre afacerea ta și cum putem să te ajutăm.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrierea afacerii *
                </label>
                <textarea
                  value={businessData.businessDescription}
                  onChange={(e) => updateBusinessData('businessDescription', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 ${
                    errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={4}
                  placeholder="Descrie afacerea ta, serviciile sau produsele oferite..."
                />
                {errors.businessDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locația *
                </label>
                                  <input
                    type="text"
                    value={businessData.location}
                    onChange={(e) => updateBusinessData('location', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: București, România"
                  />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={businessData.website}
                    onChange={(e) => updateBusinessData('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={businessData.phone}
                    onChange={(e) => updateBusinessData('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
                    placeholder="+40 123 456 789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={businessData.email}
                    onChange={(e) => updateBusinessData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {!isLoadingData && onboardingData && currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Obiective și provocări
                </h3>
                <p className="text-gray-600 mb-6">
                  Spune-ne ce vrei să realizezi și cu ce te confrunți în prezent.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obiectivele tale *
                </label>
                <div className="space-y-2">
                  {onboardingData?.businessGoals?.map((goal) => (
                    <label key={goal} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                      <input
                        type="checkbox"
                        checked={businessData.goals.includes(goal)}
                        onChange={() => toggleArrayItem('goals', goal)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
                {errors.goals && (
                  <p className="text-red-500 text-sm mt-1">{errors.goals}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provocările tale *
                </label>
                <div className="space-y-2">
                  {onboardingData?.businessChallenges?.map((challenge) => (
                    <label key={challenge} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                      <input
                        type="checkbox"
                        checked={businessData.challenges.includes(challenge)}
                        onChange={() => toggleArrayItem('challenges', challenge)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{challenge}</span>
                    </label>
                  ))}
                </div>
                {errors.challenges && (
                  <p className="text-red-500 text-sm mt-1">{errors.challenges}</p>
                )}
              </div>
            </div>
          )}

          {!isLoadingData && onboardingData && currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vocea brandului
                </h3>
                <p className="text-gray-600 mb-6">
                  Alege vocea care reflectă cel mai bine personalitatea brandului tău.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vocea brandului *
                </label>
                <div className="space-y-2">
                  {onboardingData?.brandVoices?.map((voice) => (
                    <label key={voice} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                      <input
                        type="radio"
                        name="brandVoice"
                        value={voice}
                        checked={businessData.brandVoice === voice}
                        onChange={(e) => updateBusinessData('brandVoice', e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{voice}</span>
                    </label>
                  ))}
                </div>
                {errors.brandVoice && (
                  <p className="text-red-500 text-sm mt-1">{errors.brandVoice}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 card-glass rounded-b-2xl border-t border-gray-200/50 p-6">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Înapoi
            </button>
            
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Următorul pas
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-3 gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Finalizează configurarea
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 