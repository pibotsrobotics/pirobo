import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset scroll to top on every navigation
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
