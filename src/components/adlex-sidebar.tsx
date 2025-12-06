import type { ReactNode } from "react";
import { FileCheck02, HelpCircle, Settings01, MessageChatCircle } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { NavAccountCard } from "@/components/application/app-navigation/base-components/nav-account-card";
import { NavItemBase } from "@/components/application/app-navigation/base-components/nav-item";
import { Badge } from "@/components/base/badges/badges";
import { AdlexLogo, IFZALogo } from "./adlex-logo";

interface AdlexSidebarProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** Whether to hide the right side border. */
    hideBorder?: boolean;
    /** Additional CSS classes to apply to the sidebar. */
    className?: string;
}

const navigationItems = [
    {
        label: "Applications",
        href: "/",
        icon: FileCheck02,
    },
    {
        label: "Why Adlex AI?",
        href: "#why-adlex",
        icon: HelpCircle,
    },
];

const footerItems = [
    {
        label: "Settings",
        href: "#settings",
        icon: Settings01,
    },
    {
        label: "Support",
        href: "#support",
        icon: MessageChatCircle,
        badge: (
            <Badge
                className="ml-auto"
                color="success"
                type="pill-color"
                size="sm"
            >
                Online
            </Badge>
        ) as ReactNode,
    },
];

export const AdlexSidebar = ({
    activeUrl,
    hideBorder = false,
    className,
}: AdlexSidebarProps) => {
    const SIDEBAR_WIDTH = 296;

    const content = (
        <aside
            style={
                {
                    "--width": `${SIDEBAR_WIDTH}px`,
                } as React.CSSProperties
            }
            className={cx(
                "flex h-full w-full max-w-full flex-col bg-primary",
                !hideBorder && "border-secondary md:border-r",
                className,
            )}
        >
            {/* Header with logo and partner badge */}
            <div className="flex flex-col gap-3 px-4 pt-6 pb-4 lg:px-5">
                <div className="flex items-center gap-3">
                    <AdlexLogo className="h-8 w-8" />
                    <span className="text-lg font-semibold text-primary">Adlex AI</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-tertiary">
                    <IFZALogo className="h-5 w-5" />
                    <span className="text-quaternary">Official Partner</span>
                </div>
            </div>

            {/* Main navigation items */}
            <nav className="flex-1 px-2">
                <ul className="flex flex-col gap-0.5">
                    {navigationItems.map((item) => (
                        <li key={item.label}>
                            <NavItemBase
                                icon={item.icon}
                                href={item.href}
                                type="link"
                                current={item.href === activeUrl}
                            >
                                {item.label}
                            </NavItemBase>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer with settings, support and account card */}
            <div className="mt-auto flex flex-col gap-2 px-2 py-4 lg:px-4 lg:py-6">
                <ul className="flex flex-col gap-0.5">
                    {footerItems.map((item) => (
                        <li key={item.label}>
                            <NavItemBase
                                badge={item.badge}
                                icon={item.icon}
                                href={item.href}
                                type="link"
                                current={item.href === activeUrl}
                            >
                                {item.label}
                            </NavItemBase>
                        </li>
                    ))}
                </ul>

                <NavAccountCard />
            </div>
        </aside>
    );

    return (
        <>
            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-(--width)" style={{ "--width": `${SIDEBAR_WIDTH}px` } as React.CSSProperties}>
                {content}
            </div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <div
                style={{
                    width: SIDEBAR_WIDTH,
                }}
                className="invisible hidden lg:block"
            />
        </>
    );
};
