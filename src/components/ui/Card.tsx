import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export function Card({ className, hover, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
                hover && "hover:shadow-md transition-shadow cursor-pointer",
                className
            )}
            {...props}
        />
    );
}
