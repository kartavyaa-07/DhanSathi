// Inline SVG icon set, ported from the DhanSathi Claude Design source markup.
import React from 'react';

export const IconHome = ({ color = '#191B1E', size = 19 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 11.5L12 4l8 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9h5v-5h2v5h5v-9" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
export const IconShield = ({ color = '#191B1E', size = 19 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
export const IconWallet = ({ color = '#191B1E', size = 19 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="13" rx="2" stroke={color} strokeWidth="2" />
    <path d="M3 10h18" stroke={color} strokeWidth="2" />
    <circle cx="17" cy="14" r="1.4" fill={color} />
  </svg>
);
export const IconExchange = ({ color = '#191B1E', size = 19 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12h18M14 6l6 6-6 6M10 6L4 12l6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconProfile = ({ color = '#191B1E', size = 19 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.6" stroke={color} strokeWidth="2" />
    <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const IconBack = ({ color = '#191B1E' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12 15L7 10L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconMenu = ({ color = '#191B1E' }: { color?: string }) => (
  <svg width="18" height="13" viewBox="0 0 18 12" fill={color}>
    <path d="M 0 12 L 0 10 L 18 10 L 18 12 L 0 12 M 0 7 L 0 5 L 18 5 L 18 7 L 0 7 M 0 2 L 0 0 L 18 0 L 18 2 L 0 2" />
  </svg>
);
export const IconSearch = ({ color = '#76777D' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill={color}>
    <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="2" fill="none" />
    <path d="M13 13l4 4" stroke={color} strokeWidth="2" />
  </svg>
);
export const IconMic = ({ color = '#fff', size = 20 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" fill={color} />
    <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);
export const IconCheck = ({ color = '#00714D', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M6 12L2 8l1.4-1.4L6 9.2l6.6-6.6L14 4z" />
  </svg>
);
export const IconExternal = ({ color = '#006C49' }: { color?: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M7 17L17 7M17 7H9M17 7V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconDownload = ({ color = '#006C49' }: { color?: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconShare = ({ color = '#fff' }: { color?: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="2.3" fill={color} />
    <circle cx="6" cy="12" r="2.3" fill={color} />
    <circle cx="18" cy="19" r="2.3" fill={color} />
    <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" stroke={color} strokeWidth="1.6" />
  </svg>
);
export const IconWarning = ({ color = '#BA1A1A', size = 24 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 20h20L12 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 9v5M12 17h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const IconClock = ({ color = '#76777D' }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="13" r="8" stroke={color} strokeWidth="1.8" />
    <path d="M12 9v4l3 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 2h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const IconSort = ({ color = '#76777D' }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 5h14M5 9h8M7.5 13h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconDelivery = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="18" r="2.2" stroke="#191B1E" strokeWidth="1.8" />
    <circle cx="17" cy="18" r="2.2" stroke="#191B1E" strokeWidth="1.8" />
    <path d="M6 18h4l2-6h4l2 3M12 12V8h3" stroke="#191B1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
export const IconDomestic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 11l8-7 8 7" stroke="#191B1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9h12v-9" stroke="#191B1E" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 19v-5h4v5" stroke="#191B1E" strokeWidth="1.8" />
  </svg>
);
export const IconOffice = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="18" height="12" rx="2" stroke="#191B1E" strokeWidth="1.8" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#191B1E" strokeWidth="1.8" />
    <path d="M3 12h18" stroke="#191B1E" strokeWidth="1.8" />
  </svg>
);
export const IconBusiness = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l1-5h16l1 5" stroke="#191B1E" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 9v10h16V9" stroke="#191B1E" strokeWidth="1.8" />
    <path d="M10 19v-5h4v5" stroke="#191B1E" strokeWidth="1.8" />
  </svg>
);
export const IconFreelance = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 20l1-4L16 5l3 3-11 11-4 1z" stroke="#191B1E" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M14 7l3 3" stroke="#191B1E" strokeWidth="1.8" />
  </svg>
);

export const INCOME_ICONS: Record<string, React.FC> = {
  delivery: IconDelivery, domestic: IconDomestic, office: IconOffice, business: IconBusiness, freelance: IconFreelance,
};
