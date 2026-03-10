import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <Navbar onTabChange={onTabChange} />
            <SideNav
                activeTab={activeTab}
                onTabChange={onTabChange}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
            <main className={cn(
                "p-4 md:px-6 lg:px-8 space-y-6 transition-all duration-300",
                isCollapsed ? "md:pl-16" : "md:pl-64 lg:pl-72"
            )}>
                <div className="container mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
            <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
}

