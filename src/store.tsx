import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { EN, HI, SCHEMES, INVESTMENTS, QUIZ, INCOME_TYPES, fmt } from './data';
import { buildVaaniSystemPrompt, completeVaaniTurn, parseVaaniReply, ClaudeApiError } from './lib/claude';
import { speak, stopSpeaking, listenOnce, type RecognitionHandle } from './lib/voice';
import { downloadCertificatePdf } from './lib/pdf';

export type Screen =
  | 'splash' | 'lang' | 'phoneauth' | 'otp' | 'profiledetails'
  | 'income' | 'antiscam' | 'aa' | 'quiz' | 'quizresult' | 'dashboard'
  | 'insurance' | 'insurancedetail' | 'vaani' | 'enrollsuccess'
  | 'investlist' | 'investdetail' | 'borrow' | 'borrowcompare' | 'profile';

export interface VaaniMessage { role: 'user' | 'assistant'; hi: string; en: string }
export interface Certificate { schemeName: string; userName: string; cover: string; premium: string; refId: string }
export interface VaaniRecommendation { summary: string; ctaLabel: string; action: string }

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
  monthlyIncome: number;
  monthlyExpenses: number;
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
  savingsBalance: number;
  profileName: string;
}

const initialState: AppState = {
  screen: 'splash', lang: 'en',
  phoneNumber: '', authTab: 'login', otpDigits: ['', '', '', '', '', ''], otpResendSeconds: 45,
  profileDob: '', profileGender: null, profileArea: '',
  incomeTypeId: null,
  aaStep: 'consent', aaLinked: false, manualIncome: '', monthlyIncome: 18200, monthlyExpenses: 6400,
  quizIndex: 0, riskScore: 0, riskTier: null,
  enrolledSchemes: [], selectedSchemeId: null, tcScrolled: false,
  vaaniOpen: false, vaaniMode: 'general', vaaniMessages: [], vaaniHistory: [], vaaniListening: false, vaaniLoading: false,
  vaaniTextInput: '', vaaniQuestionCount: 0, vaaniRecommendation: null, vaaniReturnScreen: 'dashboard', vaaniError: '',
  enrollSchemeId: null, enrollStep: 0,
  certificate: null, toastMessage: '',
  investedAmount: 0, selectedInvestId: null, investAmount: '', investConfirmed: false,
  investSearch: '', investCategory: 'all', investSortByReturn: false,
  borrowAmount: '', borrowMonths: '3', borrowListening: false,
  savingsBalance: 8600,
  profileName: 'Truptimayee',
};

const BACK_MAP: Partial<Record<Screen, Screen>> = {
  phoneauth: 'lang', otp: 'phoneauth', profiledetails: 'otp',
  income: 'profiledetails', antiscam: 'income', aa: 'antiscam', quiz: 'aa',
  insurancedetail: 'insurance', investdetail: 'investlist', borrowcompare: 'borrow', profile: 'dashboard',
};

