import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    className?: string;
}

export function SearchBar({ placeholder = '搜尋...', onSearch, className = '' }: SearchBarProps) {
    const [query, setQuery] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent transition-all"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
}
