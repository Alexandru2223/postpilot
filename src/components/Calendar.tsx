'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import BusinessInfoCard from './BusinessInfoCard';
import { BusinessData } from '../lib/useOnboarding';

interface CalendarProps {
  onAddPost: () => void;
  businessData?: BusinessData | null;
}

interface ScheduledPost {
  id: number;
  title: string;
  caption: string;
  hashtags: string;
  platform: string;
  time: string;
  status: 'scheduled' | 'draft' | 'published';
  date: string; // YYYY-MM-DD format
  postType: 'normal' | 'reel';
}

const Calendar = forwardRef<{ handleAddToCalendar: (post: ScheduledPost) => void }, CalendarProps>(({ onAddPost, businessData }, ref) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isPostDetailsModalOpen, setIsPostDetailsModalOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    caption: '',
    hashtags: '',
    platform: 'Instagram',
    time: '',
    status: 'scheduled' as const,
    date: '',
    postType: 'normal' as const
  });

  // Mock data with dates - now using state to allow updates
  const [mockScheduledPosts, setMockScheduledPosts] = useState<ScheduledPost[]>(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    // Helper function to create date string
    const createDateStr = (daysOffset: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() + daysOffset);
      return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return [
      // Today
      {
        id: 1,
        title: "Transformarea salonului tău de unghii",
        caption: "Descoperă cum să transformi salonul tău într-un spațiu modern și atractiv! ✨",
        hashtags: "#unghii #salon #transformare #beauty #nailart",
        platform: "Instagram",
        time: "10:00",
        status: 'scheduled' as const,
        date: createDateStr(0),
        postType: 'normal'
      },
      {
        id: 2,
        title: "Behind the scenes - Procesul de creare",
        caption: "Vezi cum se nasc designurile noastre unice! 🎨",
        hashtags: "#behindthescenes #creare #unghii #naildesign",
        platform: "Facebook",
        time: "15:30",
        status: 'draft' as const,
        date: createDateStr(0),
        postType: 'reel'
      },
      {
        id: 3,
        title: "Tutorial: Design floral elegant",
        caption: "Învață să creezi acest design floral elegant pas cu pas! 🌸",
        hashtags: "#tutorial #floral #elegant #nailart",
        platform: "TikTok",
        time: "18:00",
        status: 'scheduled' as const,
        date: createDateStr(0),
        postType: 'reel'
      },
      
      // Tomorrow
      {
        id: 4,
        title: "Tipuri pentru îngrijirea unghiilor",
        caption: "5 sfaturi esențiale pentru unghii sănătoase și frumoase! 💅",
        hashtags: "#ingrijire #unghii #tips #beauty #health",
        platform: "Instagram",
        time: "12:00",
        status: 'scheduled' as const,
        date: createDateStr(1),
        postType: 'normal'
      },
      {
        id: 5,
        title: "Client Spotlight - Maria",
        caption: "Rezultatul incredibil pentru Maria! Vezi transformarea completă! 👏",
        hashtags: "#clientspotlight #maria #transformare #rezultate",
        platform: "Instagram",
        time: "14:30",
        status: 'draft' as const,
        date: createDateStr(1),
        postType: 'normal'
      },
      
      // Day 3
      {
        id: 6,
        title: "Noua colecție de design-uri",
        caption: "Introducem colecția noastră de primăvară! 🌺",
        hashtags: "#colectie #design #nou #primavara #spring",
        platform: "Instagram",
        time: "11:00",
        status: 'scheduled' as const,
        date: createDateStr(2),
        postType: 'normal'
      },
      {
        id: 7,
        title: "Q&A cu specialistul nostru",
        caption: "Întrebări și răspunsuri cu specialistul nostru în nail art! 💬",
        hashtags: "#qa #specialist #nailart #intrebari",
        platform: "Facebook",
        time: "16:00",
        status: 'draft' as const,
        date: createDateStr(2),
        postType: 'reel'
      },
      
      // Day 4
      {
        id: 8,
        title: "Design geometric modern",
        caption: "Design geometric modern pentru femeile care iubesc stilul minimalist! ⬜",
        hashtags: "#geometric #modern #minimalist #style",
        platform: "Instagram",
        time: "13:00",
        status: 'scheduled' as const,
        date: createDateStr(3),
        postType: 'normal'
      },
      
      // Day 5
      {
        id: 9,
        title: "Client Spotlight - Transformări incredibile",
        caption: "Transformări incredibile care vor inspira! ✨",
        hashtags: "#clientspotlight #transformare #incredibil #inspiratie",
        platform: "Instagram",
        time: "10:30",
        status: 'published' as const,
        date: createDateStr(4),
        postType: 'normal'
      },
      {
        id: 10,
        title: "Tutorial: Ombre effect",
        caption: "Învață să creezi efectul ombre perfect! 🌈",
        hashtags: "#tutorial #ombre #effect #nailart",
        platform: "TikTok",
        time: "19:00",
        status: 'scheduled' as const,
        date: createDateStr(4),
        postType: 'reel'
      },
      
      // Day 6
      {
        id: 11,
        title: "Produsele noastre favorite",
        caption: "Produsele pe care le folosim în fiecare zi! 🛍️",
        hashtags: "#produse #favorite #nailart #tools",
        platform: "Instagram",
        time: "15:00",
        status: 'draft' as const,
        date: createDateStr(5),
        postType: 'normal'
      },
      
      // Day 7
      {
        id: 12,
        title: "Weekend vibes - Design relaxant",
        caption: "Design perfect pentru weekend! 🌅",
        hashtags: "#weekend #vibes #relaxant #design",
        platform: "Instagram",
        time: "12:30",
        status: 'scheduled' as const,
        date: createDateStr(6),
        postType: 'normal'
      },
      
      // Day 8
      {
        id: 13,
        title: "Mistake Monday - Greșeli comune",
        caption: "Greșelile pe care le facem toți și cum să le evităm! ❌",
        hashtags: "#mistakemonday #greseli #comune #tips",
        platform: "Facebook",
        time: "09:00",
        status: 'scheduled' as const,
        date: createDateStr(7),
        postType: 'reel'
      },
      
      // Day 9
      {
        id: 14,
        title: "Tip Tuesday - Sfaturi practice",
        caption: "Sfaturi practice pentru unghii perfecte! 💡",
        hashtags: "#tiptuesday #sfaturi #practice #perfect",
        platform: "Instagram",
        time: "14:00",
        status: 'draft' as const,
        date: createDateStr(8),
        postType: 'normal'
      },
      
      // Day 10
      {
        id: 15,
        title: "Transformation Thursday",
        caption: "Transformări spectaculoase în fiecare joi! 🔥",
        hashtags: "#transformationthursday #spectaculos #transformare",
        platform: "Instagram",
        time: "11:30",
        status: 'scheduled' as const,
        date: createDateStr(9),
        postType: 'normal'
      },
      
      // Day 12
      {
        id: 16,
        title: "Design pentru ocazii speciale",
        caption: "Designuri perfecte pentru ocazii speciale! 🎉",
        hashtags: "#ocaziispeciale #design #perfect #celebration",
        platform: "Instagram",
        time: "16:30",
        status: 'scheduled' as const,
        date: createDateStr(11),
        postType: 'normal'
      },
      
      // Day 14
      {
        id: 17,
        title: "Client Spotlight - Ana",
        caption: "Ana și transformarea ei incredibilă! 👑",
        hashtags: "#clientspotlight #ana #transformare #incredibil",
        platform: "Facebook",
        time: "13:30",
        status: 'published' as const,
        date: createDateStr(13),
        postType: 'normal'
      },
      
      // Day 16
      {
        id: 18,
        title: "Tutorial: French manicure modern",
        caption: "French manicure cu un twist modern! 🇫🇷",
        hashtags: "#tutorial #french #manicure #modern",
        platform: "TikTok",
        time: "17:00",
        status: 'scheduled' as const,
        date: createDateStr(15),
        postType: 'reel'
      },
      
      // Day 18
      {
        id: 19,
        title: "Designuri pentru toate vârstele",
        caption: "Designuri care se potrivesc oricărei vârste! 👵👩👧",
        hashtags: "#designuri #varste #potrivit #fiecare",
        platform: "Instagram",
        time: "10:00",
        status: 'draft' as const,
        date: createDateStr(17),
        postType: 'normal'
      },
      
      // Day 20
      {
        id: 20,
        title: "Behind the scenes - Ziua tipică",
        caption: "Vezi cum arată o zi tipică în salonul nostru! 📸",
        hashtags: "#behindthescenes #ziatipica #salon #vlog",
        platform: "Instagram",
        time: "15:00",
        status: 'scheduled' as const,
        date: createDateStr(19),
        postType: 'reel'
      },
      
      // Day 22
      {
        id: 21,
        title: "Client Spotlight - Elena",
        caption: "Elena și designul ei unic! ✨",
        hashtags: "#clientspotlight #elena #design #unic",
        platform: "Instagram",
        time: "12:00",
        status: 'scheduled' as const,
        date: createDateStr(21),
        postType: 'normal'
      },
      
      // Day 25
      {
        id: 22,
        title: "Tutorial: Design cu strasuri",
        caption: "Cum să adaugi strasuri pentru un efect wow! 💎",
        hashtags: "#tutorial #strasuri #wow #effect",
        platform: "TikTok",
        time: "18:30",
        status: 'draft' as const,
        date: createDateStr(24),
        postType: 'reel'
      },
      
      // Day 28
      {
        id: 23,
        title: "Colecția de toamnă",
        caption: "Introducem colecția noastră de toamnă! 🍂",
        hashtags: "#colectie #toamna #autumn #nou",
        platform: "Instagram",
        time: "14:30",
        status: 'scheduled' as const,
        date: createDateStr(27),
        postType: 'normal'
      },
      
      // Day 30
      {
        id: 24,
        title: "Month in review",
        caption: "Săptămâna în review - cele mai populare designuri! 📊",
        hashtags: "#monthinreview #popular #designuri #review",
        platform: "Facebook",
        time: "11:00",
        status: 'scheduled' as const,
        date: createDateStr(29),
        postType: 'normal'
      }
    ];
  });

  // Function to add new post to calendar
  const handleAddToCalendar = (newPost: ScheduledPost) => {
    console.log('Calendar: Adding new post:', newPost);
    setMockScheduledPosts(prevPosts => {
      const updatedPosts = [...prevPosts, newPost];
      console.log('Calendar: Updated posts:', updatedPosts);
      return updatedPosts;
    });
  };

  // Function to delete post
  const handleDeletePost = (postId: number) => {
    setMockScheduledPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      handleDeletePost(postToDelete);
      setShowDeleteConfirmation(false);
      setPostToDelete(null);
      if (selectedPost && selectedPost.id === postToDelete) {
        handleClosePostDetails();
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPostToDelete(null);
  };

  // Function to edit post
  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      caption: post.caption,
      hashtags: post.hashtags,
      platform: post.platform,
      time: post.time,
      status: post.status,
      date: post.date,
      postType: post.postType
    });
    setIsEditModalOpen(true);
  };

  // Function to save edited post
  const handleSaveEdit = () => {
    if (!editingPost) return;
    
    setMockScheduledPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...editForm }
          : post
      )
    );
    
    setIsEditModalOpen(false);
    setEditingPost(null);
    setEditForm({
      title: '',
      caption: '',
      hashtags: '',
      platform: 'Instagram',
      time: '',
      status: 'scheduled',
      date: '',
      postType: 'normal'
    });
  };

  // Function to cancel edit
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
    setEditForm({
      title: '',
      caption: '',
      hashtags: '',
      platform: 'Instagram',
      time: '',
      status: 'scheduled',
      date: '',
      postType: 'normal'
    });
  };

  const handleViewPostDetails = (post: ScheduledPost) => {
    setSelectedPost(post);
    setIsPostDetailsModalOpen(true);
  };

  const handleClosePostDetails = () => {
    setIsPostDetailsModalOpen(false);
    setSelectedPost(null);
  };

  const handleCopyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${type} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleAddToCalendar
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'draft':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'published':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return '📸';
      case 'Facebook':
        return '📘';
      case 'TikTok':
        return '🎵';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'from-pink-500 to-purple-600';
      case 'Facebook':
        return 'from-blue-500 to-blue-600';
      case 'TikTok':
        return 'from-black to-gray-800';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Calendar navigation functions
  const goToPreviousPeriod = () => {
    if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const goToNextPeriod = () => {
    if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Generate calendar days based on view mode
  const generateCalendarDays = () => {
    if (viewMode === 'week') {
      // Generate current week (7 days starting from Monday)
      const today = new Date(currentDate);
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday is 1, Sunday is 0
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        days.push(day);
      }
      return days;
    } else {
      // Generate month view (6 weeks)
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      // Fix: Use the same logic as week view to ensure consistency
      const dayOfWeek = firstDay.getDay();
      startDate.setDate(firstDay.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
      
      const days = [];
      const currentDateObj = new Date(startDate);
      
      // Generate 6 weeks (42 days) to ensure we cover the entire month
      for (let i = 0; i < 42; i++) {
        days.push(new Date(currentDateObj));
        currentDateObj.setDate(currentDateObj.getDate() + 1);
      }
      
      return days;
    }
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getPostsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return mockScheduledPosts.filter(post => post.date === dateStr);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentPeriod = (date: Date) => {
    if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      const dayOfWeek = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return date >= weekStart && date <= weekEnd;
    } else {
      // For month view, check if the date is in the current month
      return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
    }
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

  const getPeriodTitle = () => {
    if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      const dayOfWeek = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${monthNames[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
      } else {
        return `${weekStart.getDate()} ${monthNames[weekStart.getMonth()]} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]} ${weekStart.getFullYear()}`;
      }
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Calendar de postări</h1>
          <p className="text-sm sm:text-base text-gray-600">Planifică și organizează conținutul social media</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={goToToday}
            className="px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
          >
            Astăzi
          </button>
          <button
            onClick={onAddPost}
            className="gradient-primary text-white px-4 py-3 sm:px-6 lg:px-8 lg:py-4 rounded-xl hover-lift shadow-premium flex items-center justify-center space-x-2 font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Adaugă postare</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="card-glass rounded-xl p-3 sm:p-4 lg:p-6 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-4">
            <button
              onClick={goToPreviousPeriod}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center sm:text-left">
              {getPeriodTitle()}
            </h2>
            <button
              onClick={goToNextPeriod}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                viewMode === 'week' 
                  ? 'gradient-primary text-white shadow-premium' 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Săptămâna
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                viewMode === 'month' 
                  ? 'gradient-primary text-white shadow-premium' 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Luna
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          {/* Mobile: Single Day View */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const prevDay = new Date(selectedDate || currentDate);
                  prevDay.setDate(prevDay.getDate() - 1);
                  setSelectedDate(prevDay);
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">
                  {(selectedDate || currentDate).toLocaleDateString('ro-RO', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h3>
                <p className="text-sm text-gray-300">
                  {(selectedDate || currentDate).getFullYear()}
                </p>
              </div>
              <button
                onClick={() => {
                  const nextDay = new Date(selectedDate || currentDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setSelectedDate(nextDay);
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Single Day */}
            <div className="border border-gray-200/50 rounded-lg p-4 bg-gray-800/80 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-lg font-bold ${
                  isToday(selectedDate || currentDate) ? 'text-blue-400' : 'text-white'
                }`}>
                  {(selectedDate || currentDate).getDate()}
                </span>
                {getPostsForDate(selectedDate || currentDate).length > 0 && (
                  <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    {getPostsForDate(selectedDate || currentDate).length} postări
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {getPostsForDate(selectedDate || currentDate).map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-700/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 hover-lift cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPostDetails(post);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`flex items-center space-x-2 px-2 py-1 rounded-full bg-gradient-to-r ${getPlatformColor(post.platform)} text-white text-xs font-medium`}>
                        <span>{getPlatformIcon(post.platform)}</span>
                        <span>{post.platform}</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        {post.postType === 'reel' && (
                          <span className="text-sm text-orange-400 font-medium">🎬</span>
                        )}
                        <span className="text-sm text-gray-400 font-medium">{post.time}</span>
                      </div>
                    </div>
                    <h4 className="font-medium text-white line-clamp-2 group-hover:text-blue-400 transition-colors text-sm mb-2">
                      {post.title}
                    </h4>
                    {post.caption && (
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                        {post.caption}
                      </p>
                    )}
                    {post.hashtags && (
                      <p className="text-xs text-blue-400 mb-2">
                        {post.hashtags}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(post.status)}`}>
                        {post.status === 'scheduled' ? 'Programat' : post.status === 'draft' ? 'Ciornă' : 'Publicat'}
                      </span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPost(post);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(post.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {getPostsForDate(selectedDate || currentDate).length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-700/80 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Fără postări în această zi</p>
                    <button 
                      onClick={onAddPost}
                      className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      + Adaugă postare
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: Full Grid View */}
          <div className="hidden sm:block">
            <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-1`}>
              {/* Day Headers */}
              {dayNames.map((dayName) => (
                <div key={dayName} className="p-2 sm:p-3 text-center">
                  <div className="text-xs sm:text-sm font-semibold text-gray-500">{dayName}</div>
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((date, index) => {
                const posts = getPostsForDate(date);
                const isCurrentPeriodDay = isCurrentPeriod(date);
                const isTodayDate = isToday(date);
                const isSelectedDate = isSelected(date);

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`${viewMode === 'week' ? 'min-h-[150px] sm:min-h-[200px]' : 'min-h-[100px] sm:min-h-[120px]'} p-1 sm:p-2 border border-gray-200/50 rounded-lg cursor-pointer transition-all duration-200 hover-lift ${
                      !isCurrentPeriodDay ? 'opacity-40' : ''
                    } ${isTodayDate ? 'ring-2 ring-blue-500/50' : ''} ${
                      isSelectedDate ? 'ring-2 ring-purple-500/50 bg-purple-50/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <span className={`text-xs sm:text-sm font-medium ${
                        isTodayDate ? 'text-blue-600 font-bold' : 
                        isSelectedDate ? 'text-purple-600 font-bold' : 
                        isCurrentPeriodDay ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {date.getDate()}
                      </span>
                      {posts.length > 0 && (
                        <span className="text-xs bg-blue-500/20 text-blue-600 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                          {posts.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {posts.slice(0, viewMode === 'week' ? 3 : 1).map((post) => (
                        <div
                          key={post.id}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-1 sm:p-2 border border-white/20 hover-lift cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPostDetails(post);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`flex items-center space-x-1 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${getPlatformColor(post.platform)} text-white text-xs font-medium`}>
                              <span className="text-xs">{getPlatformIcon(post.platform)}</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              {post.postType === 'reel' && (
                                <span className="text-xs text-orange-400 font-medium">🎬</span>
                              )}
                              <span className="text-xs text-gray-400 font-medium">{post.time}</span>
                            </div>
                          </div>
                          <h4 className={`font-medium text-gray-900 line-clamp-1 group-hover:text-blue-400 transition-colors ${viewMode === 'week' ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                            {post.title}
                          </h4>
                          <span className={`inline-block px-1 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(post.status)}`}>
                            {post.status === 'scheduled' ? 'Prog' : post.status === 'draft' ? 'Ciornă' : 'Pub'}
                          </span>
                        </div>
                      ))}
                      {posts.length > (viewMode === 'week' ? 3 : 1) && (
                        <div className="text-xs text-gray-500 text-center py-1">
                          +{posts.length - (viewMode === 'week' ? 3 : 1)} mai multe
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Details - Desktop Only */}
      {selectedDate && (
        <div className="hidden sm:block card-glass rounded-xl p-4 sm:p-6 shadow-premium">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('ro-RO', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {getPostsForDate(selectedDate).map((post) => (
              <div key={post.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover-lift">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 space-y-2 sm:space-y-0">
                  <div className={`flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${getPlatformColor(post.platform)} text-white text-xs font-medium`}>
                    <span>{getPlatformIcon(post.platform)}</span>
                    <span>{post.platform}</span>
                  </div>
                  <span className="text-sm text-gray-400 font-medium">{post.time}</span>
                </div>
                
                <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h4>
                
                {post.caption && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-3">
                    {post.caption}
                  </p>
                )}
                
                {post.hashtags && (
                  <p className="text-xs text-blue-500 mb-2 sm:mb-3">
                    {post.hashtags}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(post.status)}`}>
                    {post.status === 'scheduled' ? 'Programat' : 
                     post.status === 'draft' ? 'Ciornă' : 'Publicat'}
                  </span>
                  
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleViewPostDetails(post)}
                      className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(post.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {getPostsForDate(selectedDate).length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Fără postări în această zi</p>
                <button 
                  onClick={onAddPost}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  + Adaugă postare
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="glass rounded-2xl shadow-premium-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200/50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Editează postarea</h2>
                <button onClick={handleCancelEdit} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titlu</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                  placeholder="Introduceți titlul postării"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  value={editForm.caption}
                  onChange={(e) => setEditForm({...editForm, caption: e.target.value})}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white resize-none text-sm sm:text-base"
                  placeholder="Introduceți descrierea postării"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hashtaguri</label>
                <input
                  type="text"
                  value={editForm.hashtags}
                  onChange={(e) => setEditForm({...editForm, hashtags: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                  placeholder="#hashtag1 #hashtag2 #hashtag3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platformă</label>
                <select
                  value={editForm.platform}
                  onChange={(e) => setEditForm({...editForm, platform: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                >
                  <option value="Instagram" className="bg-gray-800 text-white">Instagram</option>
                  <option value="Facebook" className="bg-gray-800 text-white">Facebook</option>
                  <option value="TikTok" className="bg-gray-800 text-white">TikTok</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tip postare</label>
                <select
                  value={editForm.postType}
                  onChange={(e) => setEditForm({...editForm, postType: e.target.value as 'normal' | 'reel'})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                >
                  <option value="normal" className="bg-gray-800 text-white">📝 Postare normală</option>
                  <option value="reel" className="bg-gray-800 text-white">🎬 Reel/Video</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ora</label>
                  <div className="flex space-x-2">
                    <select
                      value={editForm.time.split(':')[0]}
                      onChange={(e) => {
                        const [_, minutes] = editForm.time.split(':');
                        setEditForm({...editForm, time: `${e.target.value}:${minutes}`});
                      }}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')} className="bg-gray-800 text-white">
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="flex items-center text-white text-lg sm:text-xl font-bold">:</span>
                    <select
                      value={editForm.time.split(':')[1]}
                      onChange={(e) => {
                        const [hours, _] = editForm.time.split(':');
                        setEditForm({...editForm, time: `${hours}:${e.target.value}`});
                      }}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')} className="bg-gray-800 text-white">
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value as 'scheduled' | 'draft' | 'published'})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                >
                  <option value="scheduled" className="bg-gray-800 text-white">Programat</option>
                  <option value="draft" className="bg-gray-800 text-white">Ciornă</option>
                  <option value="published" className="bg-gray-800 text-white">Publicat</option>
                </select>
              </div>

              {/* Video Script - Only for Reels */}
              {editForm.postType === 'reel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Script Video</label>
                  <textarea
                    rows={8}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white resize-none text-sm sm:text-base font-mono"
                    placeholder="🎬 SCRIPT VIDEO: [TITLU]

📱 INTRO (0-3 secunde):
'Bună! Astăzi îți arăt...'

🎯 MAIN CONTENT (3-15 secunde):
• Arată procesul pas cu pas
• Demonstrează rezultatele

💡 TIPURI VIZUALE:
• Folosește text overlay
• Adaugă emoji-uri

🎬 CALL TO ACTION (15-20 secunde):
'Urmărește pentru mai multe sfaturi!'"
                    defaultValue={`🎬 SCRIPT VIDEO: ${editForm.title.toUpperCase()}

📱 INTRO (0-3 secunde):
"Bună! Astăzi îți arăt cum să transformi ${editForm.title.split(' ').slice(2, -2).join(' ')} într-un business de succes!"

🎯 MAIN CONTENT (3-15 secunde):
• Arată procesul pas cu pas
• Demonstrează rezultatele
• Împărtășește sfaturi practice

💡 TIPURI VIZUALE:
• Folosește text overlay pentru puncte cheie
• Adaugă emoji-uri pentru engagement
• Menține ritmul rapid și dinamic

🎬 CALL TO ACTION (15-20 secunde):
"Urmărește pentru mai multe sfaturi practice!"

${editForm.hashtags}`}
                  />
                </div>
              )}

              {/* Video Ideas - Only for Reels */}
              {editForm.postType === 'reel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idei Video (una per linie)</label>
                  <textarea
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white resize-none text-sm sm:text-base"
                    placeholder="Idei pentru video..."
                    defaultValue={[
                      `"Înainte și după" - Arată transformarea ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Behind the scenes" - Procesul de creare ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"5 sfaturi rapide" pentru ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Povestea mea" - Cum am început cu ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Q&A" - Întrebări frecvente despre ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Tutorial pas cu pas" - Cum să faci ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Mistake Monday" - Greșeli comune în ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Tip Tuesday" - Sfaturi pentru ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Transformation Thursday" - Rezultate ${editForm.title.split(' ').slice(2, -2).join(' ')}`,
                      `"Weekend vibes" - Relaxare și ${editForm.title.split(' ').slice(2, -2).join(' ')}`
                    ].join('\n')}
                  />
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200/50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
              >
                Anulează
              </button>
              <button
                onClick={handleSaveEdit}
                className="gradient-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover-lift shadow-premium font-medium text-sm sm:text-base"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Details Modal */}
      {isPostDetailsModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="glass rounded-2xl shadow-premium-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200/50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Detalii Postare</h2>
                <button onClick={handleClosePostDetails} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Platform and Time */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-to-r ${getPlatformColor(selectedPost.platform)} text-white text-sm font-medium`}>
                  <span>{getPlatformIcon(selectedPost.platform)}</span>
                  <span>{selectedPost.platform}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Programat pentru</p>
                  <p className="text-lg font-bold text-gray-900">{selectedPost.time}</p>
                  <p className="text-sm text-gray-500">{new Date(selectedPost.date).toLocaleDateString('ro-RO', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedPost.status)}`}>
                  {selectedPost.status === 'scheduled' ? 'Programat' : 
                   selectedPost.status === 'draft' ? 'Ciornă' : 'Publicat'}
                </span>
              </div>

              {/* Post Type */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tip postare</span>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${
                  selectedPost.postType === 'reel' 
                    ? 'bg-orange-100 text-orange-700 border-orange-300' 
                    : 'bg-blue-100 text-blue-700 border-blue-300'
                }`}>
                  {selectedPost.postType === 'reel' ? '🎬 Reel/Video' : '📝 Postare normală'}
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titlu</label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-900 font-medium">{selectedPost.title}</p>
                  <button 
                    onClick={() => handleCopyText(selectedPost.title, 'Titlu')}
                    className="mt-2 text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copiază titlul</span>
                  </button>
                </div>
              </div>

              {/* Caption */}
              {selectedPost.caption && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedPost.caption}</p>
                    <button 
                      onClick={() => handleCopyText(selectedPost.caption, 'Caption')}
                      className="mt-2 text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copiază caption-ul</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {selectedPost.hashtags && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hashtaguri</label>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-blue-600 font-medium">{selectedPost.hashtags}</p>
                    <button 
                      onClick={() => handleCopyText(selectedPost.hashtags, 'Hashtaguri')}
                      className="mt-2 text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copiază hashtagurile</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Video Script - Only for Reels */}
              {selectedPost.postType === 'reel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Script Video</label>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-line font-mono text-sm">{`🎬 SCRIPT VIDEO: ${selectedPost.title.toUpperCase()}

📱 INTRO (0-3 secunde):
"Bună! Astăzi îți arăt cum să transformi ${selectedPost.title.split(' ').slice(2, -2).join(' ')} într-un business de succes!"

🎯 MAIN CONTENT (3-15 secunde):
• Arată procesul pas cu pas
• Demonstrează rezultatele
• Împărtășește sfaturi practice

💡 TIPURI VIZUALE:
• Folosește text overlay pentru puncte cheie
• Adaugă emoji-uri pentru engagement
• Menține ritmul rapid și dinamic

🎬 CALL TO ACTION (15-20 secunde):
"Urmărește pentru mai multe sfaturi practice!"

${selectedPost.hashtags}`}</p>
                    <button 
                      onClick={() => handleCopyText(`🎬 SCRIPT VIDEO: ${selectedPost.title.toUpperCase()}\n\n📱 INTRO (0-3 secunde):\n"Bună! Astăzi îți arăt cum să transformi ${selectedPost.title.split(' ').slice(2, -2).join(' ')} într-un business de succes!"\n\n🎯 MAIN CONTENT (3-15 secunde):\n• Arată procesul pas cu pas\n• Demonstrează rezultatele\n• Împărtășește sfaturi practice\n\n💡 TIPURI VIZUALE:\n• Folosește text overlay pentru puncte cheie\n• Adaugă emoji-uri pentru engagement\n• Menține ritmul rapid și dinamic\n\n🎬 CALL TO ACTION (15-20 secunde):\n"Urmărește pentru mai multe sfaturi practice!"\n\n${selectedPost.hashtags}`, 'Script Video')}
                      className="mt-2 text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copiază script-ul</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Video Ideas - Only for Reels */}
              {selectedPost.postType === 'reel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idei Video</label>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/20 backdrop-blur-sm">
                    <div className="space-y-2 mb-3">
                      {[
                        `"Înainte și după" - Arată transformarea ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Behind the scenes" - Procesul de creare ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"5 sfaturi rapide" pentru ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Povestea mea" - Cum am început cu ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Q&A" - Întrebări frecvente despre ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Tutorial pas cu pas" - Cum să faci ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Mistake Monday" - Greșeli comune în ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Tip Tuesday" - Sfaturi pentru ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Transformation Thursday" - Rezultate ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Weekend vibes" - Relaxare și ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`
                      ].map((idea, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-black/40 rounded-lg border border-white/20 hover:bg-black/60 transition-colors">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-white text-sm leading-relaxed flex-1">{idea}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleCopyText([
                        `"Înainte și după" - Arată transformarea ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Behind the scenes" - Procesul de creare ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"5 sfaturi rapide" pentru ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Povestea mea" - Cum am început cu ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Q&A" - Întrebări frecvente despre ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Tutorial pas cu pas" - Cum să faci ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Mistake Monday" - Greșeli comune în ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Tip Tuesday" - Sfaturi pentru ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Transformation Thursday" - Rezultate ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`,
                        `"Weekend vibes" - Relaxare și ${selectedPost.title.split(' ').slice(2, -2).join(' ')}`
                      ].join('\n'), 'Idei Video')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copiază toate ideile</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Copy All Content */}
              <div>
                <button 
                  onClick={() => {
                    const allContent = `${selectedPost.title}\n\n${selectedPost.caption}\n\n${selectedPost.hashtags}`;
                    handleCopyText(allContent, 'Toate conținuturile');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copiază tot conținutul</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200/50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  handleClosePostDetails();
                  handleEditPost(selectedPost);
                }}
                className="gradient-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover-lift shadow-premium font-medium text-sm sm:text-base flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editează</span>
              </button>
              <button
                onClick={() => handleDeleteClick(selectedPost.id)}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Șterge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="glass rounded-2xl shadow-premium-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmă ștergerea</h3>
                  <p className="text-sm text-gray-600">Această acțiune nu poate fi anulată.</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Ești sigur că vrei să ștergi această postare? Această acțiune va șterge definitiv postarea din calendar.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Anulează
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Șterge definitiv</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card-glass rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Programate</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {mockScheduledPosts.filter(post => post.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Ciorne</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {mockScheduledPosts.filter(post => post.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Publicate</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {mockScheduledPosts.filter(post => post.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Info Card */}
      {businessData && (
        <div className="mt-6">
          <BusinessInfoCard businessData={businessData} />
        </div>
      )}
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;