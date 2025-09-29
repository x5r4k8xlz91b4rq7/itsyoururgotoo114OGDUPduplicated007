import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

interface CustomCaptchaProps {
  onVerify: (verified: boolean) => void;
  theme?: 'light' | 'dark';
  reset?: boolean;
}

const CustomCaptcha: React.FC<CustomCaptchaProps> = ({ onVerify, theme = 'dark', reset = false }) => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevResetRef = useRef(reset);

  // Reset when the reset prop changes
  useEffect(() => {
    // Only trigger when reset value actually changes
    if (reset !== prevResetRef.current) {
      setIsChecked(false);
      setIsAnimating(false);
      onVerify(false);
      prevResetRef.current = reset;
    }
  }, [reset, onVerify]);

  const handleCheck = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Toggle checked state after animation
    setTimeout(() => {
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);
      onVerify(newCheckedState);
      setIsAnimating(false);
    }, 1000); // Match animation duration
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  // Prevent context menu (right click)
  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Prevent copy attempts
  const preventCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  useEffect(() => {
    // Additional global protection for the full view image when open
    if (isPreviewOpen) {
      const preventKeyboardShortcuts = (e: KeyboardEvent) => {
        // Prevent Ctrl+S, Ctrl+C, etc.
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 's' || e.key === 'c' || e.key === 'u')) {
          e.preventDefault();
          return false;
        }
      };

      window.addEventListener('keydown', preventKeyboardShortcuts);
      return () => {
        window.removeEventListener('keydown', preventKeyboardShortcuts);
      };
    }
  }, [isPreviewOpen]);

  return (
    <>
      <div 
        onClick={handleCheck}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCheck();
          }
        }}
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={0}
        className={`
          inline-flex items-center gap-3 px-3 py-2 rounded border cursor-pointer
          bg-background border-border text-foreground hover:bg-accent
          relative z-10 shadow-xl
          transition-colors duration-200
          ${isAnimating ? 'cursor-wait' : ''}
        `}
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {}}
            className={`
              w-6 h-6 rounded-sm cursor-pointer appearance-none border relative overflow-hidden
              ${isChecked ? 'bg-primary border-primary' : 'border-input'}
              ${isAnimating ? 'cursor-wait' : ''}
            `}
            aria-label={t('captcha.notRobot')}
          />
          {/* Orange reload animation overlay */}
          {isAnimating && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer"
              style={{ 
                transformOrigin: 'left',
                willChange: 'transform'
              }}
            />
          )}
          {isChecked && !isAnimating && (
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-foreground"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {/* Rotating border animation */}
          {isAnimating && (
            <div 
              className="absolute inset-0 border-2 border-primary rounded-sm"
              style={{
                animation: 'spin 1s linear infinite',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent'
              }}
            />
          )}
        </div>
        <span className="text-base select-none text-muted-foreground">
          {t('captcha.notRobot') || "I'm not a robot"}
        </span>
        <div 
          className="flex-shrink-0 relative overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleImageClick}
        >
          <img 
            src="https://i.postimg.cc/9QYpN5Y3/38a6accb-412c-4828-883a-92018f178cc1-1.jpg" 
            alt="reCAPTCHA" 
            className="w-[38px] h-[38px] select-none cursor-pointer hover:scale-110 transition-transform duration-200"
            draggable="false"
            onContextMenu={preventContextMenu}
            onCopy={preventCopy}
            onDragStart={(e) => e.preventDefault()}
            onClick={handleImageClick}
            style={{
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              userSelect: 'none'
            }}
          />
        </div>
      </div>

      {/* Full View Modal */}
      {isPreviewOpen && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation();
            // Capture the event at the document level to prevent dialog detection
            if (e.nativeEvent) {
              Object.defineProperty(e.nativeEvent, 'target', {
                value: e.currentTarget,
                writable: false
              });
            }
            handlePreviewClose()
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation();
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation();
          }}
          onContextMenu={preventContextMenu}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
              handlePreviewClose();
            }
          }}
          style={{ pointerEvents: 'auto' }}
          data-recaptcha-modal="true"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
              handlePreviewClose()
            }}
            className="absolute top-4 right-4 text-foreground hover:text-primary transition-colors bg-background/90 p-2 rounded-full"
            type="button"
          >
            <X className="h-8 w-8" />
          </button>
          <div 
            className="sm:max-w-2xl glass-card border-2 border-primary max-h-[90vh] flex flex-col shadow-xl shadow-primary/25 mx-4 rounded-lg overflow-hidden"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
            }}
            onContextMenu={preventContextMenu}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
            }}
          >
            <img
              src="https://i.postimg.cc/9QYpN5Y3/38a6accb-412c-4828-883a-92018f178cc1-1.jpg"
              alt="reCAPTCHA Full View"
              className="w-full h-auto object-cover select-none"
              draggable="false"
              onContextMenu={preventContextMenu}
              onCopy={preventCopy}
              onDragStart={(e) => e.preventDefault()}
              style={{
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none'
              }}
            />
          </div>
        </div>
        ,
        document.body
      )}
    </>
  );
};

export default CustomCaptcha;