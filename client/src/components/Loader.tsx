import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    title: "Scraping website content",
    log: "Collecting metadata, headings, links, and page structure.",
  },
  {
    title: "Capturing screenshots",
    log: "Rendering site previews.",
  },
  {
    title: "Running performance analysis",
    log: "Testing speed, accessibility, SEO, and UX signals.",
  },
  {
    title: "Assessing site authority",
    log: "Checking domain reputation, backlink profiles, and indexing quality.",
  },
  {
    title: "Generating insights",
    log: "Generating actionable AI recommendations.",
  },
];

export default function Loader() {
  const [stepIndex, setStepIndex] = useState(0);

  // Step progression
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(129,140,248,0.4), rgba(192,132,252,0.4), rgba(125,211,252,0.4))",
            "linear-gradient(135deg, rgba(125,211,252,0.4), rgba(129,140,248,0.4), rgba(192,132,252,0.4))",
            "linear-gradient(135deg, rgba(192,132,252,0.4), rgba(125,211,252,0.4), rgba(129,140,248,0.4))",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg rounded-3xl bg-white/25 backdrop-blur-2xl shadow-2xl p-8 relative overflow-hidden"
      >
        {/* Floating subtle motion */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />

        {/* Shimmer */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_linear_infinite]" />

        <div className="relative z-10">
          {/* Dots */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.2s]" />
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.1s]" />
              <span className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" />
            </div>
          </div>

          {/* Animated Step Text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center text-lg font-semibold text-gray-700 min-h-[32px]"
            >
              {steps[stepIndex].title}
            </motion.p>
          </AnimatePresence>

          {/* Log line */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`log-${stepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center text-sm text-gray-600 mt-2 min-h-[40px]"
            >
              {steps[stepIndex].log}
            </motion.p>
          </AnimatePresence>

          {/* Terminal */}
          <div className="mt-8 rounded-2xl bg-black/70 text-green-400 text-xs font-mono p-4 text-left space-y-1 shadow-inner">
            <p>$ connecting to target</p>
            <p>$ collecting metrics</p>
            <p>
              $ {steps[stepIndex].title.replace(/[^\w\s]/gi, "").toLowerCase()}
            </p>
            <p className="animate-pulse">$ processing</p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Larger or slower websites may take longer to analyze.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
