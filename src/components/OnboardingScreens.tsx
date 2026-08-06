import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, devanagari, primaryOrDisabled } from '../ui';
import { INCOME_TYPES } from '../data';
import { INCOME_ICONS, IconCheck } from './Icons';

export function LangScreen() {
  const { actions } = useAppStore();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 36, background: `linear-gradient(180deg,${C.bg} 0%,#E6EEE9 100%)` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 88, height: 88, borderRadius: 24, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 36, color: C.greenLight }}>ध</span>
        </div>
        <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: C.ink }}>DhanSathi</span>
        <span style={{ fontFamily: work, fontWeight: 500, fontSize: 15, color: C.inkSoft, textAlign: 'center' }}>Your financial companion, in your language.</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
        <button onClick={() => actions.onChooseLang('hi')} style={{ height: 60, borderRadius: 12, border: 'none', background: C.green, color: '#fff', fontFamily: devanagari, fontWeight: 700, fontSize: 19, cursor: 'pointer' }}>हिंदी में जारी रखें</button>
        <button onClick={() => actions.onChooseLang('en')} style={{ height: 60, borderRadius: 12, border: `2px solid ${C.green}`, background: '#fff', color: C.green, fontFamily: work, fontWeight: 600, fontSize: 17, cursor: 'pointer' }}>Continue in English</button>
      </div>
    </div>
  );
}

export function IncomeScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 100px 20px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 24, color: C.ink }}>{t.incomeTitle}</span>
          <span style={{ fontFamily: work, fontSize: 15, color: C.inkSoft }}>{t.incomeSubtitle}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INCOME_TYPES.map(it => {
            const selected = s.incomeTypeId === it.id;
            const Icon = INCOME_ICONS[it.id];
            return (
              <button key={it.id} onClick={() => actions.onSelectIncomeType(it.id)} style={{ minHeight: 64, borderRadius: 12, border: `2px solid ${selected ? C.green : C.borderStrong}`, background: selected ? C.greenBgSoft : '#fff', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', cursor: 'pointer' }}>
                <span style={{ width: 26, height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon /></span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                  <span style={{ fontFamily: work, fontWeight: 600, fontSize: 16, color: C.ink }}>{it.label}</span>
                  <span style={{ fontFamily: devanagari, fontSize: 13, color: C.inkFaint }}>{it.labelHi}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, padding: '16px 20px 20px 20px', background: `linear-gradient(180deg,rgba(247,249,251,0) 0%,${C.bg} 40%)` }}>
        <button onClick={actions.onContinueIncome} disabled={!s.incomeTypeId} style={primaryOrDisabled(!!s.incomeTypeId)}>{t.continue}</button>
      </div>
    </>
  );
}

export function AntiscamScreen() {
  const { actions, derived } = useAppStore();
  const { t } = derived;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 22px 24px 22px', gap: 20 }}>
      <div style={{ width: 56, height: 56, borderRadius: 9999, background: C.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7v6c0 5.25 3.75 9.75 10 11 6.25-1.25 10-5.75 10-11V7l-10-5z" stroke={C.danger} strokeWidth="1.6" /><path d="M12 8v5M12 16.5h.01" stroke={C.danger} strokeWidth="1.8" strokeLinecap="round" /></svg>
      </div>
      <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 22, color: C.ink }}>{t.antiscamTitle}</span>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ fontFamily: devanagari, fontWeight: 500, fontSize: 17, lineHeight: '26px', color: C.ink }}>DhanSathi कभी OTP, पासवर्ड, या बैंक डिटेल्स फोन या मैसेज पर नहीं मांगेगा। अगर कोई DhanSathi के नाम से मांगे, वह फ्रॉड है।</span>
        <div style={{ height: 1, background: C.border }} />
        <span style={{ fontFamily: work, fontSize: 15, lineHeight: '22px', color: C.inkSoft }}>DhanSathi will never call or message you asking for an OTP, password, or bank details. If anyone claims to be from DhanSathi and asks for these, it is a scam.</span>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={actions.onConfirmAntiscam} style={{ height: 56, borderRadius: 12, border: 'none', background: C.amber, color: '#fff', fontFamily: work, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{t.iUnderstand}</button>
    </div>
  );
}

export function AAScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const PROVIDERS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Other Bank'];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 24px 20px', gap: 18 }}>
      {s.aaStep === 'consent' && (
        <>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 22, color: C.ink }}>{t.aaTitle}</span>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.green }}>{t.aaScopeLabel}</span>
            <span style={{ fontFamily: devanagari, fontSize: 15, lineHeight: '23px', color: C.ink }}>DhanSathi आपके बैंक खाते के पिछले 6 महीने का लेन-देन इतिहास पढ़ेगा। इसका इस्तेमाल सिर्फ आपकी आय समझने के लिए होगा। आप कभी भी सहमति वापस ले सकते हैं।</span>
            <span style={{ fontFamily: work, fontSize: 14, lineHeight: '20px', color: C.inkSoft }}>DhanSathi will read your last 6 months of bank transaction history, used only to understand your income and expenses. You can revoke this consent anytime from Settings — data deletes within 24 hours. This is via RBI-regulated Account Aggregator, not screen-sharing.</span>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={actions.onStartAALink} style={primaryOrDisabled(true)}>{t.linkBank}</button>
          <button onClick={actions.onSkipToManual} style={{ height: 48, border: 'none', background: 'transparent', color: C.inkSoft, fontFamily: work, fontWeight: 600, fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>{t.enterManually}</button>
        </>
      )}
      {s.aaStep === 'providers' && (
        <>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 20, color: C.ink }}>{t.chooseBank}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROVIDERS.map(p => (
              <button key={p} onClick={actions.onSelectProvider} style={{ height: 56, borderRadius: 12, border: `1px solid ${C.borderStrong}`, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: work, fontWeight: 600, fontSize: 15, color: C.ink, cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </>
      )}
      {s.aaStep === 'linking' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 9999, border: `4px solid ${C.border}`, borderTopColor: C.green, animation: 'ds-spin 0.9s linear infinite' }} />
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 15, color: C.inkSoft }}>{t.linking}</span>
        </div>
      )}
      {s.aaStep === 'manual' && (
        <>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 20, color: C.ink }}>{t.manualIncomeTitle}</span>
          <input type="number" placeholder={t.manualIncomePlaceholder} value={s.manualIncome} onChange={e => actions.onManualIncomeChange(e.target.value)} style={{ height: 56, borderRadius: 12, border: `2px solid ${C.borderStrong}`, padding: '0 16px', fontFamily: work, fontSize: 18, color: C.ink }} />
          <div style={{ flex: 1 }} />
          <button onClick={actions.onSubmitManual} disabled={!(parseInt(s.manualIncome, 10) > 0)} style={primaryOrDisabled(parseInt(s.manualIncome, 10) > 0)}>{t.continue}</button>
        </>
      )}
    </div>
  );
}

