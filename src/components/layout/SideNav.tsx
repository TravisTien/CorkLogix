import { Home, ListOrdered, User, ShoppingCart, Wine } from "lucide-react";
import { cn } from "@/lib/utils";

interface SideNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function SideNav({ activeTab, onTabChange }: SideNavProps) {
    const items = [
        { id: 'home', icon: Home, label: '首頁' },
        { id: 'cart', icon: ShoppingCart, label: '採購車' },
        { id: 'orders', icon: ListOrdered, label: '訂單' },
        { id: 'profile', icon: User, label: '帳號' },
    ];

    return (
        <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 lg:w-72 flex-col bg-white border-r border-gray-200 z-40">
            {/* Logo / Brand Area */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Wine className="w-6 h-6 text-primary-800" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">CorkLogix</p>
                        <p className="text-xs text-gray-500">B2B 酒商採購平台</p>
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                                isActive
                                    ? "bg-primary-100 text-primary-800 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">營業時間</p>
                    <p className="text-sm font-medium text-gray-900">週一至週五 9:00-18:00</p>
                </div>
            </div>
        </aside>
    );
}
