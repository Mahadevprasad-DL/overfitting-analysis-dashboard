import { useState } from 'react';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  activePage: 'home' | 'detect';
  setActivePage: (page: 'home' | 'detect') => void;
};

export default function Header({ activePage, setActivePage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (page: 'home' | 'detect') => {
    setActivePage(page);
    setMenuOpen(false); // close menu after click
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      
      {/* LEFT SIDE TITLE */}
      <h1 className="text-lg md:text-2xl font-bold text-blue-700">
        Overfitting Detection Using Learning Curves
      </h1>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex gap-6">
        <button
          onClick={() => handleNavigation('home')}
          className={`font-medium ${
            activePage === 'home'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Home
        </button>

        <button
          onClick={() => handleNavigation('detect')}
          className={`font-medium ${
            activePage === 'detect'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Detect
        </button>
      </nav>

      {/* MOBILE MENU ICON */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-white shadow-lg rounded-lg w-40 flex flex-col md:hidden z-50">
          <button
            onClick={() => handleNavigation('home')}
            className={`px-4 py-3 text-left ${
              activePage === 'home'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavigation('detect')}
            className={`px-4 py-3 text-left ${
              activePage === 'detect'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Detect
          </button>
        </div>
      )}
    </header>
  );
}
