import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoWarningOutline, IoClose } from 'react-icons/io5';

export default function TestVersionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if we've already shown it this session
    const hasShown = sessionStorage.getItem('testVersionPopupShown');
    if (!hasShown) {
      setIsOpen(true);
      sessionStorage.setItem('testVersionPopupShown', 'true');
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header / Icon */}
            <div className="bg-amber-500 p-6 flex justify-center">
               <IoWarningOutline className="text-white text-6xl" />
            </div>

            {/* Content */}
            <div className="p-6 text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-sans" dir="rtl">
                خبرتیا!
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed" dir="rtl">
                دا نسخه تایید شوې نه ده، دا یوه ازمایښتی نسخه ده
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This version is not confirmed, it is a test version.
              </p>

              <button
                onClick={closePopup}
                className="mt-4 w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors duration-200"
              >
                پوه شوم (Understood)
              </button>
            </div>

            {/* Close Icon */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <IoClose size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
