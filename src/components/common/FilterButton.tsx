import { type ButtonHTMLAttributes } from 'react';

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    isActive?: boolean;
}

export const FilterButton = ({
    label,
    isActive = false,
    className = '',
    ...props
}: FilterButtonProps) => {
    return (
        <button
            type="button"
            className={`rounded-full border border-[#F3DFB7] bg-[#F3EBE2] px-4 py-1 text-sm font-medium text-[#514135] transition-colors hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${isActive ? 'bg-amber-200 text-amber-900 hover:bg-amber-300' : ''
                } ${className}`}
            aria-pressed={isActive}
            {...props}
        >
            {label}
        </button>
    );
};
