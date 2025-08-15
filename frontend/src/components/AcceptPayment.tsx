import { FaTelegramPlane } from "react-icons/fa";
import { IoIosCall, IoIosInformation } from "react-icons/io";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const img = [
  "/jpg/chime.png",
  "/jpg/apple.png",
  "/jpg/venmo.png",
  "/jpg/bitcoin.png",
  "/jpg/dollar.png",
  "/jpg/paypal.png",
];

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const AcceptPayment = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-[720px] mx-auto"
    >
      {/* Title */}
      <motion.p
        variants={titleVariants}
        className="text-center text-gradient text-secondary text-[18px] sm:text-[22px] font-extrabold"
      >
        WE ACCEPT
      </motion.p>

      {/* Payment Icons */}
      <motion.div
        variants={listVariants}
        className="flex flex-wrap justify-center items-center gap-4 px-2 sm:px-4 mt-4"
      >
        {img.map((src, index) => (
          <motion.img
            key={index}
            variants={itemVariants}
            src={src}
            alt="Payment Method"
            className="w-10 sm:w-14 md:w-16 object-contain"
          />
        ))}
      </motion.div>

      {/* Connect with us title */}
      <motion.p
        variants={fadeInVariants}
        className="text-secondary text-[18px] sm:text-[20px] font-semibold text-center mt-6"
      >
        CONNECT WITH US
      </motion.p>

      {/* Social Icons */}
      <motion.div
        variants={listVariants}
        className="flex gap-4 justify-center mt-4"
      >
        <motion.div
          variants={itemVariants}
          className="circle-button w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
        >
          <FaTelegramPlane size={20} className="text-black" />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="circle-button w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
        >
          <IoIosCall size={20} className="text-black" />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="circle-button w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center"
        >
          <IoIosInformation size={32} className="text-black" />
        </motion.div>
      </motion.div>

      {/* Copyright */}
      <motion.p
        variants={fadeInVariants}
        className="text-secondary text-[14px] sm:text-[16px] mt-4 text-center font-regular"
      >
        © Copyright 2025, All Rights Reserved by{" "}
        <strong>Acesweeps.com</strong>
      </motion.p>
    </motion.div>
  );
};

export default AcceptPayment;
