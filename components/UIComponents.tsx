
import React from 'react';
import { COLORS } from '../constants';

// Typography
export const Text: React.FC<{
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'metric' | 'metric-label';
    color?: string;
    children: React.ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
    onClick?: () => void;
}> = ({ variant = 'body', color, children, className = '', align = 'left', onClick }) => {
    const baseStyle = "font-sans transition-colors";
    let variantStyle = "";

    switch (variant) {
        case 'h1': variantStyle = "text-3xl font-bold tracking-tight text-gray-900"; break;
        case 'h2': variantStyle = "text-2xl font-bold text-gray-900"; break;
        case 'h3': variantStyle = "text-lg font-bold text-gray-900"; break;
        case 'h4': variantStyle = "text-base font-semibold text-gray-800"; break;
        case 'body': variantStyle = "text-sm leading-relaxed text-gray-600"; break;
        case 'caption': variantStyle = "text-xs text-gray-500 font-medium"; break;
        case 'metric': variantStyle = "text-3xl font-black font-mono tracking-tighter text-gray-900"; break;
        case 'metric-label': variantStyle = "text-[10px] font-bold uppercase tracking-widest text-gray-400"; break;
    }

    const alignStyle = `text-${align}`;
    const cursorStyle = onClick ? "cursor-pointer hover:opacity-80" : "";
    const customColor = color ? { color } : {};

    return (
        <div 
            className={`${baseStyle} ${variantStyle} ${alignStyle} ${cursorStyle} ${className}`} 
            style={customColor}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

// Button
export const Button: React.FC<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    onClick?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
    loading?: boolean;
}> = ({ variant = 'primary', size = 'md', onClick, children, fullWidth = false, disabled = false, className = '', icon, loading = false }) => {
    let bg = "";
    let text = "";
    let border = "";

    switch (variant) {
        case 'primary':
            bg = `bg-[${COLORS.primary}] hover:brightness-95 shadow-lg shadow-orange-500/30`;
            text = "text-white";
            border = "border-transparent";
            break;
        case 'secondary':
            bg = `bg-[${COLORS.secondary}] hover:brightness-110 shadow-lg shadow-green-900/30`;
            text = "text-white";
            border = "border-transparent";
            break;
        case 'outline':
            bg = "bg-white hover:bg-orange-50";
            text = `text-[${COLORS.primary}]`;
            border = `border border-[${COLORS.primary}]`;
            break;
        case 'ghost':
            bg = "bg-transparent hover:bg-gray-100";
            text = "text-gray-600";
            border = "border-transparent";
            break;
        case 'danger':
            bg = "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30";
            text = "text-white";
            border = "border-transparent";
            break;
    }

    const sizeStyle = size === 'sm' ? "px-3 py-1.5 text-xs rounded-xl" : size === 'lg' ? "px-8 py-4 text-lg rounded-2xl" : "px-5 py-3 text-sm rounded-xl";
    const widthStyle = fullWidth ? "w-full" : "";
    const disabledStyle = (disabled || loading) ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer active:scale-95 active:shadow-sm transition-all duration-200";

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`font-bold flex items-center justify-center gap-2 ${bg} ${text} ${border} ${sizeStyle} ${widthStyle} ${disabledStyle} ${className}`}
            style={
                variant === 'primary' ? { backgroundColor: COLORS.primary } : 
                variant === 'secondary' ? { backgroundColor: COLORS.secondary } : 
                variant === 'outline' ? { color: COLORS.primary, borderColor: COLORS.primary } : {}
            }
        >
            {loading ? <span className="animate-spin text-lg">⟳</span> : icon}
            {children}
        </button>
    );
};

// Card
export const Card: React.FC<{
    variant?: 'elevated' | 'outlined' | 'filled' | 'glass';
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}> = ({ variant = 'elevated', children, className = '', onClick }) => {
    let base = "rounded-3xl p-5 transition-all duration-300";
    if (variant === 'elevated') base += " bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100";
    if (variant === 'outlined') base += " bg-white border border-gray-200";
    if (variant === 'filled') base += " bg-gray-50 border border-transparent";
    if (variant === 'glass') base += " bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm";
    
    if (onClick) base += " cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]";

    return (
        <div className={`${base} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

// Badge
export const Badge: React.FC<{
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'dark';
    children: React.ReactNode;
    className?: string;
}> = ({ variant = 'info', children, className = '' }) => {
    let colorClass = "";
    switch (variant) {
        case 'success': colorClass = "bg-green-100 text-green-700 ring-1 ring-green-600/10"; break;
        case 'warning': colorClass = "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/10"; break;
        case 'error': colorClass = "bg-red-50 text-red-600 ring-1 ring-red-600/10"; break;
        case 'info': colorClass = "bg-blue-50 text-blue-600 ring-1 ring-blue-600/10"; break;
        case 'neutral': colorClass = "bg-gray-100 text-gray-600 ring-1 ring-gray-600/10"; break;
        case 'dark': colorClass = "bg-gray-900 text-white"; break;
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${colorClass} ${className}`}>
            {children}
        </span>
    );
};

// ProgressBar
export const ProgressBar: React.FC<{
    progress: number; // 0 to 100
    color?: string;
    className?: string;
}> = ({ progress, color = COLORS.primary, className = '' }) => {
    return (
        <div className={`w-full bg-gray-100 rounded-full h-1.5 overflow-hidden ${className}`}>
            <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color }}
            />
        </div>
    );
};

// Input
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">{label}</label>}
            <input 
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium ${className}`}
                {...props}
            />
        </div>
    );
};

// Modal
export const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>
            
            {/* Content */}
            <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl transform transition-transform animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
                {footer && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// Tabs
export const Tabs: React.FC<{
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    className?: string;
}> = ({ tabs, activeTab, onTabChange, className = '' }) => {
    return (
        <div className={`flex gap-1 p-1 bg-gray-100/80 rounded-xl overflow-x-auto hide-scrollbar ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                        activeTab === tab 
                        ? `bg-white text-gray-900 shadow-sm` 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

// Quick Action Button
export const QuickAction: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 hover:-translate-y-1 active:scale-95 transition-all duration-200"
        >
            <div className="text-3xl">{icon}</div>
            <span className="text-xs font-bold text-gray-600">{label}</span>
        </button>
    );
};

// Screen Header
export const ScreenHeader: React.FC<{
    title: string;
    subtitle?: string;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
    sticky?: boolean;
}> = ({ title, subtitle, leftAction, rightAction, sticky = true }) => {
    return (
        <div className={`px-4 pt-6 pb-4 bg-[#F5F5F7]/95 backdrop-blur-md z-20 ${sticky ? 'sticky top-0' : ''}`}>
            {subtitle && (
                <Text variant="caption" className="uppercase font-bold tracking-widest text-orange-500 mb-1">{subtitle}</Text>
            )}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {leftAction}
                    <Text variant="h1" className="mb-0 leading-none">{title}</Text>
                </div>
                <div>{rightAction}</div>
            </div>
        </div>
    );
};
