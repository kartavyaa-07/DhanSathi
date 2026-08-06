// Seed data ported verbatim from the DhanSathi Claude Design prototype
// (DhanSathi.dc.html / DhanSathi Desktop.dc.html — data-dc-script block).

export interface Scheme {
  id: string;
  nameEn: string;
  nameHi: string;
  fullNameEn: string;
  category: string;
  premiumEn: string;
  coverEn: string;
  cover: string;
  premium: string;
  payEn: string;
  getEn: string;
  exitEn: string;
  lockIn: string;
  time: string;
  officialUrl: string;
}

export const SCHEMES: Scheme[] = [
  { id: 'pmsby', nameEn: 'PMSBY', nameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना', fullNameEn: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)', category: 'Accident', premiumEn: '₹20/year', coverEn: '₹2 lakh accidental death & disability cover', cover: '₹2,00,000', premium: '₹20/year', payEn: '₹20 is auto-debited once a year from your linked bank account, every June 1st. That is about ₹1.7 per month.', getEn: '₹2 lakh if death or full disability from an accident. ₹1 lakh for partial disability. No hospital bills needed to claim — just an accident report.', exitEn: 'Cancel anytime by telling your bank to stop the auto-debit. No penalty, no paperwork, nothing to return.', lockIn: 'None', time: '~5 min', officialUrl: 'https://www.jansuraksha.gov.in' },
  { id: 'pmjjby', nameEn: 'PMJJBY', nameHi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना', fullNameEn: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)', category: 'Life', premiumEn: '₹436/year', coverEn: '₹2 lakh life cover for your family', cover: '₹2,00,000', premium: '₹436/year', payEn: '₹436 is auto-debited once a year from your linked bank account, every June 1st. That is under ₹37 per month.', getEn: 'Your family receives ₹2 lakh if something happens to you, for any reason. Paid directly to your nominee within 30 days.', exitEn: 'Cancel anytime by telling your bank to stop the auto-debit. No penalty.', lockIn: 'None', time: '~7 min', officialUrl: 'https://www.jansuraksha.gov.in' },
  { id: 'pmjay', nameEn: 'PM-JAY (Ayushman Bharat)', nameHi: 'प्रधानमंत्री जन आरोग्य योजना', fullNameEn: 'Pradhan Mantri Jan Arogya Yojana (Ayushman Bharat)', category: 'Health', premiumEn: 'Free', coverEn: '₹5 lakh/family/year hospital cover', cover: '₹5,00,000/year', premium: 'Free (Govt. funded)', payEn: 'This scheme is free. The government pays the full premium for eligible families — you pay nothing.', getEn: '₹5 lakh per family per year for hospital treatment, at any listed government or private hospital. Cashless — no bills to pay upfront.', exitEn: 'No enrollment to exit — coverage renews automatically every year as long as you remain eligible.', lockIn: 'None', time: '~10 min', officialUrl: 'https://pmjay.gov.in' },
  { id: 'hospicash', nameEn: 'Hospi-Cash', nameHi: 'हॉस्पि-कैश योजना', fullNameEn: 'Hospi-Cash Daily Benefit Plan', category: 'Health', premiumEn: '₹100/month', coverEn: '₹500/day cash while hospitalised', cover: '₹500/day', premium: '₹100/month', payEn: '₹100 is auto-debited every month from your linked bank account. You can pause anytime.', getEn: '₹500 cash for every day you are admitted in hospital, up to 15 days a year — on top of any other insurance you have.', exitEn: 'Cancel anytime before the next monthly debit. No penalty, no minimum term.', lockIn: 'None', time: '~6 min', officialUrl: 'https://www.irdai.gov.in' },
];

export interface Investment {
  id: string;
  name: string;
  tierRank: number;
  category: string;
  returnPct: string;
  withdrawBadge: string;
  min: number;
  reg: string;
}

