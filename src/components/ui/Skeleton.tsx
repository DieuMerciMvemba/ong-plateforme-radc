import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';

  if (variant === 'text') {
    if (lines > 1) {
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`${baseClasses} h-4 rounded`}
              style={{
                width: index === lines - 1 ? '60%' : '100%',
                height: height || '1rem'
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        className={`${baseClasses} h-4 rounded ${className}`}
        style={{
          width: width || '100%',
          height: height || '1rem'
        }}
      />
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={`${baseClasses} rounded-full ${className}`}
        style={{
          width: width || '2.5rem',
          height: height || '2.5rem'
        }}
      />
    );
  }

  // Rectangular (default)
  return (
    <div
      className={`${baseClasses} rounded ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem'
      }}
    />
  );
};

// Skeleton components spécialisés
export const ArticleCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    {/* Image */}
    <div className="h-40 bg-gray-200" />

    <div className="p-5">
      {/* Catégorie */}
      <Skeleton variant="rectangular" width="80px" height="24px" className="mb-3" />

      {/* Titre */}
      <Skeleton variant="text" lines={2} className="mb-2" />

      {/* Excerpt */}
      <Skeleton variant="text" lines={3} className="mb-4" />

      {/* Métadonnées */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" width="16px" height="16px" />
          <Skeleton variant="rectangular" width="60px" height="16px" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" width="16px" height="16px" />
          <Skeleton variant="rectangular" width="50px" height="16px" />
        </div>
      </div>

      {/* Bouton */}
      <Skeleton variant="rectangular" width="120px" height="36px" />
    </div>
  </div>
);

export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
    <div className="p-5">
      <div className="flex items-center">
        <Skeleton variant="circular" width="24px" height="24px" className="mr-5" />
        <div className="flex-1">
          <Skeleton variant="text" width="120px" className="mb-2" />
          <Skeleton variant="text" width="60px" />
        </div>
      </div>
    </div>
    <div className="bg-gray-50 px-5 py-3">
      <Skeleton variant="text" width="100px" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
    {/* Header */}
    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width="100px" />
        ))}
      </div>
    </div>

    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex items-center">
                {colIndex === 0 && (
                  <Skeleton variant="circular" width="32px" height="32px" className="mr-3" />
                )}
                <Skeleton variant="text" width={colIndex === 0 ? '120px' : '80px'} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
