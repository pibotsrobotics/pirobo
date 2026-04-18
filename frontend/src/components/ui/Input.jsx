import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => {
    return (
        <input
            type={type}
            className={twMerge(
                clsx(
                    'flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-gray-800',
                    className
                )
            )}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;
