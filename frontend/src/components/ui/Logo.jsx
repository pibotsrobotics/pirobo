import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Logo = ({ className = "h-8 w-auto", ...props }) => {
    const { theme } = useTheme();
    
    return (
        <img 
            src={theme === 'dark' ? "/logo%202.png" : "/Logo.png"} 
            alt="Pi Bots Logo" 
            className={className}
            {...props}
        />
    );
};

export default Logo;
