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
          className={`fixed overflow-y-auto inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Modal container */}
          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-h-screen overflow-y-auto max-w-md p-6 relative "
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col justify-center-center">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-800">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-gray-500">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition"
                aria-label="Close"
                type="button"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-4">{children}</div>

            {/* Footer */}
            {footer && <div className="mt-4">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DialogModal;
