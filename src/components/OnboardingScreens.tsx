import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, devanagari, primaryOrDisabled } from '../ui';
import { INCOME_TYPES } from '../data';
import { INCOME_ICONS, IconCheck, IconBack, Logo } from './Icons';

export function SplashScreen() {
  const { actions } = useAppStore();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 30);
    const advance = setTimeout(() => actions.onSplashDone(), 1600);
    return () => { clearTimeout(show); clearTimeout(advance); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: `linear-gradient(180deg,${C.bg} 0%,#E6EEE9 100%)`, opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      <Logo size={88} />
      <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: C.ink }}>DhanSathi</span>
      <span style={{ fontFamily: work, fontWeight: 500, fontSize: 15, color: C.inkSoft, textAlign: 'center' }}>Your money, made simple.</span>
    </div>
  );
}

export function LangScreen() {
  const { actions } = useAppStore();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 36, background: `linear-gradient(180deg,${C.bg} 0%,#E6EEE9 100%)` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Logo size={88} />
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

export function PhoneAuthScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  const validPhone = s.phoneNumber.length === 10;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 28px 24px', gap: 28, background: `linear-gradient(180deg,${C.greenBgSoft} 0%,${C.bg} 55%)` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <Logo size={64} />
        <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 24, color: C.ink }}>DhanSathi</span>
      </div>
      <div style={{ display: 'flex', borderRadius: 12, border: `1px solid ${C.borderStrong}`, overflow: 'hidden' }}>
        <button onClick={() => actions.onChangeAuthTab('login')} style={{ flex: 1, height: 44, border: 'none', background: s.authTab === 'login' ? '#fff' : 'transparent', color: C.ink, fontFamily: font, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>{t.logIn}</button>
        <button onClick={() => actions.onChangeAuthTab('signup')} style={{ flex: 1, height: 44, border: 'none', background: s.authTab === 'signup' ? '#fff' : 'transparent', color: C.ink, fontFamily: font, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>{t.signUp}</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: C.ink }}>{t.mobileNumber}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 56, borderRadius: 12, border: `1px solid ${C.borderStrong}`, background: '#fff', padding: '0 16px' }}>
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 16, color: C.inkSoft }}>+91</span>
          <div style={{ width: 1, height: 24, background: C.border }} />
          <input value={s.phoneNumber} onChange={e => actions.onChangePhone(e.target.value)} placeholder={t.enterMobileNumber} inputMode="numeric" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: work, fontSize: 16, color: C.ink }} />
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={actions.onRequestOtp} disabled={!validPhone} style={primaryOrDisabled(validPhone)}>{t.getOtp}</button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: work, fontSize: 13, color: C.green, fontWeight: 600 }}>{t.secureAndTrusted}</span>
        <span style={{ fontFamily: font, fontSize: 12, color: C.inkFaint, textAlign: 'center' }}>{t.agreeToTerms}</span>
      </div>
    </div>
  );
}

export function OtpScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const masked = s.phoneNumber ? `+91 ${s.phoneNumber.slice(0, 2)}•••${s.phoneNumber.slice(-3)}` : '+91 ••••••••••';
  const canVerify = s.otpDigits.every(d => d.length === 1);
  const onDigitChange = (i: number, v: string) => {
    actions.onOtpDigitChange(i, v);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px 24px 24px', gap: 20, alignItems: 'center', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: 9999, background: C.greenBgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="7" y="2" width="10" height="20" rx="2" stroke={C.green} strokeWidth="1.8" /><path d="M12 18v.01" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" /></svg>
      </div>
      <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 22, color: C.ink }}>{t.verifyPhone}</span>
      <div>
        <div style={{ fontFamily: font, fontSize: 15, color: C.inkSoft }}>{t.enterOtpSent}</div>
        <div style={{ fontFamily: work, fontSize: 14, color: C.ink, fontWeight: 600, marginTop: 4 }}>{masked}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {s.otpDigits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputsRef.current[i] = el; }}
            value={d}
            onChange={e => onDigitChange(i, e.target.value)}
            inputMode="numeric"
            maxLength={1}
            style={{ width: 44, height: 52, borderRadius: 10, border: `2px solid ${d ? C.green : C.borderStrong}`, textAlign: 'center', fontFamily: work, fontSize: 20, fontWeight: 700, color: C.ink }}
          />
        ))}
      </div>
      <div style={{ fontFamily: font, fontSize: 13, color: C.inkSoft }}>
        {t.didntReceiveCode}{' '}
        {s.otpResendSeconds > 0
          ? <span style={{ color: C.inkFaint }}>{t.resendIn} 00:{String(s.otpResendSeconds).padStart(2, '0')}</span>
          : <button onClick={actions.onResendOtp} style={{ border: 'none', background: 'transparent', color: C.green, fontFamily: font, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>{t.getOtp}</button>}
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={actions.onVerifyOtp} disabled={!canVerify} style={primaryOrDisabled(canVerify)}>{t.verifyAndProceed}</button>
    </div>
  );
}