export const INVESTMENTS: Investment[] = [
  { id: 'overnight', name: 'Overnight Fund', tierRank: 0, category: 'liquid', returnPct: '6.4%', withdrawBadge: 'Withdraw within 1 day', min: 500, reg: 'SEBI-regulated · AMFI' },
  { id: 'liquid', name: 'Liquid Fund', tierRank: 0, category: 'liquid', returnPct: '6.8%', withdrawBadge: 'Withdraw within 1-2 days', min: 500, reg: 'SEBI-regulated · AMFI' },
  { id: 'ultrashort', name: 'Ultra Short-Term Fund', tierRank: 1, category: 'shortterm', returnPct: '7.2%', withdrawBadge: 'Withdraw within 2 days', min: 1000, reg: 'SEBI-regulated · AMFI' },
  { id: 'shortdebt', name: 'Short-Term Debt Fund', tierRank: 2, category: 'shortterm', returnPct: '8.1%', withdrawBadge: '30-day lock-in', min: 1000, reg: 'SEBI-regulated · AMFI' },
];

export const INVEST_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'liquid', label: 'Liquid Funds' },
  { key: 'shortterm', label: 'Short-Term' },
];

export interface IncomeType { id: string; label: string; labelHi: string; sublabel: string; sublabelHi: string }

export const INCOME_TYPES: IncomeType[] = [
  { id: 'office', label: 'Salaried / Office employee', labelHi: 'वेतनभोगी / ऑफिस कर्मचारी', sublabel: 'Company job, fixed monthly salary', sublabelHi: 'कंपनी की नौकरी, तय मासिक वेतन' },
  { id: 'business', label: 'Micro-entrepreneur', labelHi: 'सूक्ष्म उद्यमी', sublabel: 'Shop, stall, or small business owner', sublabelHi: 'दुकान, स्टॉल, या छोटा व्यवसाय' },
  { id: 'delivery', label: 'Field & Delivery employee', labelHi: 'फील्ड और डिलीवरी कर्मचारी', sublabel: 'Auto, cab, or delivery partner', sublabelHi: 'ऑटो, कैब, या डिलीवरी पार्टनर' },
  { id: 'domestic', label: 'House and Care Work', labelHi: 'घर और देखभाल का काम', sublabel: 'Domestic help, caregiving, cooking', sublabelHi: 'घरेलू सहायता, देखभाल, खाना बनाना' },
  { id: 'freelance', label: 'Freelancing & Gigs', labelHi: 'फ्रीलांसिंग और गिग वर्क', sublabel: 'Project-based or contract work', sublabelHi: 'प्रोजेक्ट या कॉन्ट्रैक्ट आधारित काम' },
  { id: 'other', label: 'Others', labelHi: 'अन्य', sublabel: 'Something else not listed here', sublabelHi: 'यहां सूचीबद्ध कुछ और' },
];

export const PROVIDERS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Other Bank'];

export interface QuizOption { en: string; hi: string; score: number }
export interface QuizQuestion { textEn: string; textHi: string; options: QuizOption[] }

export const QUIZ: QuizQuestion[] = [
  { textEn: 'How steady is your monthly income?', textHi: 'आपकी मासिक आय कितनी स्थिर है?', options: [
    { en: 'Fixed every month', hi: 'हर महीने तय', score: 2 },
    { en: 'Varies a bit', hi: 'थोड़ा बदलता है', score: 1 },
    { en: 'Changes a lot', hi: 'बहुत बदलता है', score: 0 },
  ]},
  { textEn: 'If you suddenly needed ₹10,000, could you manage it?', textHi: 'अगर अचानक ₹10,000 की जरूरत पड़े, तो क्या आप संभाल सकते हैं?', options: [
    { en: 'Yes, easily', hi: 'हां, आसानी से', score: 2 },
    { en: 'With some difficulty', hi: 'थोड़ी मुश्किल से', score: 1 },
    { en: 'No, I would have to borrow', hi: 'नहीं, उधार लेना पड़ेगा', score: 0 },
  ]},
  { textEn: 'How many people depend on your income?', textHi: 'आपकी आय पर कितने लोग निर्भर हैं?', options: [
    { en: 'Just me', hi: 'सिर्फ मैं', score: 2 },
    { en: '1-2 people', hi: '1-2 लोग', score: 1 },
    { en: '3 or more', hi: '3 या ज्यादा', score: 0 },
  ]},
  { textEn: 'Do you already have any savings or investments?', textHi: 'क्या आपकी पहले से कोई बचत या निवेश है?', options: [
    { en: 'Yes, regularly', hi: 'हां, नियमित रूप से', score: 2 },
    { en: 'A little, sometimes', hi: 'थोड़ा, कभी-कभी', score: 1 },
    { en: 'No, none', hi: 'नहीं, बिलकुल नहीं', score: 0 },
  ]},
  { textEn: 'If you invest, how soon might you need that money back?', textHi: 'अगर आप निवेश करें, तो पैसा वापस कब चाहिए हो सकता है?', options: [
    { en: 'Fine locking it 30+ days for better returns', hi: 'बेहतर रिटर्न के लिए 30+ दिन लॉक कर सकता हूं', score: 2 },
    { en: 'Would prefer it back within a week', hi: 'एक हफ्ते में वापस चाहिए', score: 1 },
    { en: 'I need it available anytime, no exceptions', hi: 'मुझे कभी भी चाहिए, कोई अपवाद नहीं', score: 0 },
  ]},
];

