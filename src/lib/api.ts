// API service for backend integration
// Acum folosește Next.js API routes ca proxy

export interface OnboardingRequest {
  businessName: string;
  businessType: string;
  industry: string;
  targetAudience?: string;
  businessDescription?: string;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  brandVoice?: string;
  socialMediaPlatforms: string[];
  businessGoals: string[];
  businessChallenges: string[];
  competitors?: string[];
}

export interface OnboardingResponse {
  businessProfileId?: number;
  businessName?: string;
  businessType?: string;
  industry?: string;
  targetAudience?: string;
  businessDescription?: string;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  brandVoice?: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  socialMediaPlatforms?: string[];
  businessGoals?: string[];
  businessChallenges?: string[];
  competitors?: string[];
  message?: string;
  status?: string;
}

export interface BusinessType {
  id: number;
  typeName: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Industry {
  id: number;
  industryName: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export interface OnboardingData {
  businessTypes: BusinessType[];
  industries: Industry[];
  socialMediaPlatforms: string[];
  businessGoals: string[];
  businessChallenges: string[];
  brandVoices: string[];
  status: string;
  message: string;
}

class ApiService {
  async getOnboardingStatus(): Promise<OnboardingResponse> {
    try {
      const response = await fetch('/api/onboarding/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return { message: 'No business profile found' };
      }

      if (response.status === 401) {
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      throw error;
    }
  }

  async completeOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Verifică dacă backend-ul a returnat o eroare în răspuns
      if (result.status === 'ERROR') {
        throw new Error(result.message || 'Backend error occurred');
      }

      return result;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  async getBusinessDetails(): Promise<OnboardingResponse> {
    try {
      const response = await fetch('/api/onboarding/business-details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return { message: 'Business details not found' };
      }

      if (response.status === 401) {
        throw new Error('Authentication failed');
      }

      if (response.status === 500) {
        return { message: 'Server error', status: 'ERROR' };
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching business details:', error);
      throw error;
    }
  }

  async getBusinessTypes(): Promise<BusinessType[]> {
    try {
      const response = await fetch('/api/onboarding/business-types');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching business types:', error);
      throw error;
    }
  }

  async getIndustries(): Promise<Industry[]> {
    try {
      const response = await fetch('/api/onboarding/industries');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }
  }

  async checkOnboardingCompletion(): Promise<boolean> {
    try {
      const response = await fetch('/api/onboarding/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.onboardingCompleted || false;
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      throw error;
    }
  }

  async getOnboardingData(): Promise<OnboardingData> {
    try {
      const response = await fetch('/api/onboarding/data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 