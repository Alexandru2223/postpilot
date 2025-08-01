'use client';

import { useState } from 'react';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCalendar?: (post: {
    id: number;
    title: string;
    caption: string;
    hashtags: string;
    platform: string;
    time: string;
    status: 'scheduled' | 'draft' | 'published';
    date: string;
    postType: 'normal' | 'reel';
  }) => void; // New prop for adding to calendar
}

interface GeneratedContent {
  title: string;
  caption: string;
  hashtags: string[];
  videoScript?: string;
  videoIdeas?: string[];
}

export default function AddPostModal({ isOpen, onClose, onAddToCalendar }: AddPostModalProps) {
  const [businessDescription, setBusinessDescription] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [postType, setPostType] = useState<'normal' | 'reel'>('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const platforms = ['Instagram', 'Facebook', 'TikTok'];

  const handleGenerate = async () => {
    if (!businessDescription.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (postType === 'normal') {
      // Generate normal post content
      const mockContent = {
        title: `Transformarea ${businessDescription} - Ghid complet`,
        caption: `✨ Descoperă secretele pentru a transforma ${businessDescription} într-un business de succes!\n\n💡 Sfaturi practice și strategii testate\n🎯 Rezultate garantate\n\n#${businessDescription.replace(/\s+/g, '')} #business #success #${platform.toLowerCase()}`,
        hashtags: [
          `#${businessDescription.replace(/\s+/g, '')}`,
          '#business',
          '#success',
          `#${platform.toLowerCase()}`,
          '#growth',
          '#strategy'
        ]
      };
      setGeneratedContent(mockContent);
    } else {
      // Generate reel/video content
      const videoIdeas = [
        `"Înainte și după" - Arată transformarea ${businessDescription}`,
        `"Behind the scenes" - Procesul de creare ${businessDescription}`,
        `"5 sfaturi rapide" pentru ${businessDescription}`,
        `"Povestea mea" - Cum am început cu ${businessDescription}`,
        `"Q&A" - Întrebări frecvente despre ${businessDescription}`,
        `"Tutorial pas cu pas" - Cum să faci ${businessDescription}`,
        `"Mistake Monday" - Greșeli comune în ${businessDescription}`,
        `"Tip Tuesday" - Sfaturi pentru ${businessDescription}`,
        `"Transformation Thursday" - Rezultate ${businessDescription}`,
        `"Weekend vibes" - Relaxare și ${businessDescription}`
      ];
      
      const videoScript = `🎬 SCRIPT VIDEO: ${businessDescription.toUpperCase()}

📱 INTRO (0-3 secunde):
"Bună! Astăzi îți arăt cum să transformi ${businessDescription} într-un business de succes!"

🎯 MAIN CONTENT (3-15 secunde):
• Arată procesul pas cu pas
• Demonstrează rezultatele
• Împărtășește sfaturi practice

💡 TIPURI VIZUALE:
• Folosește text overlay pentru puncte cheie
• Adaugă emoji-uri pentru engagement
• Menține ritmul rapid și dinamic

🎬 CALL TO ACTION (15-20 secunde):
"Urmărește pentru mai multe sfaturi despre ${businessDescription}!"

#${businessDescription.replace(/\s+/g, '')} #video #reel #${platform.toLowerCase()} #business #success`;

      const mockContent = {
        title: `🎬 Video: ${businessDescription} - Transformare completă`,
        caption: `🎬 Noul meu video despre ${businessDescription}!\n\n✨ Îți arăt pas cu pas cum să transformi ${businessDescription} într-un business de succes\n\n🎯 Rezultate garantate în doar câteva săptămâni!\n\n📱 Urmărește pentru mai multe sfaturi practice\n\n#${businessDescription.replace(/\s+/g, '')} #video #reel #${platform.toLowerCase()} #business #success`,
        hashtags: [
          `#${businessDescription.replace(/\s+/g, '')}`,
          '#video',
          '#reel',
          `#${platform.toLowerCase()}`,
          '#business',
          '#success',
          '#transformation',
          '#tips'
        ],
        videoScript: videoScript,
        videoIdeas: videoIdeas
      };
      setGeneratedContent(mockContent);
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleAddToCalendar = async () => {
    if (!generatedContent || !selectedDate) return;
    
    setIsAddingToCalendar(true);
    
    // Simulate adding to calendar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create the new post object
    const newPost = {
      id: Date.now(), // Generate unique ID
      title: generatedContent.title,
      caption: generatedContent.caption,
      hashtags: generatedContent.hashtags.join(' '),
      platform: platform,
      time: selectedTime,
      status: 'scheduled' as const,
      date: selectedDate,
      postType: postType
    };
    
    // Call the parent function to add to calendar
    if (onAddToCalendar) {
      console.log('AddPostModal: Calling onAddToCalendar with:', newPost);
      onAddToCalendar(newPost);
    }
    
    // Log for debugging
    console.log('AddPostModal: Adding to calendar:', newPost);
    
    // Reset form and close modal
    setBusinessDescription('');
    setPlatform('Instagram');
    setGeneratedContent(null);
    setSelectedDate('');
    setSelectedTime('10:00');
    setIsAddingToCalendar(false);
    onClose();
  };

  // Removed unused getCurrentDate function

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to ensure 24-hour format
  const formatTime24Hour = (time: string) => {
    if (!time) return '10:00';
    // Ensure the time is in 24-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="glass rounded-2xl shadow-premium-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Adaugă postare AI</h2>
              <p className="text-sm sm:text-base text-gray-600">Generează conținut captivant cu ajutorul AI</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Descrie afacerea ta</label>
              <input 
                type="text" 
                id="business" 
                value={businessDescription} 
                onChange={(e) => setBusinessDescription(e.target.value)} 
                placeholder="ex: salon unghii, București" 
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Platformă</label>
              <select 
                id="platform" 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)} 
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg bg-white/10 backdrop-blur-sm text-white"
              >
                {platforms.map((p) => (
                  <option key={p} value={p} className="bg-gray-800 text-white">{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Tip postare</label>
              <select 
                id="postType" 
                value={postType} 
                onChange={(e) => setPostType(e.target.value as 'normal' | 'reel')} 
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg bg-white/10 backdrop-blur-sm text-white"
              >
                <option value="normal" className="bg-gray-800 text-white">📝 Postare normală</option>
                <option value="reel" className="bg-gray-800 text-white">🎬 Reel/Video</option>
              </select>
            </div>
            <button 
              onClick={handleGenerate} 
              disabled={!businessDescription.trim() || isGenerating} 
              className="w-full gradient-primary text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover-lift shadow-premium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 font-medium text-base sm:text-lg"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Se generează...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generează idee</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-4 sm:space-y-6">
              {/* Schedule Section */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 sm:p-6 border border-indigo-500/20 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Programează postarea
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                    <input
                      type="date"
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ora</label>
                    <div className="flex space-x-2">
                      <select
                        value={selectedTime.split(':')[0]}
                        onChange={(e) => {
                          const [_, minutes] = selectedTime.split(':');
                          setSelectedTime(`${e.target.value}:${minutes}`);
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
                        value={selectedTime.split(':')[1]}
                        onChange={(e) => {
                          const [hours, _] = selectedTime.split(':');
                          setSelectedTime(`${hours}:${e.target.value}`);
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
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 sm:p-6 border border-blue-500/20 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Titlu generat
                </h3>
                <p className="text-white text-base sm:text-lg mb-3 sm:mb-4 font-medium">{generatedContent.title}</p>
                <button 
                  onClick={() => copyToClipboard(generatedContent.title)} 
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiază titlu
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 sm:p-6 border border-green-500/20 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Caption
                </h3>
                <div className="bg-black/20 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-white/10">
                  <p className="text-white whitespace-pre-line mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{generatedContent.caption}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(generatedContent.caption)} 
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiază caption
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 sm:p-6 border border-purple-500/20 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Hashtag-uri
                </h3>
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <span key={index} className="px-2 sm:px-3 py-1 sm:py-2 bg-black/30 backdrop-blur-sm text-purple-300 rounded-lg text-xs sm:text-sm font-medium border border-purple-500/30 hover:bg-purple-500/20 transition-colors">
                      {hashtag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => copyToClipboard(generatedContent.hashtags.join(' '))} 
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiază toate hashtag-urile
                </button>
              </div>

              {/* Video Script - Only for Reels */}
              {postType === 'reel' && generatedContent.videoScript && (
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4 sm:p-6 border border-orange-500/20 backdrop-blur-sm">
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Script Video
                  </h3>
                  <div className="bg-black/20 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-white/10">
                    <p className="text-white whitespace-pre-line mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base font-mono">{generatedContent.videoScript}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(generatedContent.videoScript!)} 
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiază script-ul
                  </button>
                </div>
              )}

              {/* Video Ideas - Only for Reels */}
              {postType === 'reel' && generatedContent.videoIdeas && (
                <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl p-4 sm:p-6 border border-teal-500/20 backdrop-blur-sm">
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Idei Video
                  </h3>
                  <div className="space-y-2 mb-3 sm:mb-4">
                    {generatedContent.videoIdeas.map((idea, index) => (
                      <div key={index} className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <p className="text-white text-sm sm:text-base">{idea}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(generatedContent.videoIdeas!.join('\n'))} 
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiază toate ideile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-200/50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
          >
            Închide
          </button>
          {generatedContent && (
            <button 
              onClick={handleAddToCalendar}
              disabled={!selectedDate || isAddingToCalendar}
              className="gradient-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover-lift shadow-premium font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isAddingToCalendar ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Se adaugă...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Adaugă în calendar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 