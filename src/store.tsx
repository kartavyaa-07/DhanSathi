import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { EN, HI, SCHEMES, INVESTMENTS, QUIZ, INCOME_TYPES, fmt, trackerCategories, trackerEntryLabel, importedEntries, type TrackerEntry } from './data';
import { buildVaaniSystemPrompt, completeVaaniTurn, parseVaaniReply, reconcileAction, ClaudeApiError } from './lib/claude';
import { speak, stopSpeaking, listenOnce, type RecognitionHandle } from './lib/voice';
import { downloadCertificatePdf } from './lib/pdf';

export type Screen =
  | 'splash' | 'lang' | 'phoneauth' | 'otp' | 'profiledetails'
  | 'income' | 'antiscam' | 'aa' | 'quiz' | 'quizresult' | 'dashboard'
  | 'insurance' | 'insurancedetail' | 'vaani' | 'enrollsuccess'
  | 'investlist' | 'investdetail' | 'borrow' | 'borrowcompare' | 'profile' | 'tracker' | 'editprofile';

/** Working copy of the onboarding details while the user edits them, so backing out discards the changes. */
export interface ProfileDraft {
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other' | null;
  area: string;
  incomeTypeId: string | null;
  income: string;
}

export interface VaaniMessage { role: 'user' | 'assistant'; hi: string; en: string }
export interface Certificate { schemeName: string; schemeNameHi: string; userName: string; cover: string; premium: string; refId: string }
export interface VaaniRecommendation {
  summary: string;
  ctaLabel: string;
  action: string;
  /** Who actually runs the recommended product — DhanSathi never claims it as its own. */
  schemeName: string;
  provider: string;
  url: string;
}

export interface AppState {
  screen: Screen;
  lang: 'en' | 'hi';
  phoneNumber: string;
  authTab: 'login' | 'signup';
  otpDigits: string[];
  otpResendSeconds: number;
  profileDob: string;
  profileGender: 'male' | 'female' | 'other' | null;
  profileArea: string;
  incomeTypeId: string | null;
  aaStep: 'consent' | 'providers' | 'linking' | 'manual' | 'done';
  aaLinked: boolean;
  manualIncome: string;
  /**
   * The monthly income the user stated during onboarding. It is the only
   * money figure held in state: income, expenses, balance and budget are all
   * computed from this plus the tracker ledger, so nothing on screen is a
   * number the user never gave us.
   */
  declaredIncome: number;
  quizIndex: number;
  riskScore: number;
  riskTier: 'Conservative' | 'Moderate' | 'Growth' | null;
  enrolledSchemes: string[];
  selectedSchemeId: string | null;
  tcScrolled: boolean;
  vaaniOpen: boolean;
  vaaniMode: 'general' | 'chat' | 'enroll';
  vaaniMessages: VaaniMessage[];
  vaaniHistory: { role: 'user' | 'assistant'; content: string }[];
  vaaniListening: boolean;
  vaaniLoading: boolean;
  vaaniTextInput: string;
  vaaniQuestionCount: number;
  vaaniRecommendation: VaaniRecommendation | null;
  vaaniReturnScreen: Screen;
  vaaniError: string;
  enrollSchemeId: string | null;
  enrollStep: number;
  certificate: Certificate | null;
  toastMessage: string;
  investedAmount: number;
  selectedInvestId: string | null;
  investAmount: string;
  investConfirmed: boolean;
  investSearch: string;
  investCategory: string;
  investSortByReturn: boolean;
  borrowAmount: string;
  borrowMonths: string;
  borrowListening: boolean;
  profileName: string;
  // ---- financial tracker ----
  trackerKind: 'income' | 'expense';
  trackerAmount: string;
  trackerCategoryId: string | null;
  trackerCustomCategory: string;
  trackerEntries: TrackerEntry[];
  /** Where to go back to after logging an entry — the tracker is reachable from both home and profile. */
  trackerReturnScreen: Screen;
  profileDraft: ProfileDraft | null;
  // Where the AA link flow should return to. null = the onboarding path (quiz).
  aaReturnScreen: Screen | null;
}

