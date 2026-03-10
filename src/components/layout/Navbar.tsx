import { Bell, ArrowLeft, UserCircle, LogOut, Settings, Wine } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface NavbarProps {
    onBack?: () => void;
    showBack?: boolean;
    title?: string;
    onTabChange?: (tab: string) => void;
    isFullScreen?: boolean;
}

export function Navbar({ onBack, showBack = false, title, onTabChange }: NavbarProps) {
    const { currentUser, logout } = useUser();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleProfileClick = () => {
        if (onTabChange) {
            onTabChange('profile');
        }
        setShowUserMenu(false);
    };

    const handleLogout = () => {
        // 執行登出並清除狀態
        logout();
        if (onTabChange) {
            onTabChange('home');
        }
        setShowUserMenu(false);
    };

    return (
        <header className={cn(
            "sticky top-0 z-50 bg-white border-b border-gray-200 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm transition-all duration-300 w-full"
        )}>
            <div className="flex items-center gap-3">
                {showBack ? (
                    <Button variant="ghost" size="icon" className="-ml-2" onClick={onBack}>
                        <ArrowLeft className="h-6 w-6 text-gray-700" />
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Wine className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">CorkLogix</span>
                        </div>
                    </div>
                )}
                {title && (
                    <>
                        <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden md:block" />
                        <span className="text-lg font-bold text-primary-900 leading-none hidden md:block">{title}</span>
                    </>
                )}
            </div>

            {/* Search bar removed from here as per requirement to move it to ProductList */}

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-6 w-6 text-gray-700" />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-error rounded-full border-2 border-white" />
                </Button>

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full overflow-hidden border border-gray-200"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle className="h-6 w-6 text-gray-700" />
                        )}
                    </Button>

                    {showUserMenu && currentUser && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{currentUser.contact || currentUser.role}</p>
                                </div>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={handleProfileClick}
                                >
                                    <Settings className="h-4 w-4" />
                                    帳號設定
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    登出
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}


