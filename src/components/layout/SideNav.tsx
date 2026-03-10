import { Home, ListOrdered, ShoppingCart, Headset, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

interface SideNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export function SideNav({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SideNavProps) {
    const { currentUser } = useUser();

    const allItems = [
        { id: 'home', icon: Home, label: '商品列表' },
        { id: 'cart', icon: ShoppingCart, label: '採購車' },
        { id: 'orders', icon: ListOrdered, label: '訂單管理' },
        { id: 'due-payments', icon: CreditCard, label: '應付帳款', show: currentUser?.customerType === 'monthly' },
        { id: 'contact', icon: Headset, label: '聯繫專員' },
    ];

    const items = allItems.filter(item => item.show !== false);

    return (
        <aside className={cn(
            "hidden md:flex fixed left-0 top-16 bottom-0 flex-col bg-white border-r border-gray-200 z-40 transition-all duration-300",
            isCollapsed ? "w-16" : "w-64 lg:w-72"
        )}>
            {/* Logo area removed as it's now in Header */}

            <nav className={cn("flex-1 space-y-1 p-2", !isCollapsed && "p-4")}>
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer relative group",
                                isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3",
                                isActive
                                    ? "bg-primary-50 text-primary-700 font-bold shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-600 rounded-r-full" />
                            )}
                            <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-700 stroke-[2.5px]" : "text-gray-500 group-hover:text-gray-900")} />
                            {!isCollapsed && <span className="text-sm">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Collapse Toggle */}
            <div className="p-2 border-t border-gray-100">
                <button
                    onClick={onToggleCollapse}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    {!isCollapsed && <span className="text-sm">摺疊面板</span>}
                </button>
                {!isCollapsed && (
                    <div className="mt-4 px-4 py-3 bg-gray-50 rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Version v1.0-demo</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
