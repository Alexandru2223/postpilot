'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

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

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: BusinessData) => void;
}

const businessTypes = [
  "Salon de înfrumusețare",
  "Restaurant/Café",
  "Magazin de îmbrăcăminte",
  "Salon de coafură",
  "Clinică medicală",
  "Spa/Masaj",
  "Magazin de bijuterii",
  "Salon de tatuaje",
  "Magazin de sport",
  "Farmacie",
  "Magazin de electronice",
  "Servicii de curățenie",
  "Servicii de transport",
  "Servicii de construcții",
  "Servicii de IT",
  "Servicii de marketing",
  "Servicii de contabilitate",
  "Servicii juridice",
  "Servicii de educație",
  "Altele"
];

const industries = [
  "Beauty & Personal Care",
  "Food & Beverage",
  "Fashion & Accessories",
  "Health & Wellness",
  "Home & Garden",
  "Sports & Fitness",
  "Technology",
  "Education",
  "Professional Services",
  "Entertainment",
  "Travel & Tourism",
  "Automotive",
  "Real Estate",
  "Financial Services",
  "Non-profit",
  "Altele"
];

const socialMediaPlatforms = [
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Twitter/X",
  "Pinterest",
  "Snapchat"
];

const brandVoices = [
  "Profesional și formal",
  "Prietenos și accesibil",
  "Tânăr și dinamic",
  "Luxos și elegant",
  "Humoristic și distractiv",
  "Educațional și informativ",
  "Motivant și inspirat",
  "Relaxat și natural"
];

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

  const [errors, setErrors] = useState<Partial<BusinessData>>({});

  useEffect(() => {
    if (user?.email) {
      setBusinessData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<BusinessData> = {};

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
      // Salvează în localStorage
      localStorage.setItem('businessData', JSON.stringify(businessData));
      localStorage.setItem('onboardingCompleted', 'true');
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
          {currentStep === 1 && (
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
                      {businessTypes.map((type) => (
                        <option key={type} value={type} style={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', color: '#ffffff' }}>{type}</option>
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
                      {industries.map((industry) => (
                        <option key={industry} value={industry} style={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', color: '#ffffff' }}>{industry}</option>
                      ))}
                    </select>
                  </div>
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
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
                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm ${
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
                                     {socialMediaPlatforms.map((platform) => (
                     <label key={platform} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                       <input
                         type="checkbox"
                         checked={businessData.socialMediaPlatforms.includes(platform)}
                         onChange={() => toggleArrayItem('socialMediaPlatforms', platform)}
                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                       />
                       <span className="text-sm font-medium text-gray-700">{platform}</span>
                     </label>
                   ))}
                </div>
                {errors.socialMediaPlatforms && (
                  <p className="text-red-500 text-sm mt-1">{errors.socialMediaPlatforms}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Descrierea afacerii
                </h3>
                <p className="text-gray-600 mb-6">
                  O descriere detaliată ne ajută să înțelegem mai bine serviciile tale.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrierea afacerii *
                </label>
                                 <textarea
                   value={businessData.businessDescription}
                   onChange={(e) => updateBusinessData('businessDescription', e.target.value)}
                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm ${
                     errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                   }`}
                   rows={4}
                   placeholder="Descrie serviciile tale, ce te face special, și ce oferi clienților tăi..."
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
                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm ${
                     errors.location ? 'border-red-500' : 'border-gray-300'
                   }`}
                   placeholder="Ex: București, Sector 1"
                 />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (opțional)
                  </label>
                                     <input
                     type="url"
                     value={businessData.website}
                     onChange={(e) => updateBusinessData('website', e.target.value)}
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm"
                     placeholder="https://www.example.com"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Telefon (opțional)
                   </label>
                   <input
                     type="tel"
                     value={businessData.phone}
                     onChange={(e) => updateBusinessData('phone', e.target.value)}
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm"
                     placeholder="+40 123 456 789"
                   />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Obiective și provocări
                </h3>
                <p className="text-gray-600 mb-6">
                  Înțelegerea obiectivelor și provocărilor tale ne ajută să generăm conținut mai relevant.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ce obiective ai pentru social media? *
                </label>
                <div className="space-y-2">
                  {[
                    "Creșterea numărului de urmăritori",
                    "Creșterea vânzărilor",
                    "Creșterea conștientizării brandului",
                    "Atragerea de clienți noi",
                    "Păstrarea clienților existenți",
                    "Creșterea engagement-ului",
                    "Promovarea serviciilor noi",
                    "Construirea unei comunități"
                                     ].map((goal) => (
                     <label key={goal} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                       <input
                         type="checkbox"
                         checked={businessData.goals.includes(goal)}
                         onChange={() => toggleArrayItem('goals', goal)}
                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ce provocări întâmpini pe social media? *
                </label>
                <div className="space-y-2">
                  {[
                    "Lipsa de timp pentru conținut",
                    "Dificultatea în găsirea de idei noi",
                    "Engagement scăzut",
                    "Dificultatea în atragerea de clienți",
                    "Competiția mare",
                    "Algoritmii social media",
                    "Consistența în postare",
                    "Măsurarea rezultatelor"
                                     ].map((challenge) => (
                     <label key={challenge} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                       <input
                         type="checkbox"
                         checked={businessData.challenges.includes(challenge)}
                         onChange={() => toggleArrayItem('challenges', challenge)}
                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vocea brandului
                </h3>
                <p className="text-gray-600 mb-6">
                  Vocea brandului definește cum vrei să comunici cu audiența ta.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Care este vocea brandului tău? *
                </label>
                <div className="space-y-2">
                                   {brandVoices.map((voice) => (
                   <label key={voice} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50/50 cursor-pointer bg-white/5 backdrop-blur-sm">
                     <input
                       type="radio"
                       name="brandVoice"
                       value={voice}
                       checked={businessData.brandVoice === voice}
                       onChange={(e) => updateBusinessData('brandVoice', e.target.value)}
                       className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                     />
                     <span className="text-sm text-gray-700">{voice}</span>
                   </label>
                 ))}
                </div>
                {errors.brandVoice && (
                  <p className="text-red-500 text-sm mt-1">{errors.brandVoice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitori principali (opțional)
                </label>
                                 <textarea
                   value={businessData.competitors.join(', ')}
                   onChange={(e) => updateBusinessData('competitors', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm"
                   rows={2}
                   placeholder="Ex: Salon Beauty, Nail Art Studio, Beauty Center (separate prin virgulă)"
                 />
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