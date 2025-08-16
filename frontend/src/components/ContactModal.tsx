import { motion } from "framer-motion";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdClose } from "react-icons/md";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "whatsapp" | "telegram";
  phoneNumber: string;
}

const ContactModal = ({ isOpen, onClose, type, phoneNumber }: ContactModalProps) => {
  const isWhatsApp = type === "whatsapp";
  
  const handleContactClick = () => {
    if (isWhatsApp) {
      // Open WhatsApp with the phone number
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    } else {
      // Open Telegram with the phone number
      window.open(`https://t.me/${phoneNumber}`, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isWhatsApp ? (
              <div className="p-2 rounded-full bg-green-500/20">
                <FaWhatsapp className="text-green-400" size={24} />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-blue-500/20">
                <FaTelegramPlane className="text-blue-400" size={24} />
              </div>
            )}
            <h2 className="text-xl font-bold text-white">
              Contact Us via {isWhatsApp ? "WhatsApp" : "Telegram"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <MdClose className="text-gray-400 hover:text-white" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <IoIosCall className="text-purple-400 mx-auto mb-2" size={48} />
          </div>
          
          <p className="text-gray-300 mb-4">
            Get in touch with our support team using {isWhatsApp ? "WhatsApp" : "Telegram"}
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">Contact Number:</p>
            <p className="text-2xl font-bold text-white tracking-wider">
              {phoneNumber}
            </p>
          </div>

          <p className="text-sm text-gray-400">
            Click the button below to start a conversation with us on {isWhatsApp ? "WhatsApp" : "Telegram"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContactClick}
            className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105 ${
              isWhatsApp 
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isWhatsApp ? (
                <FaWhatsapp size={20} />
              ) : (
                <FaTelegramPlane size={20} />
              )}
              Open {isWhatsApp ? "WhatsApp" : "Telegram"}
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;
