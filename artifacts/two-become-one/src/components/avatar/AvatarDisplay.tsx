import React from 'react';
import { AvatarSettings } from '../../lib/types';
import { AVATAR_AURAS } from '../../lib/gameLogic';

interface AvatarDisplayProps {
  avatar: AvatarSettings;
  size?: number;
  className?: string;
  showAnimation?: boolean;
}

const AURA_COLORS: Record<string, string> = {
  none: 'transparent',
  gold: '#f59e0b',
  rose: '#e879a0',
  violet: '#8b5cf6',
  teal: '#14b8a6',
  coral: '#f97316',
  sky: '#0ea5e9',
  midnight: '#1e293b',
};

const BACKGROUND_STYLES: Record<string, string> = {
  'gradient-warm': 'linear-gradient(135deg, #fda4af 0%, #fbcfe8 50%, #fde68a 100%)',
  'gradient-cool': 'linear-gradient(135deg, #a5f3fc 0%, #c7d2fe 50%, #ddd6fe 100%)',
  'gradient-dusk': 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
  'solid-dark': '#1e293b',
  'solid-light': '#f8f4f0',
  'pattern-stars': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  'pattern-waves': 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
  'gradient-forest': 'linear-gradient(135deg, #166534 0%, #15803d 50%, #4ade80 100%)',
};

const SHAPE_PATHS: Record<string, string> = {
  circle: '',
  heart: 'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
};

function getShapeClip(shape: string): React.CSSProperties {
  switch (shape) {
    case 'heart': return { clipPath: "path('M50,30 A20,20,0,0,1,90,30 A20,20,0,0,1,50,70 A20,20,0,0,1,10,30 A20,20,0,0,1,50,30')" };
    case 'star': return { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
    case 'shield': return { clipPath: 'polygon(50% 0%, 100% 25%, 100% 60%, 50% 100%, 0% 60%, 0% 25%)' };
    case 'diamond': return { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
    case 'hexagon': return { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' };
    case 'cloud': return { borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%' };
    default: return { borderRadius: '50%' };
  }
}

function getAnimClass(animation: string, show: boolean): string {
  if (!show) return '';
  switch (animation) {
    case 'pulse': return 'animate-pulse';
    case 'drift': return 'animate-bounce';
    case 'shimmer': return 'animate-spin';
    case 'breathe': return 'animate-pulse';
    case 'glow': return 'animate-ping';
    default: return '';
  }
}

export function AvatarDisplay({ avatar, size = 80, className = '', showAnimation = false }: AvatarDisplayProps) {
  const auraColor = AURA_COLORS[avatar.aura] || 'transparent';
  const bg = BACKGROUND_STYLES[avatar.background] || BACKGROUND_STYLES['gradient-warm'];
  const shapeStyle = getShapeClip(avatar.shape);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {avatar.aura !== 'none' && (
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '50%',
            background: `radial-gradient(circle, ${auraColor}40 0%, ${auraColor}10 60%, transparent 80%)`,
            transform: 'scale(1.4)',
          }}
        />
      )}
      <div
        className={`relative flex items-center justify-center overflow-hidden ${getAnimClass(avatar.animation, showAnimation)}`}
        style={{
          width: size,
          height: size,
          background: bg,
          ...shapeStyle,
        }}
      >
        {avatar.pattern !== 'none' && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: avatar.pattern === 'dots'
                ? `radial-gradient(${avatar.secondaryColor} 1px, transparent 1px)`
                : avatar.pattern === 'lines'
                ? `repeating-linear-gradient(45deg, ${avatar.secondaryColor} 0, ${avatar.secondaryColor} 1px, transparent 0, transparent 50%)`
                : avatar.pattern === 'grid'
                ? `linear-gradient(${avatar.secondaryColor} 1px, transparent 1px), linear-gradient(90deg, ${avatar.secondaryColor} 1px, transparent 1px)`
                : 'none',
              backgroundSize: avatar.pattern === 'dots' ? '8px 8px' : avatar.pattern === 'grid' ? '12px 12px' : '8px 8px',
            }}
          />
        )}
        <span style={{ fontSize: size * 0.38, lineHeight: 1 }}>{avatar.icon}</span>
      </div>
    </div>
  );
}
