import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, devanagari, primaryButtonStyle, mic } from '../ui';
import { IconBack, IconMic, IconCheck } from './Icons';
import { hasApiKey } from '../lib/claude';

export function VaaniScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const isChat = s.vaaniMode === 'chat';
  const isEnroll = s.vaaniMode === 'enroll';

  const enrollHi = derived.enrollStepContent.hi;
  const enrollEn = derived.enrollStepContent.en;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg,${C.bg} 0%,#E6EAEE 100%)` }}>
      <div style={{ height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px' }}>
        <button onClick={actions.onCloseVaani} style={{ width: 40, height: 40, borderRadius: 9999, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <IconBack />
        </button>
        <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 18, color: C.ink, flex: 1 }}>Vaani</span>
      </div>

      <div style={{ padding: '8px 20px 12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', width: 112, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {s.vaaniListening && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, border: `4px solid ${C.greenLight}`, animation: 'ds-pulse 1.6s ease-out infinite' }} />
          )}
          <div style={{ width: 88, height: 88, borderRadius: 9999, background: C.greenLight, border: `4px solid ${C.bg}`, boxShadow: '0 10px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: C.greenDark }}>वा</span>
          </div>
        </div>
        <span style={{ fontFamily: work, fontSize: 14, color: C.inkSoft }}>
          {s.vaaniListening ? 'Listening…' : s.vaaniLoading ? 'Thinking…' : 'Tap mic or type to talk'}
        </span>
        {!hasApiKey() && isChat && (
          <span style={{ fontFamily: work, fontSize: 12, color: C.danger, textAlign: 'center' }}>
            No Claude API key set — add one in Profile to let Vaani respond.
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '12px 20px 20px 20px' }}>
        {isChat && (
          <>
            {s.vaaniMessages.map((m, i) => {
              const mine = m.role === 'user';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: mine ? 260 : 280,
                    background: mine ? C.sidebarBg : 'rgba(247,249,251,0.9)',
                    color: mine ? '#fff' : undefined,
                    border: mine ? 'none' : `1px solid ${C.borderStrong}`,
                    borderRadius: mine ? '16px 2px 16px 16px' : '2px 16px 16px 16px',
                    padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: mine ? 4 : 6,
                  }}>
                    <span style={{ fontFamily: devanagari, fontWeight: 500, fontSize: 16, lineHeight: '24px', color: mine ? '#fff' : C.ink }}>{m.hi}</span>
                    {!!m.en && <span style={{ fontFamily: work, fontSize: 13, lineHeight: '19px', color: mine ? '#EFF1F3' : C.inkSoft }}>{m.en}</span>}
                  </div>
                </div>
              );
            })}
            {s.vaaniLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(247,249,251,0.9)', border: `1px solid ${C.borderStrong}`, borderRadius: '2px 16px 16px 16px', padding: '12px 16px' }}>
                <span style={{ fontFamily: work, fontSize: 14, color: C.inkFaint }}>{t.vaaniThinking}</span>
              </div>
            )}
            {s.vaaniRecommendation && (
              <div style={{ borderRadius: 12, background: '#fff', border: `2px solid ${C.green}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: work, fontWeight: 700, fontSize: 13, color: C.green }}>
                  <IconCheck size={13} />{t.recommendation}
                </span>
                <span style={{ fontFamily: work, fontSize: 14, color: C.ink, lineHeight: '20px' }}>{s.vaaniRecommendation.summary}</span>
                <button onClick={actions.onGoToRecommendation} style={primaryButtonStyle}>{s.vaaniRecommendation.ctaLabel}</button>
              </div>
            )}
          </>
        )}

        {isEnroll && (
          <>
            <div style={{ alignSelf: 'flex-start', maxWidth: 280, background: 'rgba(247,249,251,0.9)', border: `1px solid ${C.borderStrong}`, borderRadius: '2px 16px 16px 16px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: devanagari, fontWeight: 500, fontSize: 16, lineHeight: '24px', color: C.ink }}>{enrollHi}</span>
              <span style={{ fontFamily: work, fontSize: 14, lineHeight: '20px', color: C.inkSoft }}>{enrollEn}</span>
            </div>
            {s.enrollStep === 1 && (
              <div style={{ borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Row label={t.name} value={s.profileName} />
                <Row label={t.incomeType} value={derived.selectedIncomeTypeLabel} />
                <Row label={t.monthlyIncomeLabel} value={`₹ ${derived.fmt(s.monthlyIncome)}`} />
              </div>
            )}
            {s.enrollStep === 2 && (
              <div style={{ borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9999, background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 8h20L12 2z" fill={C.greenDark} /><path d="M4 10v8h2v-8H4zm5 0v8h2v-8H9zm5 0v8h2v-8h-2zm5 0v8h2v-8h-2zM2 20h20v2H2v-2z" fill={C.greenDark} /></svg>
                </div>
                <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.ink }}>{s.aaLinked ? 'Linked Bank ••••1234' : 'HDFC Bank ••••1234'}</span>
              </div>
            )}
            {s.enrollStep === 3 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 9999, border: `4px solid ${C.border}`, borderTopColor: C.green, animation: 'ds-spin 0.9s linear infinite' }} />
              </div>
            )}
          </>
        )}
      </div>

      {isEnroll && (
        <div style={{ padding: '12px 20px 20px 20px' }}>
          <button onClick={actions.onEnrollContinue} disabled={s.enrollStep === 3} style={{ ...primaryButtonStyle, opacity: s.enrollStep === 3 ? 0.6 : 1 }}>
            {s.enrollStep < 2 ? t.continue : 'Submit Enrollment'}
          </button>
        </div>
      )}

      {isChat && (
        <div style={{ padding: '14px 20px 20px 20px', display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(247,249,251,0.85)', borderTop: `1px solid ${C.borderStrong}` }}>
          <input
            value={s.vaaniTextInput}
            onChange={e => actions.onChangeVaaniText(e.target.value)}
            onKeyDown={actions.onVaaniInputKeydown}
            placeholder={t.typeOrSay}
            style={{ flex: 1, height: 52, borderRadius: 12, border: `2px solid ${C.borderStrong}`, background: C.border, padding: '0 16px', fontFamily: work, fontSize: 15, color: C.ink }}
          />
          <button onClick={actions.onMicToggle} style={mic(s.vaaniListening)}>
            <IconMic />
          </button>
        </div>
      )}
      <span style={{ textAlign: 'center', paddingBottom: 10, fontFamily: work, fontSize: 12, color: C.inkFaint, textDecoration: 'underline' }}>{t.talkToHuman}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{label}</span>
      <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.ink }}>{value}</span>
    </div>
  );
}
