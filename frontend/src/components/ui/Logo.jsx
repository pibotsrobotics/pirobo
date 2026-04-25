import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Logo = ({ className = "h-8 w-auto", forceTheme, ...props }) => {
    const { theme: siteTheme } = useTheme();
    const effectiveTheme = forceTheme || siteTheme;
    
    return (
        <img 
            src={effectiveTheme === 'dark' ? "/logo-2.png" : "/Logo.png"} 
            alt="Pi Bots Logo" 
            className={className}
            {...props}
        />
    );
};

export default Logo;