export const EN = {
  continue: 'Continue', incomeTitle: 'What best describes your work?', incomeSubtitle: 'This helps us find schemes you qualify for.',
  antiscamTitle: 'Before we begin, a promise.', iUnderstand: 'I understand',
  aaTitle: 'Link your bank account', aaScopeLabel: 'WHAT WE ACCESS', linkBank: 'Link Bank Account', enterManually: 'Enter income manually instead',
  chooseBank: 'Choose your bank', linking: 'Linking your account securely…',
  manualIncomeTitle: 'What is your approximate monthly income?', manualIncomePlaceholder: 'e.g. 15000',
  yourRiskProfile: 'Your risk profile', goToDashboard: 'Go to Dashboard',
  searchPlaceholder: 'Search schemes, guides, or resources...', healthScoreTitle: 'Financial Health Score', goodStanding: 'Good Standing', healthScoreNote: 'Your savings habit is improving.',
  totalBalance: 'Total Available Balance', income: 'Income', expenses: 'Expenses', myInvestments: 'My Investments', view: 'View',
  recommendedForYou: 'Recommended for You', lastUpdated: 'Last updated', searchSchemes: 'Search schemes...', yourProtection: 'Your Protection', active: 'Active',
  recommendedSchemes: 'Recommended Schemes', enrollWithVaani: 'Enroll with Vaani',
  whatYouPay: 'What you pay', whatYouGet: 'What you get', exitConditions: 'Exit conditions', lockIn: 'Lock-in period', verifyOfficial: 'Verify on official government site',
  vaaniThinking: 'Vaani is thinking…', recommendation: 'Vaani’s recommendation', talkToHuman: 'Need to talk to a human? Tap here',
  typeOrSay: 'Type or say something...', name: 'Name', incomeType: 'Income type', monthlyIncomeLabel: 'Monthly income',
  enrolledSuccess: 'You’re enrolled!', certificate: 'CERTIFICATE', coverageAmount: 'Coverage', premium: 'Premium', refId: 'Reference ID',
  download: 'Download', share: 'Share', backToDashboard: 'Back to Dashboard',
  yourProfile: 'Your profile', liquidOptionsShown: 'liquid options shown', annualReturn: 'annual return', minInvestment: 'Min investment',
  searchInvestments: 'Search investment options...', noInvestmentsFound: 'No investment options match your search.',
  amountToInvest: 'Amount to invest', minimumIs: 'Minimum is', projected1Month: 'Projected value in 1 month', projected1Year: 'Projected value in 1 year',
  confirmInvest: 'Confirm Investment', investmentConfirmed: 'Investment confirmed!', investedIn: 'invested in',
  borrowingQuestion: 'How much do you need, and for how long?', amountPlaceholder: 'Amount needed (₹)', termPlaceholder: 'Repayment term (months)',
  seeMyOptions: 'See my options', skipShowOptions: 'Skip — show loan options',
  useSavingsTitle: 'You may not need to borrow', useSavingsBody: 'Your DhanSathi savings balance is', useSavingsCta: 'Use my savings instead',
  costComparison: 'Cost comparison for your loan', moneylender: 'Informal moneylender', totalInterestFor: 'Total interest for', months: 'months', monthShort: 'month', yearShort: 'year',
  govtScheme: 'Govt. scheme', youSave: 'You save', applyMudra: 'Apply for PM Mudra on Jan Samarth',
  riskProfileLabel: 'Risk profile', retake: 'Retake quiz', aaStatusLabel: 'Bank account link', revoke: 'Revoke', language: 'Language', reportScam: 'Report a scam call',
  apiKeyLabel: 'Claude API key', apiKeySaved: 'Saved', apiKeyPlaceholder: 'sk-ant-...', apiKeyHelp: 'Stored only in this browser. Needed for Vaani to respond.',

  splashTagline: 'Your money, made simple.',
  antiscamBody: 'DhanSathi will never call or message you asking for an OTP, password, or bank details. If anyone claims to be from DhanSathi and asks for these, it is a scam.',
  aaConsentBody: 'DhanSathi will read your last 6 months of bank transaction history, used only to understand your income and expenses. You can revoke this consent anytime from Settings — data deletes within 24 hours. This is via RBI-regulated Account Aggregator, not screen-sharing.',
  logIn: 'Log In', signUp: 'Sign Up', mobileNumber: 'Mobile Number', enterMobileNumber: 'Enter 10 digit number', getOtp: 'Get OTP',
  secureAndTrusted: '100% Secure & Trusted', agreeToTerms: "By continuing, you agree to DhanSathi's Terms.", help: 'Help',
  verifyPhone: 'Verify Phone', enterOtpSent: 'Enter the code sent to your phone.', didntReceiveCode: "Didn't receive code?", resendIn: 'Resend in', verifyAndProceed: 'Verify & Proceed',
  personalDetailsTitle: 'Personal Details', personalDetailsSubtitle: 'Tell us about yourself to tailor your DhanSathi experience.', step: 'Step', of: 'of', profileSetup: 'Profile Setup',
  fullName: 'Full Name', dateOfBirth: 'Date of Birth', gender: 'Gender', male: 'Male', female: 'Female', other: 'Other', residentialArea: 'Residential Area', selectYourArea: 'Select your area',
  needHelp: 'Need Help?', tapVaaniToSpeak: 'Tap the Vaani icon below to speak your details',
  occupationTitle: 'What best describes your work?', occupationSubtitle: 'This helps us find schemes you qualify for.',
  riskDoneHeadline: "You're all set!", riskDoneSubtext: "You're one step closer to a stronger financial future.",
  riskConservativeDesc: "You're conservative — we'll only show you liquid options you can withdraw anytime, with no lock-in.",
  riskModerateDesc: "You're moderate — we'll show liquid and short-term options, nothing locked beyond a few days.",
  riskGrowthDesc: "You're growth-oriented — you're comfortable with some lock-in for better returns, so we'll include short-term options too.",
};