function enrollStepContent(schemeId: string | null, step: number) {
  const sc = SCHEMES.find(s => s.id === schemeId);
  const steps = [
    { hi: `चलिए ${sc?.nameHi || sc?.nameEn} शुरू करते हैं। आप देंगे ${sc?.premiumEn}, और मिलेगा ${sc?.coverEn}। कोई लॉक-इन नहीं है।`, en: `Let's start your ${sc?.nameEn}. You pay ${sc?.premiumEn}, you get ${sc?.coverEn}. There is no lock-in.` },
    { hi: `मैं आपकी प्रोफाइल से यह जानकारी ले रही हूं। कृपया जांच लें।`, en: `I'm using these details from your profile. Please confirm they're correct.` },
    { hi: `भुगतान आपके जुड़े हुए बैंक खाते से होगा।`, en: `The payment will go from your linked bank account.` },
    { hi: `बहुत बढ़िया! मैं आपका आवेदन जमा कर रही हूं...`, en: `Great! Submitting your enrollment now...` },
  ];
  // Vaani chat is intentionally bilingual-always — kept out of the onboarding
  // strict-single-language rule. `lang` param retained for callers that want
  // to pick a single string for voice playback (see speak() call sites).
  return steps[step] || steps[0];
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    enroll_pmsby: 'Enroll in PMSBY', enroll_pmjjby: 'Enroll in PMJJBY', enroll_pmjay: 'View PM-JAY',
    enroll_hospicash: 'Enroll in Hospi-Cash', invest: 'See investment options', borrow_compare: 'Compare borrowing options',
  };
  return labels[action] || 'Continue';
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

  // ---- navigation ----
  const onSplashDone = () => patch({ screen: 'lang' });
  const onChooseLang = (l: 'en' | 'hi') => patch({ lang: l, screen: 'phoneauth' });
  const onToggleLanguage = () => patch(p => ({ lang: p.lang === 'hi' ? 'en' : 'hi' }));
  const onOpenProfile = () => patch({ screen: 'profile' });
  const onBack = () => { const b = BACK_MAP[s.screen]; if (b) patch({ screen: b }); };
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

  // ---- onboarding ----
  const onSelectIncomeType = (id: string) => patch({ incomeTypeId: id });
  const onContinueIncome = () => { if (s.incomeTypeId) patch({ screen: 'antiscam' }); };
  const onConfirmAntiscam = () => patch({ screen: 'aa' });
  const onStartAALink = () => patch({ aaStep: 'providers' });
  const onSkipToManual = () => patch({ aaStep: 'manual' });
  const onSelectProvider = () => {
    patch({ aaStep: 'linking' });
    setTimeout(() => patch({ aaStep: 'done', aaLinked: true, screen: 'quiz' }), 1600);
  };
  const onManualIncomeChange = (v: string) => patch({ manualIncome: v });
  const onSubmitManual = () => {
    const v = parseInt(s.manualIncome, 10);
    if (v > 0) patch({ monthlyIncome: v, monthlyExpenses: Math.round(v * 0.35), aaLinked: false, screen: 'quiz' });
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
  const onScrollTC = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!s.tcScrolled && el.scrollTop + el.clientHeight >= el.scrollHeight - 40) patch({ tcScrolled: true });
  };

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
          certificate: { schemeName: sc.fullNameEn, userName: prev.profileName, cover: sc.cover, premium: sc.premium, refId: ref },
          screen: 'enrollsuccess', vaaniOpen: false,
        }));
      }, 1400);
    }
  };

  const onDownloadCertificate = () => {
    if (s.certificate) downloadCertificatePdf(s.certificate);
    patch({ toastMessage: 'Certificate.pdf downloaded' });
    setTimeout(() => patch({ toastMessage: '' }), 2500);
  };
  const onShareCertificate = () => {
    const c = s.certificate;
    if (!c) return;
    const text = `I just enrolled in ${c.schemeName} via DhanSathi! ${c.cover} cover for ${c.premium}.`;
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
        incomeTypeId: s.incomeTypeId, monthlyIncome: s.monthlyIncome, monthlyExpenses: s.monthlyExpenses,
        riskTier: s.riskTier, enrolledSchemes: s.enrolledSchemes, vaaniQuestionCount: s.vaaniQuestionCount,
      });
      const history = [...s.vaaniHistory, { role: 'user' as const, content: text }];
      const raw = await completeVaaniTurn(system, history);
      const parsed = parseVaaniReply(raw);
      const isFinal = parsed.action !== 'none';
      patch(prev => ({
        vaaniMessages: [...prev.vaaniMessages, { role: 'assistant', hi: parsed.hi, en: parsed.en }],
        vaaniHistory: [...prev.vaaniHistory, { role: 'assistant', content: raw }],
        vaaniLoading: false,
        vaaniQuestionCount: isFinal ? prev.vaaniQuestionCount : prev.vaaniQuestionCount + 1,
        vaaniRecommendation: isFinal ? { summary: parsed.en || parsed.hi, ctaLabel: actionLabel(parsed.action), action: parsed.action } : prev.vaaniRecommendation,
      }));
      speak(parsed.hi, 'hi');
    } catch (err) {
      const msg = err instanceof ClaudeApiError ? err.message : 'Sorry, something went wrong. Please try again.';
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
    const action = s.vaaniRecommendation?.action;
    patch({ vaaniOpen: false });
    (actionToScreen[action || ''] || (() => patch({ screen: 'dashboard' })))();
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
    patch({ toastMessage: 'Great — use your DhanSathi savings instead of borrowing.' });
    setTimeout(() => patch({ screen: 'dashboard', toastMessage: '' }), 1800);
  };
  const onRevokeAA = () => patch({ aaLinked: false });

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

  const derived = {
    t, selectedScheme, selectedProduct, investmentProductsList,
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
    balanceTotalFmt: fmt(s.monthlyIncome * 2 + s.savingsBalance - s.monthlyExpenses),
    tabActive,
    fmt,
  };

  return {
    s, patch, derived,
    actions: {
      onSplashDone, onChooseLang, onToggleLanguage, onOpenProfile, onBack, onOpenTab,
      onChangePhone, onChangeAuthTab, onRequestOtp, onOtpDigitChange, onResendOtp, onVerifyOtp,
      onChangeProfileName, onChangeProfileDob, onChangeProfileGender, onChangeProfileArea, onSubmitProfileDetails,
      onSelectIncomeType, onContinueIncome, onConfirmAntiscam,
      onStartAALink, onSkipToManual, onSelectProvider, onManualIncomeChange, onSubmitManual,
      onAnswerQuiz, onContinueToDashboard, onRetakeQuiz,
      onOpenSchemeDetail, onScrollTC, onEnrollWithVaani, onEnrollSelectedScheme, onEnrollContinue,
      onDownloadCertificate, onShareCertificate, onBackDashboard, onCloseVaani,
      onOpenGeneralVaani, sendVaaniUserMessage, onGoToRecommendation, onChangeVaaniText, onVaaniInputKeydown, onMicToggle,
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
