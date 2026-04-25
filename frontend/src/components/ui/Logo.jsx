import React from 'react';

const Logo = ({ className = "h-8 w-auto", ...props }) => {
    return (
        <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* Main Pi body (Stylized P) */}
            <path 
                d="M45 20C30 20 25 30 25 45C25 65 35 80 45 80C50 80 55 75 55 65V45C55 30 50 20 45 20ZM40 45V35C40 32 42 30 45 30C48 30 50 32 50 35V45C50 48 48 50 45 50C42 50 40 48 40 45Z" 
                fill="#f97316" 
            />
            {/* The 'i' part */}
            <rect x="65" y="50" width="14" height="30" rx="7" fill="#f97316" />
            <circle cx="72" cy="32" r="8" fill="#f97316" />
        </svg>
    );
};

export default Logo;
