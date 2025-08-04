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

// Posts interfaces
export interface PostRequest {
  title: string;
  caption?: string;
  hashtags?: string;
  platform: string;
  postType: 'normal' | 'reel';
  status: 'scheduled' | 'draft' | 'published';
  scheduledDate: string;
  scheduledTime: string;
  videoScript?: string;
  videoIdeas?: string[];
}

export interface PostResponse {
  id: number;
  userId: string;
  title: string;
  caption?: string;
  hashtags?: string;
  platform: string;
  postType: 'normal' | 'reel';
  status: 'scheduled' | 'draft' | 'published';
  scheduledDate: string;
  scheduledTime: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  videoScript?: string;
  videoIdeas?: string[];
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  viewsCount?: number;
  engagementRate?: number;
}

export interface SuggestionResponse {
  hashtags: string[];
  captions: string[];
  postIdeas: string[];
  videoIdeas: string[];
}

export interface PostTemplateRequest {
  name: string;
  titleTemplate?: string;
  captionTemplate?: string;
  hashtagsTemplate?: string;
  platform: string;
  postType: 'normal' | 'reel';
  isActive?: boolean;
}

export interface PostTemplate {
  id: number;
  userId: string;
  name: string;
  titleTemplate?: string;
  captionTemplate?: string;
  hashtagsTemplate?: string;
  platform: string;
  postType: 'normal' | 'reel';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

  // Posts API methods
  async getPosts(): Promise<PostResponse[]> {
    try {
      const response = await fetch('/api/posts', {
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
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getPostsByDate(date: string): Promise<PostResponse[]> {
    try {
      const response = await fetch(`/api/posts/date/${date}`, {
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
      console.error('Error fetching posts by date:', error);
      throw error;
    }
  }

  async getPostsByWeek(startDate: string): Promise<PostResponse[]> {
    try {
      const response = await fetch(`/api/posts/week/${startDate}`, {
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
      console.error('Error fetching posts by week:', error);
      throw error;
    }
  }

  async getPostsByMonth(year: number, month: number): Promise<PostResponse[]> {
    try {
      const response = await fetch(`/api/posts/month/${year}/${month}`, {
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
      console.error('Error fetching posts by month:', error);
      throw error;
    }
  }

  async getPostsByPeriod(startDate: string, endDate: string): Promise<PostResponse[]> {
    try {
      const response = await fetch(`/api/posts/period?startDate=${startDate}&endDate=${endDate}`, {
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
      console.error('Error fetching posts by period:', error);
      throw error;
    }
  }

  async getPost(postId: number): Promise<PostResponse> {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
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
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  async createPost(data: PostRequest): Promise<PostResponse> {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async updatePost(postId: number, data: PostRequest): Promise<PostResponse> {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePost(postId: number): Promise<void> {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async getSuggestions(platform: string, category?: string, language?: string): Promise<SuggestionResponse> {
    try {
      let url = `/api/posts/suggestions/${platform}`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (language) params.append('language', language);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
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
      console.error('Error fetching suggestions:', error);
      throw error;
    }
  }

  async getPostTemplates(): Promise<PostTemplate[]> {
    try {
      const response = await fetch('/api/post-templates', {
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
      console.error('Error fetching post templates:', error);
      throw error;
    }
  }

  async createPostTemplate(data: PostTemplateRequest): Promise<PostTemplate> {
    try {
      const response = await fetch('/api/post-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating post template:', error);
      throw error;
    }
  }

  async getPostsByStatus(status: 'scheduled' | 'draft' | 'published'): Promise<PostResponse[]> {
    try {
      const response = await fetch(`/api/posts/status/${status}`, {
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
      console.error('Error fetching posts by status:', error);
      throw error;
    }
  }

  async getPostsByPlatform(platform: string): Promise<PostResponse[]> {
    try {
      const response = await fetch(`/api/posts/platform/${platform}`, {
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
      console.error('Error fetching posts by platform:', error);
      throw error;
    }
  }

  async getPostsWithFilters(filters: {
    status?: 'scheduled' | 'draft' | 'published';
    platform?: string;
    startDate?: string;
    endDate?: string;
    postType?: 'normal' | 'reel';
  }): Promise<PostResponse[]> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.postType) params.append('postType', filters.postType);

      const response = await fetch(`/api/posts/filter?${params.toString()}`, {
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
      console.error('Error fetching posts with filters:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 