export const HI: typeof EN = Object.assign({}, EN, {
  continue: 'आगे बढ़ें', incomeTitle: 'आपका काम किस तरह का है?', incomeSubtitle: 'इससे हमें आपके लिए सही योजनाएं ढूंढने में मदद मिलेगी।',
  antiscamTitle: 'शुरू करने से पहले, एक वादा।', iUnderstand: 'मैं समझ गया/गई',
  aaTitle: 'अपना बैंक खाता जोड़ें', aaScopeLabel: 'हम क्या एक्सेस करते हैं', linkBank: 'बैंक खाता जोड़ें', enterManually: 'इसके बजाय आय खुद बताएं',
  chooseBank: 'अपना बैंक चुनें', linking: 'आपका खाता सुरक्षित रूप से जोड़ा जा रहा है…',
  manualIncomeTitle: 'आपकी लगभग मासिक आय क्या है?', manualIncomePlaceholder: 'जैसे 15000',
  yourRiskProfile: 'आपकी जोखिम प्रोफ़ाइल', goToDashboard: 'डैशबोर्ड पर जाएं',
  searchPlaceholder: 'योजनाएं, गाइड खोजें...', healthScoreTitle: 'वित्तीय स्वास्थ्य स्कोर', goodStanding: 'अच्छी स्थिति',
  totalBalance: 'कुल उपलब्ध राशि', income: 'आय', expenses: 'खर्च', myInvestments: 'मेरे निवेश', view: 'देखें',
  recommendedForYou: 'आपके लिए सुझाव', searchSchemes: 'योजनाएं खोजें...', yourProtection: 'आपकी सुरक्षा', active: 'सक्रिय',
  recommendedSchemes: 'सुझाई गई योजनाएं', enrollWithVaani: 'वाणी के साथ Enroll करें',
  whatYouPay: 'आप क्या देंगे', whatYouGet: 'आपको क्या मिलेगा', exitConditions: 'बाहर निकलने की शर्तें', lockIn: 'लॉक-इन अवधि', verifyOfficial: 'सरकारी वेबसाइट पर जांचें',
  talkToHuman: 'किसी इंसान से बात करनी है? यहां टैप करें', typeOrSay: 'लिखें या बोलें...',
  enrolledSuccess: 'आप नामांकित हो गए हैं!', download: 'डाउनलोड करें', share: 'शेयर करें', backToDashboard: 'डैशबोर्ड पर वापस जाएं',
  confirmInvest: 'निवेश की पुष्टि करें', investmentConfirmed: 'निवेश की पुष्टि हो गई!',
  borrowingQuestion: 'आपको कितनी राशि चाहिए, और कितने समय के लिए?', seeMyOptions: 'मेरे विकल्प देखें', skipShowOptions: 'छोड़ें — लोन विकल्प दिखाएं',
  applyMudra: 'जन समर्थ पर PM Mudra के लिए आवेदन करें',

  antiscamBody: 'DhanSathi कभी OTP, पासवर्ड, या बैंक डिटेल्स फोन या मैसेज पर नहीं मांगेगा। अगर कोई DhanSathi के नाम से मांगे, वह फ्रॉड है।',
  aaConsentBody: 'DhanSathi आपके बैंक खाते के पिछले 6 महीने का लेन-देन इतिहास पढ़ेगा। इसका इस्तेमाल सिर्फ आपकी आय समझने के लिए होगा। आप कभी भी सहमति वापस ले सकते हैं। डेटा 24 घंटे में डिलीट हो जाता है। यह RBI-नियंत्रित अकाउंट एग्रीगेटर के माध्यम से है, स्क्रीन-शेयरिंग नहीं।',
  logIn: 'लॉग इन', signUp: 'साइन अप', mobileNumber: 'मोबाइल नंबर', enterMobileNumber: '10 अंकों का नंबर दर्ज करें', getOtp: 'ओटीपी प्राप्त करें',
  secureAndTrusted: '100% सुरक्षित और भरोसेमंद', agreeToTerms: 'जारी रखने पर, आप DhanSathi की शर्तों से सहमत होते हैं।', help: 'मदद',
  verifyPhone: 'फोन सत्यापित करें', enterOtpSent: 'अपने फोन पर भेजा गया कोड दर्ज करें।', didntReceiveCode: 'कोड नहीं मिला?', resendIn: 'में फिर से भेजें', verifyAndProceed: 'सत्यापित करें और आगे बढ़ें',
  personalDetailsTitle: 'व्यक्तिगत विवरण', personalDetailsSubtitle: 'आपके अनुभव को बेहतर बनाने के लिए अपने बारे में बताएं।', step: 'चरण', of: 'में से', profileSetup: 'प्रोफाइल सेटअप',
  fullName: 'पूरा नाम', dateOfBirth: 'जन्म तिथि', gender: 'लिंग', male: 'पुरुष', female: 'महिला', other: 'अन्य', residentialArea: 'रिहायशी इलाका', selectYourArea: 'अपना इलाका चुनें',
  needHelp: 'मदद चाहिए?', tapVaaniToSpeak: 'अपनी जानकारी बोलने के लिए वाणी आइकन पर टैप करें',
  occupationTitle: 'आपका काम किस तरह का है?', occupationSubtitle: 'इससे हमें आपके लिए सही योजनाएं ढूंढने में मदद मिलेगी।',
  riskDoneHeadline: 'आप तैयार हैं!', riskDoneSubtext: 'आप एक मजबूत वित्तीय भविष्य की ओर एक कदम और करीब हैं।',
  riskConservativeDesc: 'आप सतर्क निवेशक हैं — हम आपको सिर्फ ऐसे विकल्प दिखाएंगे जिन्हें आप कभी भी बिना लॉक-इन के निकाल सकते हैं।',
  riskModerateDesc: 'आप संतुलित निवेशक हैं — हम आपको लिक्विड और शॉर्ट-टर्म विकल्प दिखाएंगे, कुछ ही दिनों के लॉक-इन के साथ।',
  riskGrowthDesc: 'आप विकास-उन्मुख निवेशक हैं — आप बेहतर रिटर्न के लिए कुछ लॉक-इन सहज हैं, इसलिए हम शॉर्ट-टर्म विकल्प भी शामिल करेंगे।',
});

export function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-IN');
}
