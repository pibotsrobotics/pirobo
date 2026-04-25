import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Logo = ({ className = "h-8 w-auto", forceTheme, ...props }) => {
    const { theme: siteTheme } = useTheme();
    const effectiveTheme = forceTheme || siteTheme;
    
    // Determine the logo source based on theme
    const logoSrc = effectiveTheme === 'dark' ? "/logo-2.png" : "/logo-1.png";
    
    return (
        <img 
            src={logoSrc} 
            alt="Pi Bots Logo" 
            className={`${className} object-contain`}
            loading="eager"
            decoding="sync"
            {...props}
        />
    );
};

export default Logo;
