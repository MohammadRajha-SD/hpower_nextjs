"use client";
import { motion } from "framer-motion";

// variants
const transitionVariants = {
  initial: {
    x: "100%",
    width: "100%",
  },
  animate: {
    x: "0%",
    width: "0%",
  },
  exit: {
    x: ["0%", "100%"],
    width: ["0%", "100%"],
  },
};

const Transition = () => {
  return (
    <>
      {/* <motion.div
        className="fixed top-16 bottom-0 right-full w-screen h-screen z-20 bg-active_color"
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.8, duration: 0.9, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="fixed top-16 bottom-0 right-full w-screen h-screen z-30 bg-interactive_color"
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.4, duration: 0.9, ease: "easeInOut" }}
      ></motion.div> */}
      
    </>
  );
};

export default Transition;
