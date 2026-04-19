import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Special request: Scroll to bottom on initial load / refresh
        // Small delay ensures content is fully height-calculated
        const timer = setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Standard behavior: Reset scroll to top on route change (navigation)
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
