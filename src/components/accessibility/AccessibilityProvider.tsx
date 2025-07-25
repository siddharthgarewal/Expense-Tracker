import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AccessibilityContextType {
  isKeyboardNavigation: boolean;
  focusedElement: string | null;
  setFocusedElement: (element: string | null) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  useEffect(() => {
    // Detect keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardNavigation(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const announceToScreenReader = (message: string) => {
    // Create a live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    
    document.body.appendChild(liveRegion);
    liveRegion.textContent = message;
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  };

  const value = {
    isKeyboardNavigation,
    focusedElement,
    setFocusedElement,
    announceToScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <div className={isKeyboardNavigation ? 'keyboard-navigation' : ''}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Custom hook for managing focus
export const useFocusManagement = () => {
  const { setFocusedElement } = useAccessibility();

  const handleFocus = (element: string) => {
    setFocusedElement(element);
  };

  const handleBlur = () => {
    setFocusedElement(null);
  };

  return { handleFocus, handleBlur };
};

// Keyboard navigation helper
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown();
        }
        break;
    }
  };

  return { handleKeyDown };
};
