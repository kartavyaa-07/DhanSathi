import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, pillLabelStyle, cardStyle } from '../ui';
import { IconSearch, IconShield, IconWallet, IconExchange } from './Icons';

export function DashboardScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, dashboardSchemes, fmt } = derived;
  const healthScore = 75;
  const healthConic = `conic-gradient(${C.green} 0% ${healthScore}%, ${C.border} ${healthScore}% 100%)`;
  const quickActions = [
    { key: 'insurance', label: 'Insurance', Icon: IconShield },
    { key: 'invest', label: 'Invest', Icon: IconWallet },
    { key: 'borrow', label: 'Borrow', Icon: IconExchange },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 20px 110px 20px' }}>
      <div style={{ height: 52, borderRadius: 12, background: '#fff', border: `2px solid ${C.borderStrong}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
        <IconSearch />
        <span style={{ fontFamily: work, fontSize: 15, color: C.inkFaint }}>{t.searchPlaceholder}</span>
      </div>

      <div style={{ ...cardStyle, display: 'flex', gap: 16, alignItems: 'center', padding: 16 }}>
        <div style={{ position: 'relative', width: 88, height: 88, borderRadius: 9999, background: healthConic, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 66, height: 66, borderRadius: 9999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 24, color: C.ink }}>{healthScore}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 17, color: C.ink }}>{t.healthScoreTitle}</span>
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.green }}>{t.goodStanding}</span>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkSoft }}>{t.healthScoreNote}</span>
        </div>
      </div>

      <div style={{ borderRadius: 12, background: C.sidebarBg, padding: '18px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: 9999, background: C.sidebarInk, opacity: 0.2 }} />
        <span style={{ fontFamily: work, fontSize: 15, color: C.sidebarInk, position: 'relative' }}>{t.totalBalance}</span>
        <div style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: '#fff', margin: '6px 0 16px 0', position: 'relative' }}>₹ {derived.balanceTotalFmt}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #565E74', paddingTop: 14, position: 'relative' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'rgba(108,248,187,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#4EDEA3"><path d="M7 0v12.175L1.4 6.575 0 8l8 8 8-8-1.4-1.425L9 12.175V0H7z" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: work, fontSize: 12, color: C.sidebarInk }}>{t.income}</span>
              <span style={{ fontFamily: work, fontWeight: 600, fontSize: 16, color: '#fff' }}>₹ {fmt(s.monthlyIncome)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'rgba(255,218,214,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#FFDAD6"><path d="M7 16V3.825L1.4 9.425 0 8l8-8 8 8-1.4 1.425L9 3.825V16H7z" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: work, fontSize: 12, color: C.sidebarInk }}>{t.expenses}</span>
              <span style={{ fontFamily: work, fontWeight: 600, fontSize: 16, color: '#fff' }}>₹ {fmt(s.monthlyExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {s.investedAmount > 0 && (
        <div style={{ ...cardStyle, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{t.myInvestments}</span>
            <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 18, color: C.ink }}>₹ {fmt(s.investedAmount)}</span>
          </div>
          <button onClick={() => actions.onOpenTab('invest')} style={{ height: 36, padding: '0 14px', borderRadius: 9999, border: `1px solid ${C.green}`, background: '#fff', color: C.green, fontFamily: work, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t.view}</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        {quickActions.map(qa => (
          <button key={qa.key} onClick={() => actions.onOpenTab(qa.key)} style={{ flex: 1, height: 88, borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <span style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><qa.Icon color={C.green} size={22} /></span>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.ink }}>{qa.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 20, color: C.ink }}>{t.recommendedForYou}</span>
        {dashboardSchemes.map(sc => (
          <button key={sc.id} onClick={() => actions.onOpenSchemeDetail(sc.id)} style={{ ...cardStyle, textAlign: 'left', padding: 16, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
            <span style={pillLabelStyle}>{sc.category}</span>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 16, color: C.ink }}>{sc.nameEn}</span>
            <span style={{ fontFamily: work, fontSize: 14, color: C.inkSoft }}>{sc.coverEn}</span>
            <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.green }}>{sc.premiumEn}</span>
          </button>
        ))}
      </div>
      <span style={{ fontFamily: work, fontSize: 12, color: '#9A9BA1' }}>{t.lastUpdated} just now</span>
    </div>
  );
}
