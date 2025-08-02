import { BusinessData } from '../lib/useOnboarding';

interface BusinessInfoCardProps {
  businessData: BusinessData;
}

export default function BusinessInfoCard({ businessData }: BusinessInfoCardProps) {
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

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-premium border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center shadow-premium">
            <span className="text-xl font-bold text-white">
              {getBusinessTypeIcon(businessData.businessType)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{businessData.businessName}</h3>
            <p className="text-sm text-gray-300 flex items-center">
              <span className="mr-2">{getIndustryIcon(businessData.industry)}</span>
              {businessData.industry}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
            </svg>
            <span className="text-xs font-medium text-purple-400">Social Media</span>
          </div>
          <p className="text-sm font-semibold text-white">
            {businessData.socialMediaPlatforms.join(', ')}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-green-400">Obiectiv principal</span>
          </div>
          <p className="text-sm font-semibold text-white line-clamp-2">
            {businessData.goals[0] || 'Nu sunt definite'}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs font-medium text-orange-400">Provocare principală</span>
          </div>
          <p className="text-sm font-semibold text-white line-clamp-2">
            {businessData.challenges[0] || 'Nu sunt identificate'}
          </p>
        </div>
      </div>
    </div>
  );
} 