export function ProfileDetailsScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  const genders: Array<{ id: 'male' | 'female' | 'other'; label: string }> = [
    { id: 'male', label: t.male }, { id: 'female', label: t.female }, { id: 'other', label: t.other },
  ];
  const canContinue = !!(s.profileName.trim() && s.profileDob && s.profileGender && s.profileArea.trim());
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px' }}>
        <button onClick={actions.onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}><IconBack /></button>
        <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 16, color: C.ink }}>DhanSathi</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 20px 100px 20px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 24, color: C.ink }}>{t.personalDetailsTitle}</span>
          <span style={{ fontFamily: font, fontSize: 14, color: C.inkSoft }}>{t.personalDetailsSubtitle}</span>
        </div>
        <OnboardingStepper current={2} />
        <Field label={t.fullName}>
          <input value={s.profileName} onChange={e => actions.onChangeProfileName(e.target.value)} placeholder={t.fullName} style={inputStyle} />
        </Field>
        <Field label={t.dateOfBirth}>
          <input type="date" value={s.profileDob} onChange={e => actions.onChangeProfileDob(e.target.value)} style={inputStyle} />
        </Field>
        <Field label={t.gender}>
          <div style={{ display: 'flex', gap: 10 }}>
            {genders.map(g => {
              const selected = s.profileGender === g.id;
              return (
                <button key={g.id} onClick={() => actions.onChangeProfileGender(g.id)} style={{ flex: 1, height: 68, borderRadius: 12, border: `2px solid ${selected ? C.green : C.borderStrong}`, background: selected ? C.greenBgSoft : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
                  <span style={{ fontFamily: font, fontWeight: 600, fontSize: 13, color: C.ink }}>{g.label}</span>
                </button>
              );
            })}
          </div>
        </Field>
        <Field label={t.residentialArea}>
          <input value={s.profileArea} onChange={e => actions.onChangeProfileArea(e.target.value)} placeholder={t.selectYourArea} style={inputStyle} />
        </Field>
        <div style={{ background: C.greenBgSoft, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 9999, background: C.greenLight, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 15, color: C.green }}>V</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: C.ink }}>{t.needHelp}</span>
            <span style={{ fontFamily: font, fontSize: 12, color: C.inkSoft }}>{t.tapVaaniToSpeak}</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, padding: '16px 20px 20px 20px', background: `linear-gradient(180deg,rgba(247,249,251,0) 0%,${C.bg} 40%)` }}>
        <button onClick={actions.onSubmitProfileDetails} disabled={!canContinue} style={primaryOrDisabled(canContinue)}>{t.continue}</button>
      </div>
    </div>
  );
}

const PROFILE_SETUP_TOTAL_STEPS = 5;

