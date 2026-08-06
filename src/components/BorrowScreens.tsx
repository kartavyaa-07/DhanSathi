import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, devanagari, primaryOrDisabled, mic } from '../ui';
import { IconMic, IconExternal } from './Icons';

export function BorrowScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const amount = parseInt(s.borrowAmount, 10) || 0;
  const months = parseInt(s.borrowMonths, 10) || 0;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg,${C.bg} 0%,#E6EAEE 100%)` }}>
      <div style={{ padding: '24px 20px 12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {s.borrowListening && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, border: `4px solid ${C.greenLight}`, animation: 'ds-pulse 1.6s ease-out infinite' }} />
          )}
          <div style={{ width: 80, height: 80, borderRadius: 9999, background: C.greenLight, border: `4px solid ${C.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 26, color: C.greenDark }}>वा</span>
          </div>
        </div>
        <span style={{ fontFamily: devanagari, fontWeight: 600, fontSize: 18, color: C.ink }}>कितने रुपये चाहिए और कितने समय के लिए?</span>
        <span style={{ fontFamily: work, fontSize: 14, color: C.inkSoft }}>{t.borrowingQuestion}</span>
      </div>
      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input type="number" placeholder={t.amountPlaceholder} value={s.borrowAmount} onChange={e => actions.onChangeBorrowAmount(e.target.value)} style={{ height: 56, borderRadius: 12, border: `2px solid ${C.borderStrong}`, padding: '0 16px', fontFamily: work, fontSize: 16, color: C.ink }} />
        <input type="number" placeholder={t.termPlaceholder} value={s.borrowMonths} onChange={e => actions.onChangeBorrowMonths(e.target.value)} style={{ height: 56, borderRadius: 12, border: `2px solid ${C.borderStrong}`, padding: '0 16px', fontFamily: work, fontSize: 16, color: C.ink }} />
        <button onClick={actions.onMicToggle} style={{ ...mic(s.borrowListening), alignSelf: 'center' }}><IconMic /></button>
        <div style={{ flex: 1 }} />
        <button onClick={actions.onSubmitBorrow} disabled={!(amount > 0 && months > 0)} style={primaryOrDisabled(amount > 0 && months > 0)}>{t.seeMyOptions}</button>
        <button onClick={actions.onSkipVaani} style={{ height: 44, border: 'none', background: 'transparent', color: C.inkSoft, fontFamily: work, fontWeight: 600, fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}>{t.skipShowOptions}</button>
      </div>
    </div>
  );
}

export function BorrowCompareScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, moneylenderInterest, mudraInterest, borrowSavings, fmt } = derived;
  const savingsSufficient = (parseInt(s.borrowAmount, 10) || 0) > 0 && (parseInt(s.borrowAmount, 10) || 0) <= s.savingsBalance;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: '20px 20px 24px 20px' }}>
      {savingsSufficient && (
        <div style={{ borderRadius: 12, background: C.greenBg, border: `1px solid ${C.greenLight}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.greenDark }}>{t.useSavingsTitle}</span>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkSoft }}>{t.useSavingsBody} ₹{fmt(s.savingsBalance)}.</span>
          <button onClick={actions.onUseSavings} style={{ height: 44, borderRadius: 9999, border: 'none', background: C.green, color: '#fff', fontFamily: work, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{t.useSavingsCta}</button>
        </div>
      )}
      <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 19, color: C.ink }}>{t.costComparison}</span>
      <div style={{ borderRadius: 12, background: C.warnBg, border: `1px solid ${C.warnBorder}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.warnInk }}>{t.moneylender}</span>
        <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 24, color: C.warnInk }}>₹{fmt(moneylenderInterest)}</span>
        <span style={{ fontFamily: work, fontSize: 12, color: C.warnInk }}>{t.totalInterestFor} ₹{s.borrowAmount}, {s.borrowMonths} {t.months} · ~5%/{t.monthShort}</span>
      </div>
      <div style={{ borderRadius: 12, background: C.greenBg, border: `2px solid ${C.green}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.greenDark }}>PM Mudra ({t.govtScheme})</span>
        <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 24, color: C.greenDark }}>₹{fmt(mudraInterest)}</span>
        <span style={{ fontFamily: work, fontSize: 12, color: C.greenDark }}>{t.totalInterestFor} ₹{s.borrowAmount}, {s.borrowMonths} {t.months} · 10.5%/{t.yearShort}</span>
      </div>
      <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.ink, textAlign: 'center' }}>{t.youSave} ₹{fmt(borrowSavings)}</span>
      <a href="https://www.jansamarth.in" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
        <div style={{ height: 56, borderRadius: 12, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: work, fontWeight: 700, fontSize: 15 }}>
          {t.applyMudra}<IconExternal color="#fff" />
        </div>
      </a>
    </div>
  );
}
