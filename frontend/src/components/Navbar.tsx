import { useState } from "react";
import { apiService } from "../services/api";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosCall, IoIosInformation } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { CiLock } from "react-icons/ci";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
// import ContactModal from "./ContactModal"; // Temporarily disabled for testing

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Contact modal states
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  // Add controlled inputs for identifier & password
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await apiService.login(identifier, password);
      
      if (result.success) {
        // Navigate to admin page
        navigate("/admin");
        // Close modal and reset form
        setShowModal(false);
        setIdentifier("");
        setPassword("");
      } else {
        setError(result.message || "Invalid username or password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <>
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
              <div className="circle-button">
                <FaTelegramPlane color="black" size={22} />
              </div>
              <div className="circle-button">
                <IoIosCall color="black" size={22} />
              </div>
              <div className="circle-button">
                <IoIosInformation color="black" size={36} />
              </div>
            </div>
            <button
              className="button-primary"
              onClick={() => setShowModal(true)}
            >
              <span className="button-content text-sm sm:text-base">
                Admin Login
              </span>
            </button>
          </div>

          {/* Mobile Hamburger */}
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
     {/* Mobile Menu */}
{menuOpen && (
  <div className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
    <div className="flex justify-center gap-6">
      <div className="circle-button">
        <FaTelegramPlane color="black" size={25} />
      </div>
      <div className="circle-button">
        <IoIosCall color="black" size={25} />
      </div>
      <div className="circle-button">
        <IoIosInformation color="black" size={40} />
      </div>
    </div>

    {/* Wrap button in flex container */}
    <div className="flex justify-center">
      <button
        className="button-primary max-w-[180px] w-full"
        onClick={() => setShowModal(true)}
      >
        <span className="button-content">Admin Login</span>
      </button>
    </div>
  </div>
)}

      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[1px] flex justify-center items-center px-4">
          <div
            className="bg-[#1c1226] rounded-xl p-6 w-full max-w-md relative
                          sm:max-w-lg md:max-w-md lg:max-w-lg xl:max-w-md"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <ImCross color="white" size={15} />
            </button>

            <form
              onSubmit={handleLogin}
              className="space-y-6 p-6 md:p-8 rounded-xl bg-transparent"
            >
              <h2 className="text-white text-xl font-semibold text-center mb-4">
                Admin Login
              </h2>

              {/* Username / ID */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Username or ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <FaRegCircleUser size={18} color="#aaa" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your username or ID"
                    className="w-full pl-10 pr-4 py-2 rounded-md text-sm bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <CiLock size={20} color="#aaa" />
                  </span>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2 rounded-md text-sm bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1.5 text-white"
                    aria-label="Toggle password visibility"
                  >
                    {passwordVisible ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between text-white text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-yellow-400 bg-transparent border-yellow-400 rounded focus:ring-yellow-400 focus:ring-1"
                  />
                  Remember me
                </label>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-center text-sm">{error}</p>
              )}

              {/* Submit */}
             <div className="flex justify-center">
  <button
    type="submit"
    className="button-primary max-w-[180px] w-full py-2 rounded-md text-black font-semibold text-sm transition"
  >
    Login
  </button>
</div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modals - Temporarily disabled for testing */}
      {/* <ContactModal
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
      /> */}
    </>
  );
};

export default Navbar;
