import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] focus:ring-orange-500 border border-transparent',
        secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 focus:ring-gray-500',
        outline: 'border border-orange-600 bg-transparent text-orange-500 hover:bg-orange-600 hover:text-white focus:ring-orange-500',
        ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
