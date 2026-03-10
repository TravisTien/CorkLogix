interface FilterBarProps {
    filters: string[];
    activeFilter: string;
    onChange: (filter: string) => void;
    className?: string;
}

export function FilterBar({ filters, activeFilter, onChange, className = '' }: FilterBarProps) {
    return (
        <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    className={`
                        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
                        ${activeFilter === filter
                            ? 'bg-primary-800 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}
