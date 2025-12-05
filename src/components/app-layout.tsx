import type { ReactNode } from "react";
import { AdlexSidebar } from "./adlex-sidebar";

interface AppLayoutProps {
    /** Content to display in the main area */
    children: ReactNode;
    /** URL of the currently active navigation item */
    activeUrl?: string;
}

export const AppLayout = ({ children, activeUrl }: AppLayoutProps) => {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <AdlexSidebar activeUrl={activeUrl} />

            {/* Main content area */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
};
