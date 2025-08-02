'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export interface BusinessData {
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

export function useOnboarding() {
  const { user, isLoading } = useUser();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  // Verifică dacă utilizatorul este logat și dacă are datele despre afacere
  useEffect(() => {
    if (!isLoading && user) {
      // Verifică localStorage pentru datele despre afacere
      const storedBusinessData = localStorage.getItem('businessData');
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');

      if (storedBusinessData && onboardingCompleted === 'true') {
        try {
          const parsedData = JSON.parse(storedBusinessData);
          setBusinessData(parsedData);
          setIsOnboardingCompleted(true);
        } catch (error) {
          console.error('Error parsing business data:', error);
          // Dacă datele sunt corupte, șterge-le și forțează onboarding-ul
          localStorage.removeItem('businessData');
          localStorage.removeItem('onboardingCompleted');
          setIsOnboardingOpen(true);
        }
      } else {
        // Utilizatorul nu are datele despre afacere, deschide onboarding-ul
        setIsOnboardingOpen(true);
      }
    }
  }, [user, isLoading]);

  const handleOnboardingComplete = (data: BusinessData) => {
    setBusinessData(data);
    setIsOnboardingCompleted(true);
    setIsOnboardingOpen(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('businessData');
    localStorage.removeItem('onboardingCompleted');
    setBusinessData(null);
    setIsOnboardingCompleted(false);
    setIsOnboardingOpen(true);
  };

  const updateBusinessData = (newData: Partial<BusinessData>) => {
    if (businessData) {
      const updatedData = { ...businessData, ...newData };
      setBusinessData(updatedData);
      localStorage.setItem('businessData', JSON.stringify(updatedData));
    }
  };

  return {
    isOnboardingOpen,
    setIsOnboardingOpen,
    businessData,
    isOnboardingCompleted,
    handleOnboardingComplete,
    resetOnboarding,
    updateBusinessData,
    isLoading
  };
} 