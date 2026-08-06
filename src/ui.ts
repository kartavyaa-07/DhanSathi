// Shared style tokens ported from the DhanSathi brand spec (PRD §Trust Layer +
// Claude Design source): Midnight Indigo / Cream / Marigold family, extended
// with the emerald DhanSathi green used throughout the actual design file.
import type { CSSProperties } from 'react';

export const C = {
  green: '#006C49',
  greenDark: '#00714D',
  greenLight: '#6CF8BB',
  greenBg: '#D9F7E8',
  greenBgSoft: '#F0FBF6',
  ink: '#191B1E',
  inkSoft: '#45464D',
  inkFaint: '#76777D',
  border: '#E0E3E5',
  borderStrong: '#C6C6CD',
  bg: '#F7F9FB',
  sidebarBg: '#131B2E',
  sidebarInk: '#BEC6E0',
  amber: '#E8901A',
  warnBg: '#FFF4E5',
  warnBorder: '#FFD9A0',
  warnInk: '#653E00',
  danger: '#BA1A1A',
  dangerBg: '#FFDAD6',
};

export const jakarta = "'Plus Jakarta Sans', sans-serif";
export const work = "'Work Sans', sans-serif";
export const devanagari = "'Noto Sans Devanagari', sans-serif";

export const primaryButtonStyle: CSSProperties = {
  height: 56, borderRadius: 12, border: 'none', background: C.green, color: '#fff',
  fontFamily: work, fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
};

export const disabledButtonStyle: CSSProperties = {
  ...primaryButtonStyle, background: C.borderStrong, cursor: 'default',
};

export function primaryOrDisabled(enabled: boolean): CSSProperties {
  return enabled ? primaryButtonStyle : disabledButtonStyle;
}

export const cardStyle: CSSProperties = {
  borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

export const pillLabelStyle: CSSProperties = {
  display: 'inline-block', width: 'fit-content', fontFamily: work, fontWeight: 600,
  fontSize: 11, color: C.greenDark, background: C.greenBg, borderRadius: 9999, padding: '3px 10px',
};

export function mic(active: boolean): CSSProperties {
  return {
    width: 52, height: 52, borderRadius: 9999, border: 'none',
    background: active ? C.danger : C.green, color: '#fff', cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}
