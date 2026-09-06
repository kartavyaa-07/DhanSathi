import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, devanagari, pillLabelStyle, cardStyle, primaryOrDisabled } from '../ui';
import { IconSearch, IconClock, IconMic, IconExternal, IconDownload, IconShare, IconCheck } from './Icons';

export function InsuranceListScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, L, enrolledSchemesList, insuranceSchemesList } = derived;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 20px 110px 20px' }}>
      <div style={{ height: 48, borderRadius: 9999, background: '#fff', border: `1px solid ${C.borderStrong}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
        <IconSearch />
        <span style={{ fontFamily: work, fontSize: 14, color: C.inkFaint }}>{t.searchSchemes}</span>
      </div>

      {enrolledSchemesList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 20, color: C.ink }}>{t.yourProtection}</span>
          {enrolledSchemesList.map(es => (
            <div key={es.id} style={{ borderRadius: 12, background: '#fff', border: `1px solid ${C.borderStrong}`, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 9999, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconCheck color={C.greenDark} size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: work, fontWeight: 600, fontSize: 16, color: C.ink }}>{L(es.nameEn, es.nameHi)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: work, fontSize: 13, color: C.green }}>
                  <span style={{ width: 7, height: 7, borderRadius: 9999, background: C.green, display: 'inline-block' }} />{t.active}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 20, color: C.ink }}>{t.recommendedSchemes}</span>
        {insuranceSchemesList.map(sc => (
          <div key={sc.id} style={{ ...cardStyle, overflow: 'hidden' }}>
            <div onClick={() => actions.onOpenSchemeDetail(sc.id)} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
              <span style={pillLabelStyle}>{L(sc.category, sc.categoryHi)}</span>
              <span style={{ fontFamily: work, fontWeight: 700, fontSize: 17, color: C.ink }}>{sc.nameEn}</span>
              <span style={{ fontFamily: devanagari, fontSize: 13, color: C.inkFaint }}>{sc.nameHi}</span>
              <span style={{ fontFamily: work, fontSize: 14, color: C.inkSoft }}>{L(sc.coverEn, sc.coverHi)}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontFamily: work, fontWeight: 700, fontSize: 15, color: C.green }}>{L(sc.premiumEn, sc.premiumHi)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: work, fontSize: 12, color: C.inkFaint }}><IconClock />{L(sc.time, sc.timeHi)}</span>
              </div>
            </div>
            <button onClick={() => actions.onEnrollWithVaani(sc.id)} style={{ width: '100%', height: 48, border: 'none', borderTop: `1px solid ${C.border}`, background: C.greenBgSoft, color: C.green, fontFamily: work, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IconMic color={C.green} size={15} />{t.enrollWithVaani}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsuranceDetailScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, L, selectedScheme } = derived;
  return (
    <>
      <div onScroll={actions.onScrollTC} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 20px 24px 20px' }}>
        <div style={{ ...cardStyle, padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={pillLabelStyle}>{L(selectedScheme.category, selectedScheme.categoryHi)}</span>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 20, color: C.ink }}>{L(selectedScheme.fullNameEn, selectedScheme.fullNameHi)}</span>
          <span style={{ fontFamily: devanagari, fontSize: 14, color: C.inkFaint }}>{selectedScheme.nameHi}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 15, color: C.ink }}>{t.whatYouPay}</span>
          <div style={{ borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, padding: 14 }}>
            <span style={{ fontFamily: work, fontSize: 14, lineHeight: '21px', color: C.inkSoft }}>{L(selectedScheme.payEn, selectedScheme.payHi)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 15, color: C.ink }}>{t.whatYouGet}</span>
          <div style={{ borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, padding: 14 }}>
            <span style={{ fontFamily: work, fontSize: 14, lineHeight: '21px', color: C.inkSoft }}>{L(selectedScheme.getEn, selectedScheme.getHi)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 15, color: C.ink }}>{t.exitConditions}</span>
          <div style={{ borderRadius: 12, background: C.warnBg, border: `1px solid ${C.warnBorder}`, padding: 14 }}>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.warnInk }}>{t.lockIn}: {L(selectedScheme.lockIn, selectedScheme.lockInHi)}</span>
            <div style={{ height: 6 }} />
            <span style={{ fontFamily: work, fontSize: 14, lineHeight: '21px', color: C.warnInk }}>{L(selectedScheme.exitEn, selectedScheme.exitHi)}</span>
          </div>
        </div>
        <a href={selectedScheme.officialUrl} target="_blank" rel="noreferrer" style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.green, display: 'inline-flex', alignItems: 'center', gap: 5 }}>{t.verifyOfficial}<IconExternal /></a>
        <div style={{ height: 80 }} />
      </div>
      <div style={{ position: 'sticky', bottom: 0, padding: '14px 20px 20px 20px', background: `linear-gradient(180deg,rgba(247,249,251,0) 0%,${C.bg} 35%)`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: work, fontSize: 12, color: C.inkFaint, textAlign: 'center' }}>{s.tcScrolled ? '' : t.scrollTerms}</span>
        <button onClick={actions.onEnrollSelectedScheme} disabled={!s.tcScrolled} style={{ ...primaryOrDisabled(s.tcScrolled), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IconMic size={16} />{t.enrollWithVaani}
        </button>
      </div>
    </>
  );
}

export function EnrollSuccessScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const c = s.certificate;
  if (!c) return null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '28px 20px 24px 20px' }}>
      <div style={{ width: 72, height: 72, borderRadius: 9999, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck color={C.greenDark} size={30} />
      </div>
      <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 20, color: C.ink }}>{t.enrolledSuccess}</span>
      <div style={{ width: '100%', borderRadius: 16, background: '#fff', border: `2px solid ${C.green}`, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 16, color: C.green }}>DhanSathi</span>
          <span style={{ fontFamily: work, fontSize: 11, color: C.inkFaint }}>{t.certificate}</span>
        </div>
        <div style={{ height: 1, background: C.border }} />
        <span style={{ fontFamily: work, fontWeight: 700, fontSize: 18, color: C.ink }}>{derived.L(c.schemeName, c.schemeNameHi)}</span>
        {([['name', c.userName], ['coverageAmount', c.cover], ['premium', c.premium], ['refId', c.refId]] as const).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{(t as any)[key]}</span>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.ink }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, width: '100%' }}>
        <button onClick={actions.onDownloadCertificate} style={{ flex: 1, height: 52, borderRadius: 12, border: `2px solid ${C.green}`, background: '#fff', color: C.green, fontFamily: work, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <IconDownload />{t.download}
        </button>
        <button onClick={actions.onShareCertificate} style={{ flex: 1, height: 52, borderRadius: 12, border: 'none', background: C.green, color: '#fff', fontFamily: work, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <IconShare />{t.share}
        </button>
      </div>
      {s.toastMessage && <span style={{ fontFamily: work, fontSize: 13, color: C.green }}>{s.toastMessage}</span>}
      <button onClick={actions.onBackDashboard} style={{ marginTop: 8, fontFamily: work, fontWeight: 600, fontSize: 14, color: C.inkSoft, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>{t.backToDashboard}</button>
    </div>
  );
}