export function QuizScreen() {
  const { actions, derived } = useAppStore();
  const { currentQuestion, quizProgress } = derived;
  const total = 5;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 24px 20px', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.green }}>{`Question ${quizProgress + 1} of ${total}`}</span>
        <div style={{ height: 6, borderRadius: 9999, background: C.border, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 9999, background: C.green, width: `${((quizProgress + 1) / total) * 100}%` }} />
        </div>
      </div>
      <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 21, color: C.ink, lineHeight: '28px' }}>{currentQuestion.textEn}</span>
      <span style={{ fontFamily: devanagari, fontSize: 15, color: C.inkFaint }}>{currentQuestion.textHi}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {currentQuestion.options.map((opt, i) => (
          <button key={i} onClick={() => actions.onAnswerQuiz(opt.score)} style={{ minHeight: 56, borderRadius: 12, border: `1px solid ${C.borderStrong}`, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '12px 16px', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 15, color: C.ink }}>{opt.en}</span>
            <span style={{ fontFamily: devanagari, fontSize: 13, color: C.inkFaint }}>{opt.hi}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuizResultScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, riskTierDescription } = derived;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 20, textAlign: 'center' }}>
      <div style={{ width: 88, height: 88, borderRadius: 9999, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={36} />
      </div>
      <span style={{ fontFamily: work, fontSize: 14, color: C.inkSoft }}>{t.yourRiskProfile}</span>
      <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 28, color: C.ink }}>{s.riskTier}</span>
      <span style={{ fontFamily: work, fontSize: 15, lineHeight: '22px', color: C.inkSoft }}>{riskTierDescription}</span>
      <button onClick={actions.onContinueToDashboard} style={{ ...primaryOrDisabled(true), marginTop: 12 }}>{t.goToDashboard}</button>
    </div>
  );
}
