'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { apiService, OnboardingRequest, OnboardingResponse } from './api';
import { useNotification } from '../components/Notification';

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
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);
  
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // Verifică statusul onboarding-ului când utilizatorul se loghează
  useEffect(() => {
    // Verifică doar o dată când utilizatorul se loghează și nu este în proces de verificare
    if (!isLoading && user && !isCheckingStatus && !hasCheckedStatus) {
      checkOnboardingStatus();
    }
  }, [user, isLoading, isCheckingStatus, hasCheckedStatus]);

  const checkOnboardingStatus = async () => {
    if (!user || isCheckingStatus || hasCheckedStatus) return;
    
    setIsCheckingStatus(true);
    
    try {
      // Verifică mai întâi în localStorage pentru performanță
      const storedBusinessData = localStorage.getItem('businessData');
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');

      if (storedBusinessData && onboardingCompleted === 'true') {
        try {
          const parsedData = JSON.parse(storedBusinessData);
          setBusinessData(parsedData);
          setIsOnboardingCompleted(true);
          setIsOnboardingOpen(false);
          setHasCheckedStatus(true);
          return; // Nu mai verifică backend-ul dacă avem date locale
        } catch (error) {
          console.error('Error parsing stored business data:', error);
          localStorage.removeItem('businessData');
          localStorage.removeItem('onboardingCompleted');
        }
      }

      // Verifică statusul pe backend doar dacă nu avem date locale
      try {
        const backendStatus = await apiService.getOnboardingStatus();
        
        if (backendStatus.onboardingCompleted && backendStatus.status !== 'ERROR' && backendStatus.status !== 'error') {
          // Backend confirmă că onboarding-ul este completat
          const businessDetails = await apiService.getBusinessDetails();
          
          if (businessDetails.businessName && businessDetails.status !== 'ERROR' && businessDetails.status !== 'error') {
            // Convertește datele din backend în formatul local
            const localBusinessData: BusinessData = {
              businessName: businessDetails.businessName || '',
              businessType: businessDetails.businessType || '',
              industry: businessDetails.industry || '',
              targetAudience: businessDetails.targetAudience || '',
              socialMediaPlatforms: businessDetails.socialMediaPlatforms || [],
              businessDescription: businessDetails.businessDescription || '',
              location: businessDetails.location || '',
              website: businessDetails.website,
              phone: businessDetails.phone,
              email: businessDetails.email,
              goals: businessDetails.businessGoals || [],
              challenges: businessDetails.businessChallenges || [],
              brandVoice: businessDetails.brandVoice || '',
              competitors: businessDetails.competitors || []
            };

            // Salvează în localStorage și setează state-ul
            localStorage.setItem('businessData', JSON.stringify(localBusinessData));
            localStorage.setItem('onboardingCompleted', 'true');
            setBusinessData(localBusinessData);
            setIsOnboardingCompleted(true);
            setIsOnboardingOpen(false);
            
            showSuccess('Configurarea afacerii a fost încărcată cu succes!');
          }
        } else {
          // Backend confirmă că onboarding-ul nu este completat
          localStorage.removeItem('businessData');
          localStorage.removeItem('onboardingCompleted');
          setBusinessData(null);
          setIsOnboardingCompleted(false);
          setIsOnboardingOpen(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        showWarning('Nu s-a putut verifica statusul configurației. Se folosesc datele locale.');
        
        // În caz de eroare, verifică localStorage ca fallback
        const storedBusinessData = localStorage.getItem('businessData');
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');

        if (storedBusinessData && onboardingCompleted === 'true') {
          try {
            const parsedData = JSON.parse(storedBusinessData);
            setBusinessData(parsedData);
            setIsOnboardingCompleted(true);
            setIsOnboardingOpen(false);
          } catch (error) {
            console.error('Error parsing fallback business data:', error);
            localStorage.removeItem('businessData');
            localStorage.removeItem('onboardingCompleted');
            setIsOnboardingOpen(true);
          }
        } else {
          setIsOnboardingOpen(true);
        }
      }
    } finally {
      setIsCheckingStatus(false);
      setHasCheckedStatus(true);
    }
  };

  const handleOnboardingComplete = async (data: BusinessData) => {
    try {
      // Convertește datele locale în formatul backend
      const onboardingRequest: OnboardingRequest = {
        businessName: data.businessName,
        businessType: data.businessType,
        industry: data.industry,
        targetAudience: data.targetAudience,
        businessDescription: data.businessDescription,
        location: data.location,
        website: data.website,
        phone: data.phone,
        email: data.email,
        brandVoice: data.brandVoice,
        socialMediaPlatforms: data.socialMediaPlatforms,
        businessGoals: data.goals,
        businessChallenges: data.challenges,
        competitors: data.competitors
      };

      // Trimite datele către backend
      const response = await apiService.completeOnboarding(onboardingRequest);
      
      // Verifică dacă backend-ul a confirmat salvarea cu succes
      if (response.businessProfileId && response.status !== 'ERROR' && response.status !== 'error') {
        // Salvează în localStorage doar dacă backend-ul a confirmat
        localStorage.setItem('businessData', JSON.stringify(data));
        localStorage.setItem('onboardingCompleted', 'true');
        
        // Actualizează state-ul
        setBusinessData(data);
        setIsOnboardingCompleted(true);
        setIsOnboardingOpen(false);
        
        showSuccess('Configurarea afacerii a fost salvată cu succes!');
      } else {
        // Backend-ul nu a confirmat salvarea
        throw new Error(response.message || 'Backend-ul nu a putut salva datele');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      
      // Nu salva în localStorage dacă backend-ul a eșuat
      showError('Nu s-a putut salva configurarea. Te rugăm să încerci din nou.');
      
      // Păstrează modalul deschis pentru a permite utilizatorului să încerce din nou
      setIsOnboardingOpen(true);
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem('businessData');
    localStorage.removeItem('onboardingCompleted');
    setBusinessData(null);
    setIsOnboardingCompleted(false);
    setIsOnboardingOpen(true);
    setHasCheckedStatus(false); // Reset pentru a permite verificarea din nou
    
    showInfo('Configurarea a fost resetată. Poți să o completezi din nou.');
  };

  const updateBusinessData = (newData: Partial<BusinessData>) => {
    if (businessData) {
      const updatedData = { ...businessData, ...newData };
      setBusinessData(updatedData);
      localStorage.setItem('businessData', JSON.stringify(updatedData));
    }
  };

  const logout = () => {
    // Curăță datele din localStorage la logout
    localStorage.removeItem('businessData');
    localStorage.removeItem('onboardingCompleted');
    setBusinessData(null);
    setIsOnboardingCompleted(false);
    setIsOnboardingOpen(false);
    setHasCheckedStatus(false); // Reset pentru următoarea sesiune
  };

  return {
    isOnboardingOpen,
    setIsOnboardingOpen,
    businessData,
    isOnboardingCompleted,
    handleOnboardingComplete,
    resetOnboarding,
    updateBusinessData,
    logout,
    isLoading: isLoading || isCheckingStatus
  };
} 