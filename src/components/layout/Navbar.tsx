import { Bell, Menu, Search } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm md:ml-64 lg:ml-72">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="-ml-2 md:hidden">
                    <Menu className="h-6 w-6 text-gray-700" />
                </Button>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Le Bistro Parisien</span>
                    <span className="text-lg font-bold text-primary-900 leading-none">酒商採購</span>
                </div>
            </div>

            {/* Search bar - visible on tablet/desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜尋商品..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    />
                </div>
            </div>

            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6 text-gray-700" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-error rounded-full border-2 border-white" />
            </Button>
        </header>
    );
}