const initialState: AppState = {
  screen: 'splash', lang: 'en',
  phoneNumber: '', authTab: 'login', otpDigits: ['', '', '', '', '', ''], otpResendSeconds: 45,
  profileDob: '', profileGender: null, profileArea: '',
  incomeTypeId: null,
  aaStep: 'consent', aaLinked: false, manualIncome: '', declaredIncome: 0,
  quizIndex: 0, riskScore: 0, riskTier: null,
  enrolledSchemes: [], selectedSchemeId: null, tcScrolled: false,
  vaaniOpen: false, vaaniMode: 'general', vaaniMessages: [], vaaniHistory: [], vaaniListening: false, vaaniLoading: false,
  vaaniTextInput: '', vaaniQuestionCount: 0, vaaniRecommendation: null, vaaniReturnScreen: 'dashboard', vaaniError: '',
  enrollSchemeId: null, enrollStep: 0,
  certificate: null, toastMessage: '',
  investedAmount: 0, selectedInvestId: null, investAmount: '', investConfirmed: false,
  investSearch: '', investCategory: 'all', investSortByReturn: false,
  borrowAmount: '', borrowMonths: '3', borrowListening: false,
  profileName: 'Truptimayee',
  trackerKind: 'expense', trackerAmount: '', trackerCategoryId: null, trackerCustomCategory: '',
  trackerEntries: [], trackerReturnScreen: 'profile', aaReturnScreen: null, profileDraft: null,
};

const BACK_MAP: Partial<Record<Screen, Screen>> = {
  phoneauth: 'lang', otp: 'phoneauth', profiledetails: 'otp',
  income: 'profiledetails', antiscam: 'income', aa: 'antiscam', quiz: 'aa',
  insurancedetail: 'insurance', investdetail: 'investlist', borrowcompare: 'borrow', profile: 'dashboard',
  tracker: 'profile',
  editprofile: 'profile',
};

function enrollStepContent(schemeId: string | null, step: number) {
  const sc = SCHEMES.find(s => s.id === schemeId);
  const steps = [
    { hi: `चलिए ${sc?.nameHi || sc?.nameEn} शुरू करते हैं। आप देंगे ${sc?.premiumHi}, और मिलेगा ${sc?.coverHi}। कोई लॉक-इन नहीं है।`, en: `Let's start your ${sc?.nameEn}. You pay ${sc?.premiumEn}, you get ${sc?.coverEn}. There is no lock-in.` },
    { hi: `मैं आपकी प्रोफाइल से यह जानकारी ले रही हूं। कृपया जांच लें।`, en: `I'm using these details from your profile. Please confirm they're correct.` },
    { hi: `भुगतान आपके जुड़े हुए बैंक खाते से होगा।`, en: `The payment will go from your linked bank account.` },
    { hi: `बहुत बढ़िया! मैं आपका आवेदन जमा कर रही हूं...`, en: `Great! Submitting your enrollment now...` },
  ];
  // Vaani chat is intentionally bilingual-always — kept out of the onboarding
  // strict-single-language rule. `lang` param retained for callers that want
  // to pick a single string for voice playback (see speak() call sites).
  return steps[step] || steps[0];
}

function actionLabel(action: string, hasUrl: boolean, t: typeof EN): string {
  if (action === 'explore_scheme') return hasUrl ? t.ctaOpenOfficial : t.ctaAskDetails;
  const labels: Record<string, string> = {
    enroll_pmsby: t.ctaEnrollPmsby, enroll_pmjjby: t.ctaEnrollPmjjby, enroll_pmjay: t.ctaEnrollPmjay,
    enroll_hospicash: t.ctaEnrollHospicash, invest: t.ctaInvest, borrow_compare: t.ctaBorrowCompare,
  };
  return labels[action] || t.continue;
}

/** Display name for a risk tier in the active language. */
function riskTierLabel(tier: AppState['riskTier'], t: typeof EN): string {
  if (tier === 'Conservative') return t.riskConservative;
  if (tier === 'Moderate') return t.riskModerate;
  if (tier === 'Growth') return t.riskGrowth;
  return '—';
}

function profileDraftValid(d: ProfileDraft): boolean {
  return !!(d.name.trim() && d.dob && d.gender && d.area.trim() && d.incomeTypeId && parseInt(d.income, 10) > 0);
}

function trackerEntryValid(s: AppState): boolean {
  const amount = parseFloat(s.trackerAmount);
  if (!(amount > 0)) return false;
  if (!s.trackerCategoryId) return false;
  if (s.trackerCategoryId === 'other' && !s.trackerCustomCategory.trim()) return false;
  return true;
}

function riskDescription(tier: string | null, t: typeof EN): string {
  if (tier === 'Conservative') return t.riskConservativeDesc;
  if (tier === 'Moderate') return t.riskModerateDesc;
  return t.riskGrowthDesc;
}

