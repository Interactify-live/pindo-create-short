import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  className = '',
  style = {},
}) => {
  const getButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.6 : 1,
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      small: {
        fontSize: '12px',
        padding: '6px 12px',
        height: '28px',
      },
      medium: {
        fontSize: '14px',
        padding: '8px 16px',
        height: '36px',
      },
      large: {
        fontSize: '16px',
        padding: '12px 24px',
        height: '44px',
      },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'rgba(56, 78, 216, 1)',
        color: 'white',
      },
      secondary: {
        background: 'transparent',
        color: 'white',
        border: '1px solid rgba(141, 143, 144, 1)',
      },
      danger: {
        background: 'rgba(224, 50, 64, 1)',
        color: 'white',
      },
      ghost: {
        background: 'rgba(0, 18, 18, 0.2)',
        color: 'white',
        border: 'none',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={getButtonStyles()}
    >
      {children}
    </button>
  );
};

export default Button;