import { motion, easeOut } from "framer-motion";
import { useState } from "react";
import { apiService } from "../services/api";

const Home = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ prizeCents: number } | null>(null);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: easeOut,
      },
    },
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: easeOut,
      },
    },
  };

  // Fade + slide up for other items
  const fadeSlideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value.length > 1 || (value && !/^\d$/.test(value))) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 4) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSpin = async () => {
    const codeString = code.join("");
    if (codeString.length !== 5 || !/^\d{5}$/.test(codeString)) {
      setError("Please enter a valid 5-digit code");
      return;
    }

    setIsSpinning(true);
    setError("");
    setResult(null);
    setShowResult(false);

    try {
      const response = await apiService.spin(codeString);
      if (response.success) {
        // Transform the new backend response to match expected format
        setResult({ 
          prizeCents: (response.prize || 0) * 100 // Convert dollars to cents
        });
        setShowResult(true);
        // Clear the code after successful spin
        setCode(["", "", "", "", ""]);
      } else {
        setError(response.message || "Spin failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to spin. Please try again.");
      console.error("Spin failed:", err);
    } finally {
      setIsSpinning(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="border border-gray-300 rounded-xl backdrop-blur-sm p-4 sm:p-8 md:p-12">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 min-w-0">
        {/* Left Content */}
        <motion.div
          className="md:flex-1 max-w-full md:max-w-[750px] min-w-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="text-secondary font-bold text-4xl sm:text-5xl md:text-[60px] whitespace-nowrap m-0 leading-tight"
            variants={slideFromLeft}
          >
            Spin With
          </motion.p>

          <motion.p
            className="
              text-[40px] sm:text-5xl md:text-[72px] 
              font-black 
              bg-gradient-to-r from-[#6d68f7] to-[#b84f99] 
              bg-clip-text text-transparent 
              mt-2 leading-tight
              max-w-full
              md:whitespace-nowrap
            "
            variants={slideFromRight}
          >
            A ONE TIME CODE
          </motion.p>

          <motion.ul
            className="list-disc pl-5 space-y-2 text-primary text-base sm:text-lg mt-6 max-w-full md:max-w-[450px]"
            variants={fadeSlideUp}
          >
            <li>Enter the code to unlock your spin on the prize wheel.</li>
            <li>Each code grants 1 spin — spin the wheel and try your luck!</li>
            <li>
              Non-deposit players can request a code every 2 hours for 24 hours.
            </li>
            <li>
              Deposit players can request a code every 2 hours for 3 days.
            </li>
            <li>
              <strong>Contact us via WhatsApp</strong> using the icon below to
              get your unique 5-digit spin code.
            </li>
          </motion.ul>
        </motion.div>

        {/* Right Content */}
        <motion.div
          className="flex flex-col items-center md:items-center gap-6 md:flex-[0.5] min-w-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src="/jpg/wheel.png"
            alt="wheel"
            className="w-[180px] sm:w-[220px] md:w-[280px] object-contain"
            variants={fadeSlideUp}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          />

          <motion.p
            className="font-bold text-secondary text-custom text-sm sm:text-base md:text-[16px] text-center"
            variants={fadeSlideUp}
          >
            PLACE THE 5 DIGIT CODE HERE
          </motion.p>

          <motion.div className="flex gap-2" variants={fadeSlideUp}>
            {[0, 1, 2, 3, 4].map((i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={code[i]}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6d68f7] bg-white text-black"
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !code[i] && i > 0) {
                    const prevInput = document.getElementById(`pin-${i - 1}`);
                    prevInput?.focus();
                  }
                }}
                id={`pin-${i}`}
                disabled={isSpinning}
              />
            ))}
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div 
              className="bg-red-500/20 border border-red-500 rounded-lg p-3 max-w-[240px]"
              variants={fadeSlideUp}
            >
              <p className="text-red-200 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Result Display */}
          {showResult && result && (
            <motion.div 
              className="bg-green-500/20 border border-green-500 rounded-lg p-4 max-w-[240px]"
              variants={fadeSlideUp}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-green-200 text-center">
                🎉 <strong>Congratulations!</strong>
              </p>
              <p className="text-green-100 text-xl font-bold text-center mt-1">
                You won {formatCurrency(result.prizeCents)}!
              </p>
            </motion.div>
          )}

          <button 
            className="button-primary w-full max-w-[240px] disabled:opacity-50"
            onClick={handleSpin}
            disabled={isSpinning || code.join("").length !== 5}
          >
            <span className="button-content text-base sm:text-lg">
              {isSpinning ? "SPINNING..." : "SPIN WHEEL"}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
