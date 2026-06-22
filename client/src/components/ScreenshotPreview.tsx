import { useState, useMemo } from "react";
import type { Screenshot } from "@shared/types/screenshot";

interface Props {
  screenshots: Screenshot[];
}

export default function ScreenshotPreview({ screenshots }: Props) {
  const [open, setOpen] = useState(false);
  const [fade] = useState(false);

  // ✅ Only keep desktop screenshots
  const desktopScreens = useMemo(
    () => screenshots.filter((s) => s.type === "desktop"),
    [screenshots]
  );

  const active = desktopScreens[0];

  if (!active) return null;

  return (
    <>
      {/* Preview Card */}
      <div
        onClick={() => setOpen(true)}
        className="relative cursor-pointer group"
      >
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src={`data:image/png;base64,${active.image}`}
            alt="Desktop preview"
            className="w-full h-70 object-cover blur-xs group-hover:blur-0 transition duration-500"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
          <p className="text-white text-lg font-semibold">
            Site Preview
          </p>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="min-h-full flex items-start justify-center p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-5xl w-full">
              {/* Image */}
              <img
                src={`data:image/png;base64,${active.image}`}
                alt="Desktop screenshot"
                className={`rounded-2xl shadow-2xl w-full h-auto transition-opacity duration-300 ${
                  fade ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="fixed top-6 right-6 cursor-pointer bg-white/90 hover:bg-indigo-600 hover:text-white text-black rounded-full px-3 py-1 text-sm shadow"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}