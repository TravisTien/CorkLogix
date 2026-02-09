import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <Navbar />
            <SideNav activeTab={activeTab} onTabChange={onTabChange} />
            <main className="container mx-auto max-w-md md:max-w-4xl lg:max-w-6xl p-4 md:px-6 lg:px-8 space-y-6 md:ml-64 lg:ml-72">
                {children}
            </main>
            <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
}

