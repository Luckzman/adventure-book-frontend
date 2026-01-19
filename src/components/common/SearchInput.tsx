import { Search } from 'lucide-react';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    placeholder?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ placeholder = 'Search adventures...', className = '', ...props }, ref) => {
        return (
            <div className={`relative w-full ${className}`}>
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" aria-hidden="true" />
                <input
                    ref={ref}
                    type="search"
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-[#F3DFB7] bg-[#F3EBE2] py-3 pl-12 pr-4 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    {...props}
                />
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';
