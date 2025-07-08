import React from 'react';
interface LayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    sidebar?: React.ReactNode;
    direction?: 'ltr' | 'rtl';
    className?: string;
    style?: React.CSSProperties;
}
declare const Layout: React.FC<LayoutProps>;
export default Layout;
