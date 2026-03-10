import { Home, ListOrdered, ShoppingCart, Headset } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const items = [
        { id: 'home', icon: Home, label: '首頁' },
        { id: 'cart', icon: ShoppingCart, label: '採購車' },
        { id: 'orders', icon: ListOrdered, label: '訂單管理' },
        { id: 'contact', icon: Headset, label: '聯繫專員' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 pb-safe md:hidden">
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                            isActive ? "text-primary-800" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
