import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { FaSearch } from "react-icons/fa";

import URLInput from "../components/URLInput";
import { normalizeUrl } from "../utils/normalizeUrl";

export default function Home() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = () => {
    const formattedUrl = normalizeUrl(url);

    if (!formattedUrl) return;

    navigate("/results", {
      state: {
        url: formattedUrl,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  // Framer variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "linear-gradient(135deg, #818cf8, #c084fc, #7dd3fc)",
            "linear-gradient(135deg, #7dd3fc, #818cf8, #c084fc)",
            "linear-gradient(135deg, #c084fc, #7dd3fc, #818cf8)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Glass Card */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl p-6 md:p-12 text-center"
      >
        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-4xl md:text-5xl font-black tracking-tight text-gray-800 mb-4"
        >
          L<span className="text-indigo-600">∞</span>plyt
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-gray-600 text-md mb-6 max-w-2xl mx-auto"
        >
          Analyze. Discover. Improve.
        </motion.p>

        <form onSubmit={handleSubmit} className="flex relative items-center">
          {/* URL Input */}
          <motion.div variants={item} className="w-full">
            <URLInput url={url} setUrl={setUrl} />
          </motion.div>

          {/* Search Button */}
          <motion.div variants={item} className="flex flex-col sm:flex-row">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-xl cursor-pointer bg-indigo-600 text-white font-semibold shadow-lg"
            >
              <FaSearch />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