function OnboardingStepper({ current }: { current: number }) {
  const { s, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: font, fontWeight: 600, fontSize: 13, color: C.ink }}>{t.step} {current} {t.of} {PROFILE_SETUP_TOTAL_STEPS}</span>
        <span style={{ fontFamily: font, fontSize: 12, color: C.inkFaint }}>{t.profileSetup}</span>
      </div>
      <div style={{ height: 6, borderRadius: 9999, background: C.border, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 9999, background: C.green, width: `${(current / PROFILE_SETUP_TOTAL_STEPS) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.ink }}>{label}</span>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = { height: 52, borderRadius: 12, border: `1px solid ${C.borderStrong}`, padding: '0 14px', fontFamily: work, fontSize: 15, color: C.ink, width: '100%', boxSizing: 'border-box' };

export function IncomeScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 100px 20px', gap: 20 }}>
        <OnboardingStepper current={3} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 24, color: C.ink }}>{t.occupationTitle}</span>
          <span style={{ fontFamily: font, fontSize: 15, color: C.inkSoft }}>{t.occupationSubtitle}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INCOME_TYPES.map(it => {
            const selected = s.incomeTypeId === it.id;
            const Icon = INCOME_ICONS[it.id];
            const label = s.lang === 'hi' ? it.labelHi : it.label;
            const sublabel = s.lang === 'hi' ? it.sublabelHi : it.sublabel;
            return (
              <button key={it.id} onClick={() => actions.onSelectIncomeType(it.id)} style={{ minHeight: 64, borderRadius: 12, border: `2px solid ${selected ? C.green : C.borderStrong}`, background: selected ? C.greenBgSoft : '#fff', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', cursor: 'pointer' }}>
                <span style={{ width: 26, height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon /></span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                  <span style={{ fontFamily: font, fontWeight: 600, fontSize: 16, color: C.ink }}>{label}</span>
                  <span style={{ fontFamily: font, fontSize: 13, color: C.inkFaint }}>{sublabel}</span>
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
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 22px 24px 22px', gap: 20 }}>
      <OnboardingStepper current={4} />
      <div style={{ width: 56, height: 56, borderRadius: 9999, background: C.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7v6c0 5.25 3.75 9.75 10 11 6.25-1.25 10-5.75 10-11V7l-10-5z" stroke={C.danger} strokeWidth="1.6" /><path d="M12 8v5M12 16.5h.01" stroke={C.danger} strokeWidth="1.8" strokeLinecap="round" /></svg>
      </div>
      <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 22, color: C.ink }}>{t.antiscamTitle}</span>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
        <span style={{ fontFamily: font, fontWeight: 500, fontSize: 16, lineHeight: '24px', color: C.ink }}>{t.antiscamBody}</span>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={actions.onConfirmAntiscam} style={{ height: 56, borderRadius: 12, border: 'none', background: C.amber, color: '#fff', fontFamily: font, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{t.iUnderstand}</button>
    </div>
  );
}

export function AAScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  const PROVIDERS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Other Bank'];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 24px 20px', gap: 18 }}>
      <OnboardingStepper current={5} />
      {s.aaStep === 'consent' && (
        <>
          <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 22, color: C.ink }}>{t.aaTitle}</span>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.green }}>{t.aaScopeLabel}</span>
            <span style={{ fontFamily: font, fontSize: 15, lineHeight: '23px', color: C.ink }}>{t.aaConsentBody}</span>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={actions.onStartAALink} style={primaryOrDisabled(true)}>{t.linkBank}</button>
          <button onClick={actions.onSkipToManual} style={{ height: 48, border: 'none', background: 'transparent', color: C.inkSoft, fontFamily: font, fontWeight: 600, fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>{t.enterManually}</button>
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
          <span style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: C.inkSoft }}>{t.linking}</span>
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
  const { s, actions, derived } = useAppStore();
  const { currentQuestion, quizProgress } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  const total = 5;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 24px 20px', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.green }}>{`Question ${quizProgress + 1} of ${total}`}</span>
        <div style={{ height: 6, borderRadius: 9999, background: C.border, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 9999, background: C.green, width: `${((quizProgress + 1) / total) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 21, color: C.ink, lineHeight: '28px' }}>{s.lang === 'hi' ? currentQuestion.textHi : currentQuestion.textEn}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {currentQuestion.options.map((opt, i) => (
          <button key={i} onClick={() => actions.onAnswerQuiz(opt.score)} style={{ minHeight: 56, borderRadius: 12, border: `1px solid ${C.borderStrong}`, background: '#fff', display: 'flex', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: C.ink }}>{s.lang === 'hi' ? opt.hi : opt.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuizResultScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, riskTierDescription } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  const [visible, setVisible] = useState(false);
  useEffect(() => { const id = setTimeout(() => setVisible(true), 30); return () => clearTimeout(id); }, []);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 16, textAlign: 'center', background: `linear-gradient(180deg,${C.greenBgSoft} 0%,${C.bg} 60%)`, opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      <div style={{ width: 88, height: 88, borderRadius: 9999, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={36} />
      </div>
      <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 24, color: C.ink }}>{t.riskDoneHeadline}</span>
      <span style={{ fontFamily: font, fontSize: 14, color: C.inkSoft }}>{t.riskDoneSubtext}</span>
      <div style={{ height: 1, width: 40, background: C.border, margin: '8px 0' }} />
      <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.yourRiskProfile}</span>
      <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: C.green }}>{s.riskTier}</span>
      <span style={{ fontFamily: font, fontSize: 15, lineHeight: '22px', color: C.inkSoft, maxWidth: 320 }}>{riskTierDescription}</span>
      <button onClick={actions.onContinueToDashboard} style={{ ...primaryOrDisabled(true), marginTop: 16 }}>{t.goToDashboard}</button>
    </div>
  );
}
