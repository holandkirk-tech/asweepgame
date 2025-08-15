import React, { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import type { Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getDailyWheelers, REFRESH_MS, forceRefreshDailyWheelers, Wheeler } from "../data/topWheelers";

export default function TopWheelersPanel() {
  const [wheelers, setWheelers] = useState<Wheeler[]>(getDailyWheelers());
  
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  useEffect(() => {
    // Auto-refresh every 24h
    const id = setInterval(() => {
      setWheelers(getDailyWheelers());
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Optional dev helper: hold Alt/Option and click the title to force refresh
  const maybeForceRefresh = (e: React.MouseEvent) => {
    if (e.altKey) setWheelers(forceRefreshDailyWheelers());
  };

  // Variants with slower durations (matching original)
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 2, ease: "easeOut" },
    },
  };

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 2, ease: "easeOut" },
    },
  };

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center mt-5 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto"
    >
      <motion.p
        onClick={maybeForceRefresh}
        initial="hidden"
        animate={controls}
        variants={titleVariants}
        className="font-secondary font-bold text-2xl sm:text-3xl md:text-[28px] text-gradient cursor-pointer"
      >
        YESTERDAY'S
      </motion.p>

      <motion.p
        onClick={maybeForceRefresh}
        initial="hidden"
        animate={controls}
        variants={titleVariants}
        className="font-secondary font-bold text-3xl sm:text-4xl md:text-[36px] text-gradient mb-6 cursor-pointer"
      >
        TOP 3 WHEELERS
      </motion.p>

      <motion.div
        initial="hidden"
        animate={controls}
        variants={listVariants}
        className="flex flex-col gap-4 w-full"
      >
        {wheelers.map((wheeler, index) => (
          <motion.div
            key={`${wheeler.name}-${index}`}
            variants={itemVariants}
            className="
              flex justify-between items-center 
              px-6 py-4 rounded-xl shadow-xl backdrop-blur-md bg-white/10 border border-white/10
              md:px-20 md:p-4
            "
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="text-xl font-bold text-white min-w-[24px] text-center">
                {index + 1}
              </div>
              <div className="flex items-center gap-4 min-w-0 overflow-hidden">
                <img
                  src={wheeler.img}
                  alt={wheeler.name}
                  className="w-10 h-10 rounded-full object-cover shadow-md flex-shrink-0"
                />
                <p className="font-medium text-white truncate max-w-xs md:max-w-[200px]">
                  {wheeler.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-[70px] justify-end">
              <div className="circle-curve-button bg-white p-1 rounded-full flex items-center justify-center">
                <FaDollarSign size={15} color="black" />
              </div>
              <p className="text-lg font-semibold text-white">
                {wheeler.wins.toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
