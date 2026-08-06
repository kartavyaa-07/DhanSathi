import React, { useEffect, useState } from 'react';
import { useAppStore, type Screen } from '../store';
import { C, jakarta, work } from '../ui';
import { IconHome, IconShield, IconWallet, IconExchange, IconProfile, IconBack, IconMenu, IconMic, Logo } from './Icons';

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 860);
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 860);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isDesktop;
}

const MAIN_HEADER_SCREENS: Screen[] = ['dashboard', 'insurance', 'investlist', 'borrow'];
const SUB_HEADER_SCREENS: Screen[] = ['income', 'antiscam', 'aa', 'quiz', 'quizresult', 'insurancedetail', 'enrollsuccess', 'investdetail', 'borrowcompare', 'profile'];
const BOTTOM_NAV_SCREENS: Screen[] = ['dashboard', 'insurance', 'investlist', 'borrow'];
const FAB_SCREENS: Screen[] = ['dashboard', 'insurance', 'investlist'];
const NO_SIDEBAR_SCREENS: Screen[] = ['splash', 'lang', 'phoneauth', 'otp', 'profiledetails', 'income', 'antiscam', 'aa', 'quiz', 'quizresult'];

function headerTitleFor(screen: Screen, t: any): string {
  const map: Partial<Record<Screen, string>> = {
    income: t.incomeTitle, antiscam: 'DhanSathi', aa: t.aaTitle, quiz: 'Quick Profile', quizresult: t.yourRiskProfile,
    insurancedetail: 'Scheme Details', enrollsuccess: t.enrolledSuccess, investdetail: 'Invest', borrowcompare: t.costComparison, profile: 'Profile',
  };
  return map[screen] || 'DhanSathi';
}