export function useAppStoreImpl() {
  const [s, setS] = useState<AppState>(initialState);
  const recognitionRef = useRef<RecognitionHandle | null>(null);

  const t = s.lang === 'hi' ? HI : EN;

  const patch = useCallback((p: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    setS(prev => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));
  }, []);

  // ---- money, derived from onboarding input + the tracker ledger ----
  const trackedIncomeTotal = s.trackerEntries.filter(e => e.kind === 'income').reduce((a, e) => a + e.amount, 0);
  const trackedExpenseTotal = s.trackerEntries.filter(e => e.kind === 'expense').reduce((a, e) => a + e.amount, 0);
  const monthlyIncome = s.declaredIncome + trackedIncomeTotal;
  const monthlyExpenses = trackedExpenseTotal;
  const availableBalance = Math.max(monthlyIncome - monthlyExpenses - s.investedAmount, 0);
  // Spending is measured against what actually came in, not an arbitrary cap.
  const monthlyBudget = monthlyIncome;
  const budgetUsedPct = monthlyBudget > 0 ? Math.round((monthlyExpenses / monthlyBudget) * 100) : 0;
  // Share of this month's income still unspent — 0-100, and 0 when nothing is known yet.
  const healthScore = monthlyIncome > 0
    ? Math.max(0, Math.min(100, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)))
    : 0;

  // ---- navigation ----
  const onSplashDone = () => patch({ screen: 'lang' });
  const onChooseLang = (l: 'en' | 'hi') => patch({ lang: l, screen: 'phoneauth' });
  const onToggleLanguage = () => patch(p => ({ lang: p.lang === 'hi' ? 'en' : 'hi' }));
  const onOpenProfile = () => patch({ screen: 'profile' });
  const onBack = () => {
    if (s.screen === 'aa' && s.aaReturnScreen) { patch({ screen: s.aaReturnScreen, aaReturnScreen: null }); return; }
    if (s.screen === 'tracker') { patch({ screen: s.trackerReturnScreen }); return; }
    const b = BACK_MAP[s.screen];
    if (b) patch({ screen: b });
  };
  const onOpenTab = (tab: string) => {
    const map: Record<string, Screen> = { dashboard: 'dashboard', bima: 'insurance', insurance: 'insurance', bachat: 'investlist', invest: 'investlist', udhaar: 'borrow', borrow: 'borrow' };
    patch({ screen: map[tab] || 'dashboard' });
  };

  // ---- phone / OTP auth ----
  const otpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startOtpCountdown = () => {
    if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    otpTimerRef.current = setInterval(() => {
      patch(prev => {
        if (prev.otpResendSeconds <= 1) {
          if (otpTimerRef.current) clearInterval(otpTimerRef.current);
          return { otpResendSeconds: 0 };
        }
        return { otpResendSeconds: prev.otpResendSeconds - 1 };
      });
    }, 1000);
  };
  const onChangePhone = (v: string) => patch({ phoneNumber: v.replace(/\D/g, '').slice(0, 10) });
  const onChangeAuthTab = (tab: 'login' | 'signup') => patch({ authTab: tab });
  const onRequestOtp = () => {
    if (s.phoneNumber.length !== 10) return;
    patch({ screen: 'otp', otpDigits: ['', '', '', '', '', ''], otpResendSeconds: 45 });
    startOtpCountdown();
  };
  const onOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    patch(prev => {
      const next = [...prev.otpDigits];
      next[index] = digit;
      return { otpDigits: next };
    });
  };
  const onResendOtp = () => { patch({ otpResendSeconds: 45 }); startOtpCountdown(); };
  const onVerifyOtp = () => { if (s.otpDigits.every(d => d.length === 1)) patch({ screen: 'profiledetails' }); };

  // ---- personal details ----
  const onChangeProfileName = (v: string) => patch({ profileName: v });
  const onChangeProfileDob = (v: string) => patch({ profileDob: v });
  const onChangeProfileGender = (g: 'male' | 'female' | 'other') => patch({ profileGender: g });
  const onChangeProfileArea = (v: string) => patch({ profileArea: v });
  const onSubmitProfileDetails = () => {
    if (s.profileName.trim() && s.profileDob && s.profileGender && s.profileArea.trim()) patch({ screen: 'income' });
  };

  const showToast = (msg: string) => {
    patch({ toastMessage: msg });
    setTimeout(() => patch({ toastMessage: '' }), 2400);
  };

  // ---- profile editor ----
  // The editor works on a draft so leaving without saving changes nothing —
  // these fields feed the money figures and Vaani's context, so a stray
  // keystroke should not be able to rewrite them.
  const onOpenProfileEditor = () => patch(prev => ({
    screen: 'editprofile',
    profileDraft: {
      name: prev.profileName,
      dob: prev.profileDob,
      gender: prev.profileGender,
      area: prev.profileArea,
      incomeTypeId: prev.incomeTypeId,
      income: prev.declaredIncome ? String(prev.declaredIncome) : '',
    },
  }));

  const onChangeProfileDraft = (p: Partial<ProfileDraft>) =>
    patch(prev => (prev.profileDraft ? { profileDraft: { ...prev.profileDraft, ...p } } : {}));

  const onCancelProfileEdits = () => patch({ screen: 'profile', profileDraft: null });

  const onSaveProfileEdits = () => {
    const d = s.profileDraft;
    if (!d || !profileDraftValid(d)) return;
    patch({
      profileName: d.name.trim(),
      profileDob: d.dob,
      profileGender: d.gender,
      profileArea: d.area.trim(),
      incomeTypeId: d.incomeTypeId,
      declaredIncome: parseInt(d.income, 10) || 0,
      profileDraft: null,
      screen: 'profile',
    });
    showToast(t.detailsUpdated);
  };

  // ---- onboarding ----
  const onSelectIncomeType = (id: string) => patch({ incomeTypeId: id });
  const onContinueIncome = () => { if (s.incomeTypeId) patch({ screen: 'antiscam' }); };
  const onConfirmAntiscam = () => patch({ screen: 'aa' });
  const onStartAALink = () => patch({ aaStep: 'providers' });
  const onSkipToManual = () => patch({ aaStep: 'manual' });
  const onSelectProvider = () => {
    patch({ aaStep: 'linking' });
    setTimeout(() => patch(prev => ({
      aaStep: 'done', aaLinked: true,
      trackerEntries: [
        ...prev.trackerEntries.filter(e => e.source === 'manual'),
        ...importedEntries(Date.now()),
      ].sort((a, b) => b.at - a.at),
      screen: prev.aaReturnScreen || 'quiz', aaReturnScreen: null,
    })), 1600);
  };
  const onManualIncomeChange = (v: string) => patch({ manualIncome: v });
  const onSubmitManual = () => {
    const v = parseInt(s.manualIncome, 10);
    // Expenses start empty: they are whatever the user logs, never a guess
    // derived from income.
    if (v > 0) patch(prev => ({
      declaredIncome: v, aaLinked: false,
      screen: prev.aaReturnScreen || 'quiz', aaReturnScreen: null,
    }));
  };

  const onAnswerQuiz = (score: number) => {
    patch(prev => {
      if (prev.quizIndex >= QUIZ.length) return {};
      const nextScore = prev.riskScore + score;
      const nextIndex = prev.quizIndex + 1;
      if (nextIndex >= QUIZ.length) {
        const tier = nextScore >= 8 ? 'Growth' : nextScore >= 4 ? 'Moderate' : 'Conservative';
        return { quizIndex: nextIndex, riskScore: nextScore, riskTier: tier as AppState['riskTier'], screen: 'quizresult' };
      }
      return { quizIndex: nextIndex, riskScore: nextScore };
    });
  };
  const onContinueToDashboard = () => patch({ screen: 'dashboard' });
  const onRetakeQuiz = () => patch({ quizIndex: 0, riskScore: 0, riskTier: null, screen: 'quiz' });

  // ---- insurance ----
  const onOpenSchemeDetail = (id: string) => patch({ selectedSchemeId: id, tcScrolled: false, screen: 'insurancedetail' });
  // Unlocks the enroll button once the end of the terms has actually been on
  // screen. This used to compare scrollTop against the detail pane's own
  // scrollHeight, but that pane never scrolls — the Shell's outer container
  // does — so the handler never fired and the button stayed disabled forever.
  // The screen now reports the sentinel coming into view instead, which does
  // not care which ancestor is doing the scrolling.
  const onTermsRead = () => patch(prev => (prev.tcScrolled ? {} : { tcScrolled: true }));

  const onEnrollWithVaani = (schemeId: string) => {
    patch(p => ({ vaaniOpen: true, vaaniMode: 'enroll', enrollSchemeId: schemeId, enrollStep: 0, screen: 'vaani', vaaniReturnScreen: p.screen }));
    speak(enrollStepContent(schemeId, 0)[s.lang], s.lang);
  };
  const onEnrollSelectedScheme = () => { if (s.selectedSchemeId) onEnrollWithVaani(s.selectedSchemeId); };

  const onEnrollContinue = () => {
    const { enrollSchemeId, enrollStep } = s;
    if (enrollStep < 2) {
      const next = enrollStep + 1;
      patch({ enrollStep: next });
      speak(enrollStepContent(enrollSchemeId, next)[s.lang], s.lang);
    } else {
      patch({ enrollStep: 3 });
      speak(enrollStepContent(enrollSchemeId, 3)[s.lang], s.lang);
      setTimeout(() => {
        const sc = SCHEMES.find(x => x.id === enrollSchemeId);
        if (!sc) return;
        const ref = 'DS-' + Math.floor(100000 + Math.random() * 900000);
        patch(prev => ({
          enrolledSchemes: [...prev.enrolledSchemes, enrollSchemeId!],
          certificate: { schemeName: sc.fullNameEn, schemeNameHi: sc.fullNameHi, userName: prev.profileName, cover: sc.cover, premium: sc.premium, refId: ref },
          screen: 'enrollsuccess', vaaniOpen: false,
        }));
      }, 1400);
    }
  };

  const onDownloadCertificate = () => {
    if (s.certificate) downloadCertificatePdf(s.certificate);
    patch({ toastMessage: t.certificateDownloaded });
    setTimeout(() => patch({ toastMessage: '' }), 2500);
  };
  const onShareCertificate = () => {
    const c = s.certificate;
    if (!c) return;
    const name = s.lang === 'hi' ? c.schemeNameHi : c.schemeName;
    const text = `${t.shareEnrolledPrefix} ${name} ${t.shareEnrolledSuffix} ${c.cover} ${t.shareCoverFor} ${c.premium}.`;
    if ((navigator as any).share) {
      (navigator as any).share({ title: 'DhanSathi', text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };
  const onBackDashboard = () => patch({ screen: 'dashboard' });

  const onCloseVaani = () => {
    stopSpeaking();
    if (recognitionRef.current) recognitionRef.current.stop();
    patch(p => ({ vaaniOpen: false, screen: p.vaaniReturnScreen || 'dashboard' }));
  };

  // ---- Vaani general chat (Claude) ----
  const onOpenGeneralVaani = () => {
    const mode = s.screen === 'insurance' ? 'insurance' : s.screen === 'investlist' ? 'investment' : 'general';
    const greet = mode === 'insurance'
      ? { hi: 'नमस्ते! मैं आपकी बीमा चुनने में मदद कर सकती हूं। क्या आप PMSBY के बारे में जानना चाहेंगे?', en: 'Hello! I can help you choose insurance. Would you like to know about PMSBY?' }
      : { hi: 'नमस्ते! मैं वाणी हूं, आपकी वित्तीय साथी। मैं आपकी कैसे मदद कर सकती हूं?', en: "Hi, I'm Vaani, your financial companion. How can I help you today?" };
    patch(p => ({
      vaaniOpen: true, vaaniMode: 'chat', screen: 'vaani', vaaniReturnScreen: p.screen,
      vaaniMessages: [{ role: 'assistant', hi: greet.hi, en: greet.en }],
      vaaniHistory: [{ role: 'assistant', content: `${greet.hi}\n${greet.en}\nNEXT_ACTION: none` }],
      vaaniQuestionCount: 1, vaaniRecommendation: null, vaaniError: '',
    }));
    speak(greet.hi, 'hi');
  };

  const sendVaaniUserMessage = async (text: string) => {
    if (!text || !text.trim()) return;
    const userMsg: VaaniMessage = { role: 'user', hi: text, en: '' };
    patch(prev => ({
      vaaniMessages: [...prev.vaaniMessages, userMsg],
      vaaniHistory: [...prev.vaaniHistory, { role: 'user', content: text }],
      vaaniTextInput: '', vaaniLoading: true, vaaniError: '',
    }));
    try {
      const system = buildVaaniSystemPrompt({
        incomeTypeId: s.incomeTypeId, monthlyIncome, monthlyExpenses,
        riskTier: s.riskTier, enrolledSchemes: s.enrolledSchemes, vaaniQuestionCount: s.vaaniQuestionCount,
      });
      const history = [...s.vaaniHistory, { role: 'user' as const, content: text }];
      const raw = await completeVaaniTurn(system, history);
      const parsed = reconcileAction(parseVaaniReply(raw));
      const isFinal = parsed.action !== 'none';
      patch(prev => ({
        vaaniMessages: [...prev.vaaniMessages, { role: 'assistant', hi: parsed.hi, en: parsed.en }],
        vaaniHistory: [...prev.vaaniHistory, { role: 'assistant', content: raw }],
        vaaniLoading: false,
        vaaniQuestionCount: isFinal ? prev.vaaniQuestionCount : prev.vaaniQuestionCount + 1,
        vaaniRecommendation: isFinal ? (() => {
          // A follow-up ("what documents do I need?") often drops the SCHEME
          // line — keep showing the attribution from the recommendation it
          // is answering about rather than blanking the card.
          const carry = parsed.schemeName || parsed.provider ? parsed : (prev.vaaniRecommendation || parsed);
          const url = parsed.url || (parsed.schemeName ? '' : prev.vaaniRecommendation?.url || '');
          return {
            summary: parsed.en || parsed.hi,
            ctaLabel: actionLabel(parsed.action, !!url, t),
            action: parsed.action,
            schemeName: carry.schemeName,
            provider: carry.provider,
            url,
          };
        })() : prev.vaaniRecommendation,
      }));
      speak(parsed.hi, 'hi');
    } catch (err) {
      const msg = err instanceof ClaudeApiError ? err.message : t.vaaniGenericError;
      patch(prev => ({
        vaaniMessages: [...prev.vaaniMessages, { role: 'assistant', hi: 'माफ़ कीजिए, कुछ गड़बड़ हुई।', en: msg }],
        vaaniLoading: false, vaaniError: msg,
      }));
    }
  };

  const actionToScreen: Record<string, () => void> = {
    enroll_pmsby: () => onOpenSchemeDetail('pmsby'),
    enroll_pmjjby: () => onOpenSchemeDetail('pmjjby'),
    enroll_pmjay: () => onOpenSchemeDetail('pmjay'),
    enroll_hospicash: () => onOpenSchemeDetail('hospicash'),
    invest: () => patch({ screen: 'investlist' }),
    borrow_compare: () => patch({ screen: 'borrow' }),
  };
  const onGoToRecommendation = () => {
    const rec = s.vaaniRecommendation;
    // A researched scheme lives with its provider, not inside DhanSathi — open
    // their official page and keep the chat open so Vaani can walk them through it.
    if (rec?.action === 'explore_scheme') {
      if (rec.url) window.open(rec.url, '_blank', 'noopener,noreferrer');
      else sendVaaniUserMessage(t.askForSchemeDetails);
      return;
    }
    patch({ vaaniOpen: false });
    (actionToScreen[rec?.action || ''] || (() => patch({ screen: 'dashboard' })))();
  };

  const onAskVaaniToRegister = () => {
    const name = s.vaaniRecommendation?.schemeName;
    sendVaaniUserMessage(
      `Help me register for ${name || 'this scheme'}. Which documents do I need, where exactly do I apply, and what are the steps?`,
    );
  };

  const onChangeVaaniText = (v: string) => patch({ vaaniTextInput: v });
  const onVaaniInputKeydown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') sendVaaniUserMessage(s.vaaniTextInput); };

  const onMicToggle = () => {
    if (s.screen === 'borrow') {
      if (s.borrowListening) { recognitionRef.current?.stop(); return; }
      patch({ borrowListening: true });
      recognitionRef.current = listenOnce(s.lang, (transcript) => {
        const amtMatch = transcript.match(/(\d[\d,]*)/);
        const monthMatch = transcript.match(/(\d+)\s*(month|महीन)/i);
        patch(prev => ({
          borrowAmount: amtMatch ? amtMatch[1].replace(/,/g, '') : prev.borrowAmount,
          borrowMonths: monthMatch ? monthMatch[1] : prev.borrowMonths,
        }));
      }, () => patch({ borrowListening: false }));
      return;
    }
    if (s.vaaniListening) { recognitionRef.current?.stop(); return; }
    patch({ vaaniListening: true });
    recognitionRef.current = listenOnce(s.lang, (transcript) => {
      if (s.vaaniMode === 'enroll') {
        if (/yes|haan|हां|continue|ठीक/i.test(transcript)) onEnrollContinue();
      } else {
        sendVaaniUserMessage(transcript);
      }
    }, () => patch({ vaaniListening: false }));
  };

  // ---- financial tracker ----
  const onOpenTracker = (kind: 'income' | 'expense') =>
    patch(prev => ({
      screen: 'tracker', trackerKind: kind,
      trackerReturnScreen: prev.screen === 'dashboard' ? 'dashboard' : 'profile',
      trackerAmount: '', trackerCategoryId: null, trackerCustomCategory: '',
    }));

  const onSetTrackerKind = (kind: 'income' | 'expense') =>
    patch({ trackerKind: kind, trackerCategoryId: null, trackerCustomCategory: '' });

  // Keypad instead of a text field: the amount is the one number the user must
  // get right, and a big-target pad beats a phone keyboard for low-literacy use.
  const onTrackerKey = (key: string) => patch(prev => {
    if (key === 'del') return { trackerAmount: prev.trackerAmount.slice(0, -1) };
    if (key === '.') return prev.trackerAmount.includes('.') ? {} : { trackerAmount: (prev.trackerAmount || '0') + '.' };
    const next = prev.trackerAmount === '0' ? key : prev.trackerAmount + key;
    const decimals = next.split('.')[1];
    if (decimals && decimals.length > 2) return {};
    if (next.replace('.', '').length > 8) return {};
    return { trackerAmount: next };
  });

  const onSelectTrackerCategory = (id: string) =>
    patch({ trackerCategoryId: id, trackerCustomCategory: id === 'other' ? '' : '' });

  const onChangeTrackerCustomCategory = (v: string) => patch({ trackerCustomCategory: v.slice(0, 40) });

  const onSubmitTrackerEntry = () => {
    const amount = parseFloat(s.trackerAmount);
    if (!trackerEntryValid(s)) return;
    const entry: TrackerEntry = {
      id: 'tx-' + Date.now(),
      kind: s.trackerKind,
      amount,
      categoryId: s.trackerCategoryId!,
      customLabel: s.trackerCategoryId === 'other' ? s.trackerCustomCategory.trim() : '',
      at: Date.now(),
      source: 'manual',
    };
    patch(prev => ({
      trackerEntries: [entry, ...prev.trackerEntries],
      trackerAmount: '', trackerCategoryId: null, trackerCustomCategory: '',
      screen: prev.trackerReturnScreen,
    }));
    showToast(`\u20B9${fmt(amount)} ${entry.kind === 'income' ? t.incomeAdded : t.expenseAdded}`);
  };

  const onLinkBankFromProfile = () =>
    patch({ screen: 'aa', aaStep: 'consent', aaReturnScreen: 'profile' });

  // ---- investment ----
  const onChangeInvestSearch = (v: string) => patch({ investSearch: v });
  const onSelectInvestCategory = (key: string) => patch({ investCategory: key });
  const onToggleInvestSort = () => patch(p => ({ investSortByReturn: !p.investSortByReturn }));
  const onOpenProduct = (id: string) => patch({ selectedInvestId: id, investAmount: '', investConfirmed: false, screen: 'investdetail' });
  const onChangeInvestAmount = (v: string) => patch({ investAmount: v });
  const onConfirmInvest = () => {
    const p = INVESTMENTS.find(x => x.id === s.selectedInvestId);
    const amt = parseInt(s.investAmount, 10);
    if (!p || !(amt >= p.min)) return;
    patch(prev => ({ investConfirmed: true, investedAmount: prev.investedAmount + amt }));
  };

  // ---- borrowing ----
  const onChangeBorrowAmount = (v: string) => patch({ borrowAmount: v });
  const onChangeBorrowMonths = (v: string) => patch({ borrowMonths: v });
  const onSubmitBorrow = () => { if (parseInt(s.borrowAmount, 10) > 0) patch({ screen: 'borrowcompare' }); };
  const onSkipVaani = () => patch(p => ({ borrowAmount: p.borrowAmount || '5000', borrowMonths: p.borrowMonths || '3', screen: 'borrowcompare' }));
  const onUseSavings = () => {
    patch({ toastMessage: t.useSavingsToast });
    setTimeout(() => patch({ screen: 'dashboard', toastMessage: '' }), 1800);
  };
  const onRevokeAA = () => patch(prev => ({
    aaLinked: false,
    trackerEntries: prev.trackerEntries.filter(e => e.source === 'manual'),
  }));

  const tabActive = (key: string, screen: Screen) => {
    if (key === 'dashboard') return screen === 'dashboard';
    if (key === 'insurance') return screen === 'insurance' || screen === 'insurancedetail';
    if (key === 'invest') return screen === 'investlist' || screen === 'investdetail';
    if (key === 'borrow') return screen === 'borrow' || screen === 'borrowcompare';
    return false;
  };

  const selectedScheme = SCHEMES.find(x => x.id === s.selectedSchemeId) || SCHEMES[0];
  const selectedProduct = INVESTMENTS.find(x => x.id === s.selectedInvestId) || INVESTMENTS[0];
  const riskRank = s.riskTier === 'Growth' ? 2 : s.riskTier === 'Moderate' ? 1 : 0;
  let investmentProductsList = INVESTMENTS.filter(p => p.tierRank <= riskRank);
  if (s.investCategory !== 'all') investmentProductsList = investmentProductsList.filter(p => p.category === s.investCategory);
  if (s.investSearch.trim()) investmentProductsList = investmentProductsList.filter(p => p.name.toLowerCase().includes(s.investSearch.trim().toLowerCase()));
  if (s.investSortByReturn) investmentProductsList = [...investmentProductsList].sort((a, b) => parseFloat(b.returnPct) - parseFloat(a.returnPct));

  const amount = parseInt(s.borrowAmount, 10) || 0;
  const months = parseInt(s.borrowMonths, 10) || 0;
  const moneylenderInterest = amount * 0.05 * months;
  const mudraInterest = amount * (0.105 / 12) * months;
  const investAmt = parseInt(s.investAmount, 10) || 0;

  // Picks the English or Hindi variant of a piece of content data. Content
  // (scheme copy, fund names, bank names) lives in the data file as paired
  // fields rather than in the EN/HI string packs, so screens resolve it here.
  const L = (en: string, hi: string) => (s.lang === 'hi' ? hi || en : en);

  const derived = {
    t, L, selectedScheme, selectedProduct, investmentProductsList,
    // "2 of 5" does not survive a word-for-word translation — Hindi puts the
    // total first ("5 में से 2"), so counters render as a plain fraction there.
    ofLabel: (current: number, total: number) => (s.lang === 'hi' ? `${current}/${total}` : `${current} ${t.of} ${total}`),
    riskTierLabel: riskTierLabel(s.riskTier, t),
    quizProgress: Math.min(s.quizIndex, QUIZ.length - 1),
    currentQuestion: QUIZ[Math.min(s.quizIndex, QUIZ.length - 1)],
    dashboardSchemes: SCHEMES.filter(x => !s.enrolledSchemes.includes(x.id)).slice(0, 2),
    enrolledSchemesList: SCHEMES.filter(x => s.enrolledSchemes.includes(x.id)),
    insuranceSchemesList: SCHEMES.filter(x => !s.enrolledSchemes.includes(x.id)),
    selectedIncomeTypeLabel: (() => {
      const it = INCOME_TYPES.find(x => x.id === s.incomeTypeId);
      if (!it) return '—';
      return s.lang === 'hi' ? it.labelHi : it.label;
    })(),
    riskTierDescription: riskDescription(s.riskTier, t),
    enrollStepContent: enrollStepContent(s.enrollSchemeId, s.enrollStep),
    moneylenderInterest, mudraInterest, borrowSavings: moneylenderInterest - mudraInterest,
    projected1Month: investAmt * (1 + parseFloat(selectedProduct.returnPct) / 100 / 12),
    projected1Year: investAmt * (1 + parseFloat(selectedProduct.returnPct) / 100),
    monthlyIncome, monthlyExpenses, availableBalance, monthlyBudget, budgetUsedPct, healthScore,
    trackedIncomeTotal, trackedExpenseTotal,
    balanceTotalFmt: fmt(availableBalance),
    healthStanding: healthScore >= 60 ? t.standingGood : healthScore >= 25 ? t.standingFair : t.standingLow,
    healthNote: monthlyIncome === 0 ? t.healthNoteEmpty
      : healthScore >= 60 ? t.healthNoteGood
      : healthScore >= 25 ? t.healthNoteFair
      : t.healthNoteLow,
    trackerCategoryList: trackerCategories(s.trackerKind),
    profileDraftValid: s.profileDraft ? profileDraftValid(s.profileDraft) : false,
    trackerEntryValid: trackerEntryValid(s),
    trackerAmountDisplay: s.trackerAmount || '0',
    recentEntries: s.trackerEntries.slice(0, 8),
    entryLabel: (e: TrackerEntry) => trackerEntryLabel(e, s.lang),
    tabActive,
    fmt,
  };

  return {
    s, patch, derived,
    actions: {
      onSplashDone, onChooseLang, onToggleLanguage, onOpenProfile, onBack, onOpenTab,
      onChangePhone, onChangeAuthTab, onRequestOtp, onOtpDigitChange, onResendOtp, onVerifyOtp,
      onChangeProfileName, onChangeProfileDob, onChangeProfileGender, onChangeProfileArea, onSubmitProfileDetails,
      onOpenProfileEditor, onChangeProfileDraft, onCancelProfileEdits, onSaveProfileEdits,
      onSelectIncomeType, onContinueIncome, onConfirmAntiscam,
      onStartAALink, onSkipToManual, onSelectProvider, onManualIncomeChange, onSubmitManual,
      onAnswerQuiz, onContinueToDashboard, onRetakeQuiz,
      onOpenSchemeDetail, onTermsRead, onEnrollWithVaani, onEnrollSelectedScheme, onEnrollContinue,
      onDownloadCertificate, onShareCertificate, onBackDashboard, onCloseVaani,
      onOpenGeneralVaani, sendVaaniUserMessage, onGoToRecommendation, onAskVaaniToRegister, onChangeVaaniText, onVaaniInputKeydown, onMicToggle,
      onOpenTracker, onSetTrackerKind, onTrackerKey, onSelectTrackerCategory,
      onChangeTrackerCustomCategory, onSubmitTrackerEntry, onLinkBankFromProfile,
      onChangeInvestSearch, onSelectInvestCategory, onToggleInvestSort, onOpenProduct, onChangeInvestAmount, onConfirmInvest,
      onChangeBorrowAmount, onChangeBorrowMonths, onSubmitBorrow, onSkipVaani, onUseSavings, onRevokeAA,
    },
  };
}

type StoreValue = ReturnType<typeof useAppStoreImpl>;
const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const value = useAppStoreImpl();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
