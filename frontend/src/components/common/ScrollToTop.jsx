import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A component that scrolls the window to the top whenever the route changes.
 * This should be placed inside the Router but outside of Routes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' 
    });
  }, [pathname]);

  return null;
}
