import React from 'react';

export default function BulkUploadBanner({ fileCount }) {
  return (
    <div className="mb-6 bg-gradient-to-r from-indigo/10 to-violet/10 dark:from-indigo/20 dark:to-violet/20 border border-indigo/30 dark:border-indigo/50 rounded-lg p-4 flex items-center gap-3 glow">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo">
          <svg className="h-5 w-5 text-white spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-indigo dark:text-indigo-400">
          Upload in progress — processing {fileCount} files in background
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">You'll receive a notification when complete</p>
      </div>
    </div>
  );
}
