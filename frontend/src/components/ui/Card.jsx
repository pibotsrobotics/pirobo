import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <div
            className={twMerge(
                clsx(
                    'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none overflow-hidden transition-colors duration-300',
                    hover && 'transition-transform duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]',
                    className
                )
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className }) => (
    <div className={twMerge('p-6 border-b border-gray-200 dark:border-gray-800', className)}>{children}</div>
);

export const CardContent = ({ children, className }) => (
    <div className={twMerge('p-6', className)}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
    <div className={twMerge('p-6 bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-gray-800', className)}>{children}</div>
);

export default Card;
