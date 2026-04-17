import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ value, onChange, options, placeholder = "Select option", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || { label: placeholder, value: '' };

  return (
    <div className={`relative min-w-[180px] ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-premium !py-2.5 !text-sm w-full flex items-center justify-between gap-3 text-left transition-all duration-200 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
      >
        <span className="truncate text-gray-200">{selectedOption.label}</span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-2 rounded-xl py-1.5 shadow-2xl animate-fade-in-up" 
          style={{ 
            background: 'rgba(25, 20, 60, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            transformOrigin: 'top center',
            animationDuration: '0.2s'
          }}
        >
          <ul className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                    ${String(value) === String(option.value)
                      ? 'bg-purple-500/20 text-purple-300 font-medium' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <span className="truncate">{option.label}</span>
                  {String(value) === String(option.value) && (
                    <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
