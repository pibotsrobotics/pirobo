import React from 'react';

const Logo = ({ className = "h-8 w-auto", ...props }) => {
    return (
        <img 
            src="/Pibot%20logo.png" 
            alt="Pi Bots Logo" 
            className={className}
            {...props}
        />
    );
};

export default Logo;
