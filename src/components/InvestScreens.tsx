import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, cardStyle, primaryOrDisabled, primaryButtonStyle } from '../ui';
import { INVEST_CATEGORIES } from '../data';
import { IconSearch, IconSort, IconCheck } from './Icons';

export function InvestListScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, investmentProductsList } = derived;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: '16px 20px 110px 20px' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, height: 48, borderRadius: 9999, background: '#fff', border: `1px solid ${C.borderStrong}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
          <IconSearch />
          <input value={s.investSearch} onChange={e => actions.onChangeInvestSearch(e.target.value)} placeholder={t.searchInvestments} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: work, fontSize: 14, color: C.ink }} />
        </div>
        <button onClick={actions.onToggleInvestSort} style={{ width: 48, height: 48, borderRadius: 9999, background: s.investSortByReturn ? C.green : '#fff', border: `1px solid ${s.investSortByReturn ? C.green : C.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <IconSort color={s.investSortByReturn ? '#fff' : C.inkFaint} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
        {INVEST_CATEGORIES.map(cat => {
          const active = s.investCategory === cat.key;
          return (
            <button key={cat.key} onClick={() => actions.onSelectInvestCategory(cat.key)} style={{ height: 36, padding: '0 16px', borderRadius: 9999, border: `1px solid ${active ? C.green : C.borderStrong}`, background: active ? C.green : '#fff', color: active ? '#fff' : C.ink, fontFamily: work, fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{cat.label}</button>
          );
        })}
      </div>
      <div style={{ borderRadius: 9999, background: C.greenBg, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.greenDark }}>{t.yourProfile}: {s.riskTier || 'Conservative'} — {t.liquidOptionsShown}</span>
      </div>
      {investmentProductsList.length === 0 && (
        <span style={{ fontFamily: work, fontSize: 14, color: C.inkFaint, textAlign: 'center', padding: '20px 0' }}>{t.noInvestmentsFound}</span>
      )}
      {investmentProductsList.map(p => (
        <div key={p.id} onClick={() => actions.onOpenProduct(p.id)} style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 15, color: C.ink }}>{p.name}</span>
            <span style={{ display: 'inline-block', fontFamily: work, fontWeight: 600, fontSize: 11, color: C.greenDark, background: C.greenBg, borderRadius: 9999, padding: '3px 10px' }}>{p.withdrawBadge}</span>
          </div>
          <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: C.green }}>{p.returnPct}<span style={{ fontSize: 14, fontWeight: 600, color: C.inkFaint }}> {t.annualReturn}</span></span>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkSoft }}>{t.minInvestment}: ₹{p.min} · {p.reg}</span>
        </div>
      ))}
    </div>
  );
}

export function InvestDetailScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, selectedProduct } = derived;
  if (s.investConfirmed) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 20px 24px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: 9999, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCheck color={C.greenDark} size={26} />
          </div>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 19, color: C.ink }}>{t.investmentConfirmed}</span>
          <span style={{ fontFamily: work, fontSize: 14, color: C.inkSoft, textAlign: 'center' }}>₹{s.investAmount} {t.investedIn} {selectedProduct.name}.</span>
          <button onClick={() => actions.onOpenTab('dashboard')} style={primaryButtonStyle}>{t.goToDashboard}</button>
        </div>
      </div>
    );
  }
  const investAmt = parseInt(s.investAmount, 10) || 0;
  const enabled = investAmt >= selectedProduct.min;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 20px 24px 20px' }}>
      <div style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 19, color: C.ink }}>{selectedProduct.name}</span>
        <span style={{ fontFamily: work, fontSize: 13, color: C.inkSoft }}>{selectedProduct.reg}</span>
        <div style={{ display: 'inline-block', width: 'fit-content', marginTop: 8, background: C.greenBg, borderRadius: 9999, padding: '4px 12px' }}>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 13, color: C.greenDark }}>{selectedProduct.withdrawBadge}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: work, fontWeight: 700, fontSize: 15, color: C.ink }}>{t.amountToInvest}</span>
        <input type="number" placeholder={`₹${selectedProduct.min}`} value={s.investAmount} onChange={e => actions.onChangeInvestAmount(e.target.value)} style={{ height: 56, borderRadius: 12, border: `2px solid ${C.borderStrong}`, padding: '0 16px', fontFamily: work, fontSize: 18, color: C.ink }} />
        <span style={{ fontFamily: work, fontSize: 12, color: C.inkFaint }}>{t.minimumIs} ₹{selectedProduct.min}</span>
      </div>
      <div style={{ borderRadius: 12, background: C.greenBgSoft, border: `1px solid ${C.borderStrong}`, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkSoft }}>{t.projected1Month}</span>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.green }}>₹ {derived.fmt(derived.projected1Month)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkSoft }}>{t.projected1Year}</span>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.green }}>₹ {derived.fmt(derived.projected1Year)}</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={actions.onConfirmInvest} disabled={!enabled} style={primaryOrDisabled(enabled)}>{t.confirmInvest}</button>
    </div>
  );
}
