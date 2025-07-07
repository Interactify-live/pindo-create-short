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

const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
  direction = 'rtl',
  className = '',
  style = {},
}) => {
  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    direction,
    ...style,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
  };

  return (
    <div className={className} style={containerStyle}>
      {header && (
        <header style={{ flexShrink: 0 }}>
          {header}
        </header>
      )}

      <div style={contentStyle}>
        {sidebar && (
          <aside style={{ flexShrink: 0 }}>
            {sidebar}
          </aside>
        )}

        <main style={mainStyle}>
          {children}
        </main>
      </div>

      {footer && (
        <footer style={{ flexShrink: 0 }}>
          {footer}
        </footer>
      )}
    </div>
  );
};

export default Layout;