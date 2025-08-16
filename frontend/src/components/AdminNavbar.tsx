import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosCall, IoIosInformation } from "react-icons/io";
import ContactModal from "./ContactModal";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Contact modal states
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  return (
    <nav className="bg-transparent py-2 px-4 sm:px-8 md:px-16">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/jpg/logo.png"
            alt="logo"
            className="w-10 h-8 sm:w-11 sm:h-8"
          />
          <p className="text-secondary font-bold text-custom-30 text-sm sm:text-base">
            ACESWEEPS
          </p>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4 p-2">
            <button 
              className="circle-button hover:scale-110 transition-transform"
              onClick={() => setShowTelegramModal(true)}
              aria-label="Contact via Telegram"
            >
              <FaTelegramPlane color="black" size={22} />
            </button>
            <button 
              className="circle-button hover:scale-110 transition-transform"
              onClick={() => setShowWhatsAppModal(true)}
              aria-label="Contact via WhatsApp"
            >
              <IoIosCall color="black" size={22} />
            </button>
            <div className="circle-button">
              <IoIosInformation color="black" size={36} />
            </div>
          </div>
          <button className="button-primary">
            <span className="button-content text-sm sm:text-base">Home</span>
          </button>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button
            aria-label="Toggle Menu"
            className="text-secondary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
          <div className="flex justify-center gap-6">
            <button 
              className="circle-button hover:scale-110 transition-transform"
              onClick={() => setShowTelegramModal(true)}
              aria-label="Contact via Telegram"
            >
              <FaTelegramPlane color="black" size={25} />
            </button>
            <button 
              className="circle-button hover:scale-110 transition-transform"
              onClick={() => setShowWhatsAppModal(true)}
              aria-label="Contact via WhatsApp"
            >
              <IoIosCall color="black" size={25} />
            </button>
            <div className="circle-button">
              <IoIosInformation color="black" size={40} />
            </div>
          </div>
          <button className="button-primary w-full">
            <span className="button-content">Admin Login</span>
          </button>
        </div>
      )}

      {/* Contact Modals */}
      <ContactModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        type="whatsapp"
        phoneNumber="8177509750"
      />
      
      <ContactModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        type="telegram"
        phoneNumber="8177509750"
      />
    </nav>
  );
};

export default AdminNavbar;
