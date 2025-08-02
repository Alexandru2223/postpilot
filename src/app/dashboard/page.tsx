'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Calendar from '../../components/Calendar';
import AddPostModal from '../../components/AddPostModal';
import OnboardingModal from '../../components/OnboardingModal';
import Notification, { useNotification } from '../../components/Notification';
import BusinessInfoCard from '../../components/BusinessInfoCard';
import { useOnboarding } from '../../lib/useOnboarding';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('calendar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const calendarRef = useRef<{ handleAddToCalendar: (post: {
    id: number;
    title: string;
    platform: string;
    time: string;
    status: 'scheduled' | 'draft' | 'published';
    date: string;
  }) => void }>(null);

  const { user, isLoading: authLoading } = useUser();
  const { notifications, removeNotification } = useNotification();

  // Onboarding hook
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    businessData,
    isOnboardingCompleted,
    handleOnboardingComplete,
    resetOnboarding,
    logout: logoutOnboarding,
    isLoading: onboardingLoading
  } = useOnboarding();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to handle adding posts to calendar
  const handleAddToCalendar = (newPost: {
    id: number;
    title: string;
    platform: string;
    time: string;
    status: 'scheduled' | 'draft' | 'published';
    date: string;
  }) => {
    // This will be passed to the Calendar component
    console.log('Dashboard: New post added to calendar:', newPost);
    // Call the Calendar component's method to add the post
    if (calendarRef.current && calendarRef.current.handleAddToCalendar) {
      console.log('Dashboard: Calling calendar handleAddToCalendar');
      calendarRef.current.handleAddToCalendar(newPost);
    } else {
      console.log('Dashboard: Calendar ref or method not available');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'calendar':
        return (
          <Calendar 
            ref={calendarRef}
            onAddPost={() => setIsModalOpen(true)}
            businessData={businessData}
          />
        );
      case 'ideas':
        return <IdeasPage />;
      case 'captions':
        return <CaptionsPage />;
      case 'hashtags':
        return <HashtagsPage />;
      default:
        return <Calendar ref={calendarRef} onAddPost={() => setIsModalOpen(true)} />;
    }
  };

  // Dacă încă se încarcă, afișează loading
  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  // Dacă onboarding-ul nu este completat, afișează doar navbar-ul și modal-ul de onboarding
  if (!isOnboardingCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
          onResetOnboarding={resetOnboarding}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleOnboardingComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
        onResetOnboarding={resetOnboarding}
        onLogout={logoutOnboarding}
      />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={handleMobileMenuClose}
          businessData={businessData}
        />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:ml-0 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          {renderContent()}
        </main>
      </div>
      <AddPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAddToCalendar={handleAddToCalendar}
      />
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

// Enhanced IdeasPage component with premium styling and mobile responsiveness
function IdeasPage() {
  const mockIdeas = [
    {
      id: 1,
      title: "Transformarea salonului tău de unghii",
      description: "O serie de postări care să arate procesul de transformare al unui salon de unghii, de la concept la realitate.",
      platform: "Instagram",
      category: "Beauty & Lifestyle",
      engagement: "8.5K"
    },
    {
      id: 2,
      title: "Behind the scenes - Procesul de creare",
      description: "Postări care să dezvăluie procesul din spatele creării design-urilor unice pentru unghii.",
      platform: "TikTok",
      category: "Educational",
      engagement: "12.3K"
    },
    {
      id: 3,
      title: "Tipuri pentru îngrijirea unghiilor",
      description: "Conținut educațional cu sfaturi practice pentru îngrijirea unghiilor acasă.",
      platform: "Instagram",
      category: "Tips & Tricks",
      engagement: "6.7K"
    },
    {
      id: 4,
      title: "Noua colecție de design-uri",
      description: "Lansarea unei colecții noi de design-uri pentru unghii, inspirate din tendințele actuale.",
      platform: "Facebook",
      category: "Product Launch",
      engagement: "4.2K"
    },
    {
      id: 5,
      title: "Client Spotlight - Transformări incredibile",
      description: "Serie de postări care să pună în evidență transformările incredibile ale clienților.",
      platform: "Instagram",
      category: "Testimonials",
      engagement: "9.1K"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Idei postări</h1>
          <p className="text-sm sm:text-base text-gray-600">Descoperă conținut nou și captivant pentru social media</p>
        </div>
        <button className="gradient-primary text-white px-4 py-3 sm:px-6 lg:px-8 lg:py-4 rounded-xl hover-lift shadow-premium flex items-center justify-center space-x-2 font-medium text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Generează idei noi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {mockIdeas.map((idea) => (
          <div key={idea.id} className="card-glass rounded-xl p-4 sm:p-6 shadow-premium hover-lift transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium rounded-full">
                {idea.platform}
              </span>
              <span className="text-xs text-gray-500 font-medium">{idea.engagement} engagement</span>
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {idea.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
              {idea.description}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full self-start">
                {idea.category}
              </span>
              <button className="gradient-primary text-white px-3 sm:px-4 py-2 rounded-lg hover-lift shadow-premium text-sm font-medium transition-all duration-200">
                Adaugă în calendar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced CaptionsPage component with premium styling and mobile responsiveness
function CaptionsPage() {
  const mockCaptions = [
    {
      id: 1,
      caption: "✨ Descoperă magia transformării! La salonul nostru, fiecare detaliu contează și fiecare client este special. Programează-ți vizita și lasă-ne să îți facem ziua mai frumoasă! 💫 #BeautyTransformation #LocalBusiness #Bucuresti #Romania #SmallBusiness #SupportLocal",
      platform: "Instagram",
      length: 280,
      category: "Promotional"
    },
    {
      id: 2,
      caption: "🎨 Behind the scenes: Procesul nostru de creare a design-urilor unice pentru unghii. De la inspirație la realizare, fiecare pas este important! Swipe pentru a vedea transformarea completă 👆 #BehindTheScenes #NailArt #CreativeProcess #BucurestiNails",
      platform: "Instagram",
      length: 245,
      category: "Behind the Scenes"
    },
    {
      id: 3,
      caption: "💡 Tip de la expert: Pentru unghii sănătoase și frumoase, hidratează-le zilnic cu ulei de unghii și evită să le muști. Micile gesturi fac diferența! #NailCare #BeautyTips #HealthyNails #ExpertAdvice #BeautyRoutine",
      platform: "Facebook",
      length: 198,
      category: "Educational"
    },
    {
      id: 4,
      caption: "🔥 NOUA COLECȚIE ESTE AICI! Design-uri inspirate din cele mai noi tendințe, perfecte pentru orice ocazie. Care îți place cel mai mult? Comentează mai jos! 👇 #NewCollection #NailDesign #Trending #FashionNails #BucurestiBeauty",
      platform: "Instagram",
      length: 267,
      category: "Product Launch"
    },
    {
      id: 5,
      caption: "👑 CLIENT SPOTLIGHT: Transformarea incredibilă a Mariei! De la unghii simple la o operă de artă. Rezultatul vorbește de la sine! Mulțumim pentru încredere! ❤️ #ClientSpotlight #Transformation #NailArt #BeforeAfter #HappyClient #BucurestiNails",
      platform: "Instagram",
      length: 289,
      category: "Testimonial"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Generează text captivant</h1>
          <p className="text-sm sm:text-base text-gray-600">Caption-uri optimizate pentru fiecare platformă social media</p>
        </div>
        <button className="gradient-primary text-white px-4 py-3 sm:px-6 lg:px-8 lg:py-4 rounded-xl hover-lift shadow-premium flex items-center justify-center space-x-2 font-medium text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Generează caption</span>
        </button>
      </div>

      <div className="space-y-4">
        {mockCaptions.map((caption) => (
          <div key={caption.id} className="card-glass rounded-xl p-4 sm:p-6 shadow-premium hover-lift transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full">
                  {caption.platform}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {caption.category}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">{caption.length} caractere</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-white/20">
              <p className="text-sm sm:text-base text-gray-900 whitespace-pre-line leading-relaxed">
                {caption.caption}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-50/50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-50/50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
              <button className="gradient-primary text-white px-3 sm:px-4 py-2 rounded-lg hover-lift shadow-premium text-sm font-medium transition-all duration-200">
                Folosește caption-ul
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced HashtagsPage component with premium styling and mobile responsiveness
function HashtagsPage() {
  const hashtagCategories = [
    {
      id: 1,
      name: "Beauty & Nails",
      hashtags: [
        "#BeautyTransformation", "#NailArt", "#NailDesign", "#BeautyTips", 
        "#NailCare", "#BeautyRoutine", "#NailInspiration", "#BeautyGoals"
      ]
    },
    {
      id: 2,
      name: "Business & Local",
      hashtags: [
        "#LocalBusiness", "#SmallBusiness", "#SupportLocal", "#Bucuresti", 
        "#Romania", "#Entrepreneur", "#BusinessOwner", "#LocalShop"
      ]
    },
    {
      id: 3,
      name: "Lifestyle & Fashion",
      hashtags: [
        "#Lifestyle", "#Fashion", "#Style", "#Trending", "#FashionNails", 
        "#LifestyleBlogger", "#FashionInspiration", "#TrendyNails"
      ]
    },
    {
      id: 4,
      name: "Educational & Tips",
      hashtags: [
        "#BeautyTips", "#NailCareTips", "#ExpertAdvice", "#BeautyEducation", 
        "#NailTutorial", "#BeautyHacks", "#NailCareRoutine", "#BeautyExpert"
      ]
    },
    {
      id: 5,
      name: "Client & Testimonials",
      hashtags: [
        "#ClientSpotlight", "#HappyClient", "#BeforeAfter", "#Transformation", 
        "#Testimonial", "#ClientReview", "#SatisfiedCustomer", "#Results"
      ]
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Hashtag-uri</h1>
          <p className="text-sm sm:text-base text-gray-600">Optimizează vizibilitatea cu hashtag-uri relevante</p>
        </div>
        <button className="gradient-primary text-white px-4 py-3 sm:px-6 lg:px-8 lg:py-4 rounded-xl hover-lift shadow-premium flex items-center justify-center space-x-2 font-medium text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Generează hashtag-uri</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {hashtagCategories.map((category) => (
          <div key={category.id} className="card-glass rounded-xl p-4 sm:p-6 shadow-premium hover-lift transition-all duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              {category.name}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {category.hashtags.map((hashtag, index) => (
                <span 
                  key={index} 
                  className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm text-purple-300 rounded-lg text-xs sm:text-sm font-medium border border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 cursor-pointer"
                >
                  {hashtag}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-xs text-gray-500">
                {category.hashtags.length} hashtag-uri
              </span>
              <button className="gradient-primary text-white px-3 sm:px-4 py-2 rounded-lg hover-lift shadow-premium text-sm font-medium transition-all duration-200">
                Copiază toate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 