const NAV_TABS = [
  { key: 'dashboard', label: 'Home', Icon: IconHome },
  { key: 'insurance', label: 'Bima', Icon: IconShield },
  { key: 'invest', label: 'Bachat', Icon: IconWallet },
  { key: 'borrow', label: 'Udhaar', Icon: IconExchange },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const { s, actions, derived } = useAppStore();
  const { t } = derived;

  const hasMainHeader = MAIN_HEADER_SCREENS.includes(s.screen);
  const hasSubHeader = SUB_HEADER_SCREENS.includes(s.screen);
  const showBottomNav = BOTTOM_NAV_SCREENS.includes(s.screen);
  const showFab = FAB_SCREENS.includes(s.screen);
  const showBack = !!({ income: 1, antiscam: 1, aa: 1, quiz: 1, insurancedetail: 1, investdetail: 1, borrowcompare: 1, profile: 1 } as any)[s.screen];

  const phoneCard = (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: work }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {hasMainHeader && (
          <div style={{ height: 56, flexShrink: 0, background: C.bg, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'sticky', top: 0, zIndex: 5 }}>
            <button onClick={actions.onOpenProfile} style={{ width: 40, height: 40, borderRadius: 9999, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <IconMenu />
            </button>
            <Logo size={30} />
            <button onClick={actions.onToggleLanguage} style={{ height: 32, padding: '0 12px', borderRadius: 9999, border: `1px solid ${C.borderStrong}`, background: '#fff', fontFamily: work, fontWeight: 600, fontSize: 13, color: C.green, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {s.lang === 'hi' ? 'हि | EN' : 'EN | हि'}
            </button>
          </div>
        )}
        {hasSubHeader && (
          <div style={{ height: 56, flexShrink: 0, background: C.bg, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', position: 'sticky', top: 0, zIndex: 5 }}>
            {showBack && (
              <button onClick={actions.onBack} style={{ width: 40, height: 40, borderRadius: 9999, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <IconBack />
              </button>
            )}
            <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 18, color: C.ink, flex: 1 }}>{headerTitleFor(s.screen, t)}</span>
          </div>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
      </div>

      {showBottomNav && (
        <div style={{ flexShrink: 0, background: '#fff', borderTop: `1px solid ${C.borderStrong}`, boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', display: 'flex', padding: '8px 8px calc(env(safe-area-inset-bottom,0px) + 8px) 8px' }}>
          {NAV_TABS.map(nt => {
            const active = derived.tabActive(nt.key, s.screen);
            const color = active ? C.green : C.inkFaint;
            return (
              <button key={nt.key} onClick={() => actions.onOpenTab(nt.key)} style={{ flex: 1, background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 0', cursor: 'pointer' }}>
                <span style={{ width: 19, height: 19, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <nt.Icon color={color} />
                </span>
                <span style={{ fontFamily: work, fontWeight: 600, fontSize: 11, color }}>{nt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {showFab && (
        <button onClick={actions.onOpenGeneralVaani} style={{ position: 'absolute', right: 20, bottom: 96, width: 60, height: 60, borderRadius: 9999, background: C.green, border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 9 }}>
          <IconMic size={24} />
        </button>
      )}
    </div>
  );

  if (!isDesktop) {
    return <div style={{ height: '100dvh', width: '100%', overflow: 'hidden' }}>{phoneCard}</div>;
  }

  const showSidebar = !NO_SIDEBAR_SCREENS.includes(s.screen);
  const sidebarNavItems = [
    { key: 'dashboard', label: 'Home', Icon: IconHome, active: s.screen === 'dashboard', onClick: () => actions.onOpenTab('dashboard') },
    { key: 'insurance', label: 'Bima', Icon: IconShield, active: derived.tabActive('insurance', s.screen), onClick: () => actions.onOpenTab('insurance') },
    { key: 'invest', label: 'Bachat', Icon: IconWallet, active: derived.tabActive('invest', s.screen), onClick: () => actions.onOpenTab('invest') },
    { key: 'borrow', label: 'Udhaar', Icon: IconExchange, active: derived.tabActive('borrow', s.screen), onClick: () => actions.onOpenTab('borrow') },
    { key: 'profile', label: 'Profile', Icon: IconProfile, active: s.screen === 'profile', onClick: actions.onOpenProfile },
  ];

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', display: 'flex', background: '#EDEFF2', fontFamily: work }}>
      {showSidebar && (
        <div style={{ width: 232, flexShrink: 0, height: '100%', background: C.sidebarBg, display: 'flex', flexDirection: 'column', padding: '24px 14px', gap: 6, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px 26px 10px' }}>
            <Logo size={36} />
            <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 19, color: '#fff' }}>DhanSathi</span>
          </div>
          {sidebarNavItems.map(nt => {
            const color = nt.active ? C.greenLight : C.sidebarInk;
            return (
              <button key={nt.key} onClick={nt.onClick} style={{ height: 44, borderRadius: 10, border: 'none', background: nt.active ? 'rgba(108,248,187,0.12)' : 'transparent', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', cursor: 'pointer', fontFamily: work, fontWeight: 600, fontSize: 14, color, textAlign: 'left' }}>
                <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <nt.Icon color={color} />
                </span>
                <span>{nt.label}</span>
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          <button onClick={actions.onOpenGeneralVaani} style={{ height: 46, borderRadius: 10, border: 'none', background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontFamily: work, fontWeight: 700, fontSize: 13 }}>
            <IconMic size={16} /> Ask Vaani
          </button>
          <button onClick={actions.onToggleLanguage} style={{ height: 40, borderRadius: 9999, border: '1px solid #565E74', background: 'transparent', color: C.sidebarInk, fontFamily: work, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            {s.lang === 'hi' ? 'हि | EN' : 'EN | हि'}
          </button>
        </div>
      )}
      <div style={{ flex: 1, height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '36px 24px', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: 480, height: '100%', flexShrink: 0, background: C.bg, borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.12)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {phoneCard}
        </div>
      </div>
    </div>
  );
}
