import { AnimatePresence, motion } from "motion/react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

interface DialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const DialogModal: React.FC<DialogModalProps> = ({
  isOpen,
  onClose,
  title = "Modal",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  children,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed overflow-y-auto inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 p-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Modal container */}
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto max-w-4xl relative border border-gray-100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex flex-col">
                {title && (
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-gray-600">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
                aria-label="Close"
                type="button"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DialogModal;
