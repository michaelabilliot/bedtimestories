import React from 'react';

const Navigation = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'stories', label: 'Stories', icon: 'auto_stories' },
    { id: 'music', label: 'Music', icon: 'music_note' },
    { id: 'memories', label: 'Memories', icon: 'photo_library' },
    { id: 'dreams', label: 'Dreams', icon: 'cloud' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
    { id: 'quiz', label: 'Quiz', icon: 'quiz' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center md:justify-center space-x-1 md:space-x-4 py-2 overflow-x-auto">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                <span className="material-icons text-lg md:text-xl">{item.icon}</span>
                <span className="text-xs md:text-sm font-medium mt-1">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 