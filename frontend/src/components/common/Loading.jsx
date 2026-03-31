// Loading.jsx — spinner variants: page, section, inline

export const PageLoading = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-emerald-100 rounded-full" />
      <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
    </div>
    <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">{message}</p>
  </div>
);

export const SectionLoading = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative w-12 h-12">
      <div className="w-12 h-12 border-4 border-emerald-100 rounded-full" />
      <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
    </div>
    <p className="mt-3 text-sm text-gray-400">{message}</p>
  </div>
);

export const InlineLoading = ({ size = 16 }) => (
  <svg
    className="animate-spin text-emerald-500"
    style={{ width: size, height: size }}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// Default export: section variant
const Loading = SectionLoading;
export default Loading;
