import { ClipboardCheck, TrendingUp, ShoppingCart } from 'lucide-react';

interface SalesLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    hideHeader?: boolean;
}

export function SalesLayout({ children, activeTab, onTabChange, hideHeader = false }: SalesLayoutProps) {
    const tabs = [
        { id: 'quick-order', label: '代客下單', icon: ShoppingCart },
        { id: 'pending', label: '待審核', icon: ClipboardCheck },
        { id: 'performance', label: '業績看板', icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 頂部導航 */}
            {!hideHeader && (
                <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-lg text-gray-900">CorkLogix 業務端</h1>
                            <p className="text-xs text-gray-500">Isabella Chen · Senior Account Manager</p>
                        </div>
                        <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center text-white font-bold">
                            IC
                        </div>
                    </div>
                </header>
            )}

            {/* 主內容區 */}
            <main className="container mx-auto max-w-md p-6 space-y-6">
                {children}
            </main>

            {/* 底部 Tab 導航 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex items-center justify-around">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    flex-1 flex flex-col items-center gap-1 py-3 transition-colors cursor-pointer
                                    ${isActive ? 'text-primary-800' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <Icon size={24} />
                                <span className="text-xs font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
